<template>
  <div>
    <v-alert color="warning" icon="warning" class="token-alert" dismissible v-model="tokenAlert">
      Access Token Expired, Please Log In Again.
    </v-alert>
    <friends-top-music :type="type" :timeRange="timeRange" v-if="userData"
        :limit="limit" :username="userData.display_name">
    </friends-top-music>
    <v-expansion-panel v-if="spotifyToken && userData">
      <v-expansion-panel-content style="overflow:hidden" expand-icon="menu" v-model="toolbar">
        <v-alert color="success" icon="check_circle" dismissible v-model="successAlert">
          Playlist Created
        </v-alert>
        <v-alert color="warning" icon="warning" dismissible v-model="failureAlert">
          Error in Creating Playlist: {{ errors }}
        </v-alert>
        <h3 class="header" slot="header">
          <div style="position:absolute; top:10px;">Statify</div>
        </h3>
        <v-flex class="welcome-user">
          <img class="profile-pic" :src="userData.images[0].url" v-if="userData.images[0]"/>
          <h4 class="username">Welcome, {{ userData.display_name }}
            <span class="separator"> | </span>
          </h4>
          <v-btn class="logout-btn" @click="logout" flat>Logout</v-btn>
        </v-flex>
        <v-layout class="toggles" row wrap>
            <v-flex sm6 xs12>
              <v-subheader>Type</v-subheader>
              <v-radio-group v-model="type" :mandatory="false">
                <v-radio label="Tracks" value="tracks" color="green"></v-radio>
                <v-radio label="Artists" value="artists" color="green"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex sm6 xs12>
              <v-subheader>Time</v-subheader>
              <v-radio-group v-model="timeRange" :mandatory="false">
                <v-radio label="Last Month" value="short_term" color="green"></v-radio>
                <v-radio label="Last 6 Months" value="medium_term" color="green"></v-radio>
                <v-radio label="Last Several Years" value="long_term" color="green"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <v-subheader># of Tracks</v-subheader>
              <v-flex xs8>
                <v-slider color="green" :min="3" :max="50" v-model="limit"></v-slider>
              </v-flex>
              <v-flex xs1 style="margin-right:30px">
                <v-text-field v-model="limit" type="number"></v-text-field>
              </v-flex>
            </v-flex>
            <v-container fluid grid-list-md v-if="data.length > 0">
              <v-layout row wrap justify-space-between>
                <v-flex d-flex xs1 v-if="!data[0].album">
                  <v-btn @click="getData">Load</v-btn>
                </v-flex>
                <v-flex d-flex xs12 sm6 md4 lg3 xl4 v-else>
                  <v-btn @click="getData">Load</v-btn>
                  <v-btn @click="createPlaylist" v-if="data[0].album">Create Playlist</v-btn>
                </v-flex>
                <v-flex d-flex xs12 sm6 md4 lg3 v-if="!data[0].album">
                  <v-btn @click.prevent="showMusicShare=!showMusicShare" slot="activator" class="fr">
                    <span class="mr-auto">Share Your Top {{ type }}</span>
                    <v-icon v-if="showMusicShare">keyboard_arrow_up</v-icon>
                    <v-icon v-else>keyboard_arrow_down</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex d-flex xs12 sm6 md4 v-else>
                  <v-btn @click.prevent="showMusicShare=!showMusicShare" slot="activator" class="fr">
                    <span class="mr-auto">Share Your Top {{ type }}</span>
                    <v-icon v-if="showMusicShare">keyboard_arrow_up</v-icon>
                    <v-icon v-else>keyboard_arrow_down</v-icon>
                  </v-btn>
                </v-flex>
                <top-music-share @close="showMusicShare=false" v-show="showMusicShare" :type="type" :timeRange="timeRange"
                  :limit="limit" :username="userData.display_name" :showMusicShare="showMusicShare">
                </top-music-share>
              </v-layout>
            </v-container>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <albums @apiError="logout(err)" v-if="spotifyToken" :data="data"
      :timeRange="timeRange" :limit="limit" :type="type">
    </albums>

    <login v-else></login>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'

  import login from './Login'
  import FriendsTopMusic from './FriendsTopMusic'
  import TopMusicShare from './TopMusicShare'
  import Albums from './Albums'

  import { BASE_URL } from '../constants'

  const name = 'home'

  const components = {
    login,
    FriendsTopMusic,
    TopMusicShare,
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
    logout (err) {
      console.log(err)
      this.saveSpotifyToken(null)
      this.tokenAlert = true
      this.$forceUpdate()
    },
    getData (keepOpen = false) {
      this.songs = []
      const query = '?time_range=' + this.timeRange + '&limit=' + this.limit
        axios.get('https://api.spotify.com/v1/me/top/' + this.type + query, {
          headers: {
            'Authorization': 'Bearer ' + this.spotifyToken
          }
        }).then((res) => {
          this.data = res.data.items
          res.data.items.forEach(song => {
            this.songs.push(song.uri)
          })
          keepOpen === true ? this.toolbar = true : this.toolbar = false
        }).catch((err) => {
          this.logout()
        })
    },
    createPlaylist () {
        const id = this.userData.id
        const songs = this.songs
        const playlistData = {
          name: 'Your Top ' + this.limit + ' ' + this.type.charAt(0).toUpperCase() + this.type.slice(1) +
            ' (' + this.timePeriod[this.timeRange] + ')',
          public: true
        }
        const headers = {
          headers: {
            'Authorization': 'Bearer ' + this.spotifyToken
          }
        }
        axios.post('https://api.spotify.com/v1/users/' + id + '/playlists',
          playlistData,
          headers
        ).then((res) => {
          const playlistId = res.data.id
          axios.post('https://api.spotify.com/v1/users/' + id + '/playlists/' + playlistId + '/tracks',
            { 'uris': songs },
            headers
          ).then((res) => {
            this.successAlert = true
          }).catch((err) => {
            this.failureAlert = true
            this.errors = err
          })
        })
    }
  }

  const computed = {
    ...mapGetters([
      'spotifyToken'
    ])
  }

  export default {
    name,
    components,
    methods,
    computed,
    data () {
      return {
        toolbar: true,
        topArtists: [],
        type: 'tracks',
        timeRange: 'short_term',
        timePeriod: {
          'short_term': 'Last Month',
          'medium_term': 'Last 6 Months',
          'long_term': 'Last Several Years'
        },
        limit: 20,
        data: [],
        songs: [],
        userData: undefined,
        errors: '',
        successAlert: false,
        failureAlert: false,
        tokenAlert: false,
        showMusicShare: false
      }
    },
    beforeMount () {
      if (this.$route.query.access_token) {
        this.saveSpotifyToken(this.$route.query.access_token).then(() => {
          window.history.replaceState(null, null, window.location.pathname)
        })
      }

      if (this.$route.query.showTopMusicPreview) {
        this.savetopMusicData(this.$route.query.data)
        this.savetopMusicUsername(this.$route.query.username)
        this.savetopMusicType(this.$route.query.type)
        this.savetopMusicLimit(this.$route.query.limit)
        this.savetopMusicDialogState(this.$route.query.showTopMusicPreview)
        window.history.replaceState(null, null, window.location.pathname)
      }

      if (this.spotifyToken) {
        const userData = axios.get('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': 'Bearer ' + this.spotifyToken
          }
        }).then((res) => {
          this.userData = res.data
        }).catch((res) => {
          this.logout()
          this.tokenAlert = true
        })
        const musicData = this.getData(true)

        Promise.all([userData, musicData])
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700');

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-overflow-scrolling: touch;
}
  .expansion-panel__container {
    background-color: rgba(0,0,0,0);
  }
    .header {
      color: #1db954;
      font-size: 18px;
    }
    .welcome-user {
      margin: 20px;
    }
      .profile-pic {
        border-radius: 50%;
        width: 80px;
        height: 80px;
      }
      .username {
        margin-top: 15px;
        margin-left: 20px;
        text-shadow: none;
        font-size: 22px;
        font-weight: 600;
        color: #1db954;
      }
      .separator {
        font-weight: 300;
        margin-left: 10px;
        color: black;
        opacity: 0.5;
        font-weight: 100;
      }
      .logout-btn {
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        margin-top: 14px;
        margin-left: 0px;
      }
    .toggles {
      margin: 12px;
    }

.token-alert {
  position: absolute;
  width: 100%;
  margin-top: -16px;
  margin-left: -16px;
}

.header__icon .icon {
  color: #1db954 !important;
}

  @media only screen and (max-width: 560px) {
    .profile-pic {
      width: 80px;
      height: 80px;
      margin-left: 15%;
    }
    .separator {
      display:inline;
    }
    .username {
      display: none;
    }
    .logout-btn {
      font-size: 14px;
      margin-left: 15%;
    }
  }
</style>
