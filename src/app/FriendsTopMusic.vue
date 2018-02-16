<template>
  <span>
    <v-dialog v-model="showTopMusicPreview" fullscreen v-if="topMusicUsername">
      <div id="topMusic" style="margin: auto;" class="grey lighten-5">
        <v-toolbar color="white" height="80px">
          <v-toolbar-title style="color:black; margin-top:5px;">
            <div class="top-music-title">
              {{ displayName }}'s Top {{ topMusicLimit | removeSlash }}
              {{ topMusicType | capitalize }} ({{ timePeriod[timeRange] }})
            </div>
            <v-btn class="top-music-btn"
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
  </span>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import axios from 'axios'

  import apiService from '../services/apiService'
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
      'savetopMusicDialogState',
      'saveSpotifyToken'
    ]),
    getTopMusicData () {
      let type = null
      if (this.topMusicType) {
        type = this.topMusicType
      } else {
        type = this.type
      }
      axios.get(`https://api.spotify.com/v1/${type}/?ids=` + this.topMusicIds, {
        headers: {
          'Authorization': 'Bearer ' + this.spotifyToken
        }
      }).then((res) => {
        this.topMusic = res.data[type]
        this.getShareLink()
      }).catch((err) => {
        console.log(err)
        this.saveSpotifyToken(null)
        this.$forceUpdate()
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
      const data = 'data=' + this.topMusicIds
      const user = 'username=' + this.username
      const type = 'type=' + this.type
      const limit = 'limit=' + this.limit
      const show = 'showTopMusicPreview=true'
      const shareLink = BASE_URL + '?' + show + '&' + data + '&' + user + '&' + type + '&' + limit
      apiService.getShortUrl(shareLink)
        .then((res) => {
          if (res.data.data.length === 0) {
            this.shareLink = shareLink
            this.warningAlert = true
            this.statusTxt = res.data.status_txt
          } else {
            this.shareLink = res.data.data.url
          }
        }).catch((err) => {
          this.warningAlert = true
          this.statusTxt = err
        })
    }
  }

  const computed = {
    ...mapGetters([
      'topMusicData',
      'topMusicUsername',
      'topMusicType',
      'topMusicLimit',
      'topMusicDialogState',
      'spotifyToken'
    ])
  }

  const filters = {
    capitalize (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    removeSlash (value) {
      if (value.slice(-1) === '/') {
        return value.slice(0, -1)
      }
        return value
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
        }
      }
    },
    beforeMount () {
      this.displayName = this.topMusicUsername || this.username
      if (this.topMusicDialogState === 'true') {
        this.showTopMusicPreview = true
        this.topMusicIds = this.topMusicData
        this.getTopMusicData()
      } else {
        this.showTopMusicPreview = false
      }
    },
    watch: {
      showTopMusicPreview () {
        if (this.showTopMusicPreview === false) {
          this.shareLink = null
          document.body.style.overflow = 'auto'
        } else {
          document.body.style.overflow = 'hidden'
        }
      }
    }
  }
</script>

<style>
.toolbar__content {
  justify-content: center !important;
}

.top-music-title {
  text-align: center;
}

.top-music-btn {
  width: 95%;
}

@media only screen and (max-width: 500px) {
  .top-music-title {
    font-size: 12px;
  }
  .top-music-btn {
    font-size: 13px;
  }
}
</style>
