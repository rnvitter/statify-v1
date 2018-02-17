<template>
    <v-flex xs12 class="justify-center">
      <v-card>
        <v-alert v-model="successAlert" dismissible
          color="success" icon="check_circle">
          Link Copied to Clipboard
        </v-alert>
        <v-alert color="info" icon="warning" dismissible v-model="warningAlert">
          {{ this.statusTxt }}: Could Not Generate A Shortened Url, Please Use the Long Url
        </v-alert>
        <v-flex xs12>
          <v-flex xs8>
            <v-text-field
              id="share-link"
              name="share-link"
              color="green"
              style="margin:10px 15px 0 15px;"
              label="Generating Link"
              :loading="loading"
              readonly
              v-model="shareLink">
            </v-text-field>
          </v-flex>
          <v-flex xs2 class="justify-center">
            <v-btn flat icon style="color:#1db954; margin-top:20px" slot="activator" :disabled="!shareLink" @click="copyLink">
            <v-icon>content_copy</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2 class="justify-center">
            <v-btn flat icon style="color:#1db954; margin-top:20px" slot="activator" :disabled="!!shareLink" @click="getTopMusicIds">
            <v-icon>cached</v-icon>
            </v-btn>
          </v-flex>
        </v-flex>
        <v-flex xs12>
          <p style="text-align:center; margin:0 10px 10px 10px;" v-if="shareLink">
            Copy this link to share your top {{ limit }} {{ type }} of the
            {{ timePeriod[timeRange] }} with your friends
          </p>
          <p style="text-align:center; margin:0 10px 10px 10px;" v-else>
            Click the green refresh button to generate a new link
          </p>
        </v-flex>
      </v-card>
    </v-flex>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import axios from 'axios'

    import apiService from '../services/apiService'
    import { BASE_URL } from '../constants'

    const name = 'TopMusicShare'

    const props = {
        username: { type: String, required: true },
        type: { type: String, required: true },
        timeRange: { type: String, required: true },
        limit: { type: Number, required: true },
        showMusicShare: { type: Boolean, required: false }
    }

    const computed = {
        ...mapGetters([
            'spotifyToken'
        ])
    }

    const methods = {
        ...mapActions([
            'saveSpotifyToken'
        ]),
        getTopMusicIds () {
            this.loading = true
            this.shareLink = null
            const query = '?time_range=' + this.timeRange + '&limit=' + this.limit
                axios.get('https://api.spotify.com/v1/me/top/' + this.type + query, {
                headers: {
                    'Authorization': 'Bearer ' + this.spotifyToken
                }
            }).then((res) => {
                const ids = []
                res.data.items.forEach(song => {
                    ids.push(song.id)
                })
                this.topMusicIds = ids.toString()
                this.getTopMusicData()
            }).catch((err) => {
                console.log(err)
                this.saveSpotifyToken(null)
                this.$forceUpdate()
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
                    this.loading = false
                    this.warningAlert = true
                    this.statusTxt = res.data.status_txt
                } else {
                    this.shareLink = res.data.data.url
                }
            }).catch((err) => {
                this.loading = false
                this.warningAlert = true
                this.statusTxt = err
            })
        },
        copyLink () {
            this.$copyText(this.shareLink).then((e) => {
                this.successAlert = true
                this.$emit('close', false)
            })
        }
    }

    export default {
        name,
        props,
        computed,
        methods,
        data () {
            return {
                loading: false,
                shareLink: null,
                successAlert: false,
                warningAlert: false,
                statusTxt: null,
                timePeriod: {
                    'short_term': 'Last Month',
                    'medium_term': 'Last 6 Months',
                    'long_term': 'Last Several Years'
                }
            }
        },
    watch: {
      showMusicShare () {
        if (this.showMusicShare === false) {
          this.successAlert = false
          this.warningAlert = false
        } else {
          this.getTopMusicIds()
        }
      }
    }
    }
</script>