<template>
  <div>
    <v-expansion-panel v-if="accessToken && userData">
      <v-expansion-panel-content>
        <v-alert color="success" icon="success" dismissible v-model="successAlert">
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
              <v-radio-group v-model="search.timeRange" :mandatory="false">
                <v-radio label="Last Month" value="short_term" color="green"></v-radio>
                <v-radio label="Last 6 Months" value="medium_term" color="green"></v-radio>
                <v-radio label="Last Several Years" value="long_term" color="green"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <v-subheader># of Tracks</v-subheader>
              <v-flex xs9>
                <v-slider color="green" :min="3" :max="50" v-model="search.limit"></v-slider>
              </v-flex>
              <v-flex xs1 style="margin-right:10px">
                <v-text-field v-model="search.limit" type="number"></v-text-field>
              </v-flex>
            </v-flex>
            <v-flex>
              <v-btn @click="getData">Load</v-btn>
              <v-btn @click="createPlaylist" v-if="search.type === 'tracks'">Create Playlist</v-btn>
              <top-20-button :username="userData.display_name"></top-20-button>
            </v-flex>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <albums v-if="accessToken" @saveSong="saveSong($event)"
      :data="data" :search="search" :type="type">
    </albums>

    <login v-else></login>
  </div>
</template>

<script>
  import SpotifyService from '../services/spotifyService'
  import axios from 'axios'
  import _ from 'lodash'

  import login from './Login'
  import Top20Button from './Top20Button'
  import Albums from './Albums'

  const name = 'home'

  const components = {
    login,
    Top20Button,
    Albums
  }

  const methods = {
    logout () {
      window.location.href = process.env.API_URL
    },
    getData () {
      this.loading = true
      this.search.type = this.type
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
          console.log(this.data)
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
    saveSong (id) {
      console.log(id)
      const ids = {ids:[id]}
      axios.put('https://api.spotify.com/v1/me/tracks/?ids=', ids, {
        headers: {'Authorization': 'Bearer ' + this.accessToken}
      }).then((res) => console.log(res))

    }
  }

  const computed = {
    playlistName () {
      let time = ''
      if (this.search.timeRange === 'long_term') {
        time = 'Last Several Years'
      } else if (this.search.timeRange === 'medium_term') {
        time = 'Last 6 Months'
      } else {
        time = 'Last Month'
      }
      return 'Top ' + this.search.limit + ' Songs Over the ' + time
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
          type: 'tracks',
          timeRange: 'short_term',
          limit: 20
        },
        type: 'tracks',
        limit: 20,
        data: [],
        songs: [],
        top20: [],
        userData: undefined,
        errors: '',
        successAlert: false,
        failureAlert: false
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
        const musicData = this.getData()

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
