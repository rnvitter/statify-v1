<template>
  <div v-if="data.length > 0" class="albums" :loading="loading">
    <v-container fluid grid-list-md class="grey lighten-4" v-if="!loading">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="(card, index) in data" :key="card.title">
          <v-card style="width:100%">
            <v-alert v-if="card.id === addSong" class="song-alert" dismissible
              :color="alert.alertType" :icon="alert.alertIcon" v-model="alert.active">
              {{ alert.alertMessage }}
            </v-alert>
            <v-card-media
              v-if="card.images ? card.images : card.album && card.album.images"
              @click="playPreview(card.preview_url)"
              :src="card.images ? card.images[0].url : card.album.images[0].url"
              height="50vh">
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span style="z-index:3" v-if="card.images">
                      <h4>{{ card.name }}</h4>
                    </span>
                    <span style="z-index:3" v-else>
                      <h5>{{ card.name }}</h5>
                      <h5 v-if="card.artists">{{ card.artists[0].name }}</h5>
                      <h5>{{ card.album.name }}</h5>
                    </span>
                    <div class="animation-wrapper">
                      <AudioAnimation v-if="audioPlaying && card.preview_url === song"></AudioAnimation>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
            <v-card-actions class="white">
              <div class="rank">{{ index + 1 }}</div>
              <v-spacer></v-spacer>
              <v-btn icon @click="playPreview(card.preview_url)">
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <v-btn icon @click="saveTrack(card.id)">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>share</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <audio ref="audio" @timeupdate="audioUpdate"></audio>
  </div>
</template>

<script>
  import axios from 'axios'
  import AudioAnimation from '../components/AudioAnimation'

  const name = 'Albums'

  const props = {
    data: { type: Array, required: true },
    type: { type: String, required: true }
  }

  const components = {
    AudioAnimation
  }

  const methods = {
    playPreview (song) {
      // for v-if on animation
      this.song = song

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
    audioUpdate () {
      const audio = this.$refs.audio
      if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
        this.audioPlaying = true
      } else {
        this.audioPlaying = false
      }
    },
    saveTrack (id) {
      this.addSong = id
      axios.get('https://api.spotify.com/v1/me/tracks/contains?ids=' + id, {
        headers: { 'Authorization': 'Bearer ' + this.accessToken }
      }).then((res) => {
        console.log(res.data[0])
        if (res.data[0]) {
          this.alert.alertType = 'info'
          this.alert.alertIcon = 'info'
          this.alert.alertMessage = 'Song already in library'
          this.alert.active = true
        } else {
          const ids = {ids:[id]}
          axios.put('https://api.spotify.com/v1/me/tracks/?ids=', ids, {
            headers: { 'Authorization': 'Bearer ' + this.accessToken }
          }).then((res) => {
            this.alert.alertType = 'success'
            this.alert.alertIcon = 'check_circle'
            this.alert.alertMessage = 'Song added'
            this.alert.active = true
          })
        }
      })
    }
  }

  export default {
    name,
    props,
    components,
    methods,
    data () {
      return {
        song: null,
        addSong: null,
        audioPlaying: false,
        loading: false,
        accessToken: '',
        alert: {
          active: false,
          alertType: null,
          alertIcon: null,
          alertMessage: null
        },
      }
    },
    beforeMount () {
      this.accessToken = this.$route.query.access_token
    }
  }
</script>

<style>
.albums {
  margin-top: 10px;
  -webkit-animation: 2s ease 0s normal forwards 0 fade-in;
  animation: 2s ease 0s normal forwards 1 fade-in;
}
@-webkit-keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.rank {
  font-size: 20px;
  font-weight: 900;
  background: #1db954;
  border-radius: 0.8em;
  -moz-border-radius: 0.8em;
  -webkit-border-radius: 0.8em;
  color: white;
  line-height: 1.6em;
  margin-right: 5px;
  text-align: center;
  width: 1.6em;
}
.animation-wrapper {
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 2;
  margin-left: 0.7vw;
}
.song-alert {
  position: absolute;
  z-index: 10;
  width: 100%;
  margin: 0;
}
</style>
