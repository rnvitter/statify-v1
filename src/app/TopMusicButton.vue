<template>
  <span>
    <v-btn @click.prevent="showTopMusicPreview = true" class="fr">
      Share
    </v-btn>

    <v-dialog v-model="showTopMusicPreview" fullscreen v-if="topMusicUsername">
      <div id="topMusic" style="margin: auto;" class="grey lighten-3">
        <v-toolbar color="white" height="80px">
          <v-toolbar-title style="color:black; margin-top:5px;">
            <div>
              {{ displayName }}'s Top {{ topMusicLimit }}
              {{ topMusicType | capitalize }} ({{ timePeriod[timeRange] }})
            </div>
            <v-btn
              style="color:#1db954" flat
              @click.native="hideTopMusic">Discover Your Top Songs and Arists
            </v-btn>
          </v-toolbar-title>
        </v-toolbar>
        <v-container fluid style="min-height:0;" grid-list-lg>
          <v-layout row wrap>
            <v-card>
              <albums style="margin-top:0" :data="topMusic"
                :timeRange="timeRange" :limit="limit" :type="topMusicType">
              </albums>
            </v-card>
          </v-layout>
        </v-container>
      </div>
    </v-dialog>

    <v-dialog v-model="showTopMusicPreview" max-width="400" v-else>
      <v-card>
        <v-alert v-model="successAlert" dismissible
          color="success" icon="check_circle">
          Link Copied to Clipboard
        </v-alert>
        <v-flex xs12>
          <v-flex xs10>
            <v-text-field
              id="share-link"
              name="share-link"
              color="green"
              style="margin:10px 30px 0 30px;"
              label="Click to get a link to share >"
              v-model="shareLink">
            </v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-btn flat icon style="color:#1db954; margin-top:20px" @click="getTopMusicIds">
              <v-icon>cached</v-icon>
            </v-btn>
          </v-flex>
        </v-flex>
        <v-flex xs12>
          <p style="margin:0 20px 10px 20px;">
            Copy this link to share your top {{ limit }} {{ type }} of the
            {{ timePeriod[timeRange] }} with your friends
          </p>
        </v-flex>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import axios from 'axios'
  import _ from 'lodash'

  import Albums from './Albums'

  import { BASE_URL } from '../constants'

  const name = 'TopMusicButton'

  const props = {
    username: { type: String, required: true },
    type: { type: String, required: true },
    timeRange: { type: String, required: true },
    limit: { type: Number, required: true }
  }

  const components = {
    Albums
  }

  const methods = {
    ...mapActions([
      'savetopMusicData',
      'savetopMusicUsername',
      'savetopMusicType',
      'savetopMusicLimit',
      'savetopMusicDialogState'
    ]),
    getTopMusicIds () {
      this.loading = true
      this.shareLink = null
      const query = '?time_range=' + this.timeRange + '&limit=' + this.limit
        axios.get('https://api.spotify.com/v1/me/top/' + this.type + query, {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
          }
        }).then((res) => {
          const ids = []
          _.forEach(res.data.items, song => {
            ids.push(song.id)
          })
          this.topMusicIds = ids.toString()
          this.getTopMusicData()
        }).catch((err) => {
          this.logout()
          this.tokenAlert = true
        })
    },
    getTopMusicData () {
      let type = null
      if (this.topMusicType) {
        type = this.topMusicType
      } else {
        type = this.type
      }
      axios.get(`https://api.spotify.com/v1/${type}/?ids=` + this.topMusicIds, {
        headers: {
          'Authorization': 'Bearer ' + this.accessToken
        }
      }).then((res) => {
        this.topMusic = res.data[type]
        this.getShareLink()
      }).catch((err) => {
        this.logout()
        this.tokenAlert = true
      })
    },
    clearTopMusic () {
      this.savetopMusicData(null)
      this.savetopMusicUsername(null)
      this.savetopMusicType(null)
      this.savetopMusicLimit(null)
      this.savetopMusicDialogState(null)
      this.topMusicIds = []
    },
    hideTopMusic () {
      this.showTopMusicPreview = false
      this.clearTopMusic()
    },
    getShareLink () {
      const data = 'data=' + btoa(this.topMusicIds)
      const user = 'username=' + btoa(this.username)
      const type = 'type=' + this.type
      const limit = 'limit=' + this.limit
      const show = 'showTopMusicPreview=true'
      this.shareLink = BASE_URL + '?' + show + '&' + data + '&' + user + '&' + type + '&' + limit
    },
    copyLink () {
      this.$copyText(this.shareLink).then((e) => {
        this.successAlert = true
      })
    }
  }

  const computed = {
    ...mapGetters([
      'topMusicData',
      'topMusicUsername',
      'topMusicType',
      'topMusicLimit',
      'topMusicDialogState'
    ])
  }

  const filters = {
    capitalize (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }

  export default {
    name,
    props,
    components,
    methods,
    computed,
    filters,
    data () {
      return {
        showTopMusicPreview: false,
        topMusicIds: [],
        topMusic: [],
        timePeriod: {
          'short_term': 'Last Month',
          'medium_term': 'Last 6 Months',
          'long_term': 'Last Several Years'
        },
        shareLink: null,
        successAlert: false
      }
    },
    beforeMount () {
      this.accessToken = this.$route.query.access_token
      this.displayName = atob(this.topMusicUsername) || this.username
      if (this.topMusicDialogState === 'true') {
        this.showTopMusicPreview = true
        this.topMusicIds = atob(this.topMusicData)
        this.getTopMusicData()
      } else {
        this.showTopMusicPreview = false
      }
    },
    watch: {
      showTopMusicPreview () {
        if (this.showTopMusicPreview === false) {
          this.shareLink = null
        }
      }
    }
  }
</script>

<style>
.toolbar__content {
  justify-content: center !important;
}
</style>
