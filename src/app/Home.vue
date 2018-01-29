<template>
  <div>
    <v-expansion-panel v-if="accessToken">
      <v-expansion-panel-content>
        <v-alert color="success" icon="success" dismissible v-model="successAlert">
          Playlist Created
        </v-alert>
        <v-alert color="warning" icon="warning" dismissible v-model="failureAlert">
          Error in Creating Playlist: {{ errors }}
        </v-alert>
        <h4 class="header" slot="header">
          <icon name="spotify"></icon>
          <div style="margin-left:20px; position:absolute; top:10px;">Statify</div>
        </h4>
        <v-flex class="welcome-user" v-if="userData">
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
                <v-radio label="Artists" value="artists" color="green"></v-radio>
                <v-radio label="Tracks" value="tracks" color="green"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex sm6 xs12>
              <v-subheader>Time</v-subheader>
              <v-radio-group v-model="search.timeRange" :mandatory="false">
                <v-radio label="Last Several Years" value="long_term" color="green"></v-radio>
                <v-radio label="Last 6 Months" value="medium_term" color="green"></v-radio>
                <v-radio label="Last Month" value="short_term" color="green"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <v-subheader># of Tracks</v-subheader>
              <v-flex xs9>
                <v-slider color="green" v-bind:max="50" v-model="search.limit"></v-slider>
              </v-flex>
              <v-flex xs1 style="margin-right:10px">
                <v-text-field v-model="search.limit" type="number"></v-text-field>
              </v-flex>
            </v-flex>
            <v-flex>
              <v-btn @click="getData">Load</v-btn>
              <v-btn @click="createPlaylist" v-if="search.type === 'tracks'">Create Playlist</v-btn>
            </v-flex>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <div class="albums" v-if="accessToken" :loading="loading">
      <template v-for="(item, index) in data">
        <template v-if="search.type === 'artists' && !loading">
          <v-flex style="display: inline-block" lg3 md4 sm6 xs12>
            <div class="album-container">
              <img
                :class="getAlbumClasses"
                @click="playPreview(item.preview_url)"
                :src="item.images[0].url"
                :alt="item.name"
                style="width:100%"/>
              <icon
                class="play-icon overlay"
                name="play">
              </icon>
              <div class="label overlay">
                <h4>{{ item.name }}</h4>
              </div>
              <div class="label rating-overlay">
                <h2>{{ index + 1 }}</h2>
              </div>
            </div>
          </v-flex>
        </template>
        <template v-else-if="search.type === 'tracks' && !loading">
          <v-flex style="display: inline-block" lg3 md4 sm6 xs12>
            <div class="album-container">
              <img
                :class="getAlbumClasses"
                @click="playPreview(item.preview_url)"
                :src="item.album.images[0].url"
                :alt="item.name"
                style="width:100%"/>
              <icon
                class="play-icon overlay"
                name="play">
              </icon>
              <div class="label overlay">
                <h4>{{ item.name }}</h4>
                <h4>{{ item.artists[0].name }}</h4>
                <h4>{{ item.album.name }}</h4>
              </div>
              <div class="label rating-overlay">
                <h2>{{ index + 1 }}</h2>
              </div>
            </div>
          </v-flex>
        </template>
      </template>
      <audio ref="audio" @timeupdate="audioUpdate"></audio>
      <div class="animation-wrapper">
        <AudioAnimation v-if="audioPlaying"></AudioAnimation>
      </div>
    </div>
    <login v-else></login>
  </div>
</template>

<script>
  import SpotifyService from '../services/spotifyService'
  import axios from 'axios'
  import _ from 'lodash'
  import AudioAnimation from '../components/AudioAnimation'

  import login from './Login.vue'

  const name = 'home'

  const components = {
    login,
    AudioAnimation
  }

  const methods = {
    logout () {
      SpotifyService.logout()
    },
    playPreview (song) {
      let audio = document.querySelector('audio')
      if (audio.src === '') {
        audio.src = song
        audio.play()
      } else if (song !== audio.src) {
        audio.pause()
        audio.currentTime = 0
        audio.src = song
        audio.play()
      } else if (song === audio.src) {
        audio.pause()
        audio.currentTime = 0
        audio.src = ''
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    },
    getData () {
      this.search.type = this.type
      this.loading = true
      const query = '?time_range=' + this.search.timeRange + '&limit=' + this.search.limit
        axios.get('https://api.spotify.com/v1/me/top/' + this.search.type + query, {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
          }
        }).then((res) => {
          this.data = res.data.items
          _.forEach(res.data.items, song => {
            this.songs.push(song.uri)
          })
          this.loading = false
        })
    },
    createPlaylist () {
        const id = this.userData.id
        const songs = this.songs
        const playlistData = {
          name: this.playlistName,
          public: false
        }
        const headers = {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
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
    },
    audioUpdate () {
      const audio = this.$refs.audio
      if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
        this.audioPlaying = true
      } else {
        this.audioPlaying = false
      }
    }
  }

  const computed = {
    playlistName () {
      let time = ''
      if (this.search.timeRange === 'long_term') {
        time = 'Last Several Years'
      } else if (this.search.timeRange === 'medium') {
        time = 'Last 6 Months'
      } else {
        time = 'Last Month'
      }
      return 'Top ' + this.search.limit + ' Songs Over the ' + time
    },
    getAlbumClasses () {
      if (this.type === 'artists') {
        return 'album tint'
      } else if (this.type === 'tracks') {
        return 'album tint song'
      }
    }
  }

  export default {
    name,
    components,
    methods,
    computed,
    data () {
      return {
        accessToken: '',
        loading: true,
        topArtists: [],
        search: {
          type: 'artists',
          timeRange: 'medium_term',
          limit: 20
        },
        type: 'artists',
        limit: 20,
        song: '',
        data: [],
        songs: [],
        userData: undefined,
        errors: '',
        successAlert: false,
        failureAlert: false,
        audioPlaying: false
      }
    },
    beforeMount () {
      if (process.env.NODE_ENV === 'production') {
        this.accessToken = window.location.href.split('=')[1]
      } else {
        this.accessToken = this.$route.path.split('=')[1]
      }

      if (this.accessToken) {
        const userData = axios.get('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
          }
        }).then((res) => {
          this.userData = res.data
        })
        const musicData = axios.get('https://api.spotify.com/v1/me/top/' + this.search.type, {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
          }
        }).then((res) => {
          this.data = res.data.items
        })

        Promise.all([userData, musicData])
          .then(() => {
            this.loading = false
          })
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700');

#app {
  font-family: 'Montserrat', sans-serif;
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
      .albums {
        margin-top: 10px;
        -webkit-animation: 4s ease 0s normal forwards 0 album-fade-in;
        animation: 4s ease 0s normal forwards 1 album-fade-in;
      }
      @-webkit-keyframes album-fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      @keyframes album-fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
        .album-container {
          position: relative;
          text-align: center;
          padding: 12px 12px 3px 12px;
        }
          .label {
            color: white;
          }
          .play-icon {
            z-index: 2;
            font-size: 200px;
            opacity: 0;
            color: #d3d3d3;
          }
          .overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
            width: 90%;
          }
          .rating-overlay {
            position: absolute;
            top: 1%;
            left: 6%;
            font-size: 32px;
            opacity: 0.5;
          }
          .tint {
            -webkit-filter: grayscale; /*sepia, hue-rotate, invert....*/
            -webkit-filter: brightness(70%);
          }
          .song:hover ~ .play-icon {
            opacity: 0.7;
            -webkit-transition: 0.7s;
            transition: 0.7s;
          }
          .song:hover ~ .audio-overlay {
            opacity: 0.7;
            -webkit-transition: 0.7s;
            transition: 0.7s;
          }

  .fa-icon {
    width: auto;
    height: 1em; /* or any other relative font sizes */

    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }

  .accent--text {
    color: #1db954 !important;
  }

  .animation-wrapper {
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 999;
    margin-left: 0.7vw;
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
    .album-container {
      padding: 6px 0px 3px 0px;
    }
    .rating-overlay {
      left: 4%;
    }
  }
</style>
