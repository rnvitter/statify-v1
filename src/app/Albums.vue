<template>
  <div v-if="data.length > 0" class="albums" :loading="loading">
    <v-container fluid grid-list-md class="grey lighten-5" v-if="!loading">
      <v-layout row wrap>
        <v-flex class="card-wrapper" xs12 sm6 md4 lg3 v-for="(card, index) in data" :key="card.name">
          <v-card style="width:100%" hover>
            <v-alert v-if="card.id === addSong" class="song-alert" dismissible
              :color="alert.alertType" :icon="alert.alertIcon" v-model="alert.active">
              {{ alert.alertMessage }}
            </v-alert>
            <v-card-media
              v-if="card.images ? card.images : card.album && card.album.images"
              :style="getBackgroundImg(card)"
              height="50vh">
              <div fill-height fluid style="padding:10px 16px">
                <v-layout fill-height>
                  <v-flex xs12 flexbox style="flex-direction:column">
                    <span>
                      <h4 v-if="topTracks[0].artists.some(e => e.id === card.id)"
                        v-for="track in topTracks" class="top-tracks" :key="track.id"
                        style="opacity:0.5; font-size:20px;">{{ track.name }}
                      </h4>
                    </span>
                    <span style="z-index:3; margin-top:auto;" v-if="card.images">
                      <h4>{{ card.name }}</h4>
                    </span>
                    <span style="z-index:3; margin-top:auto;" v-else>
                      <h5>{{ card.name }}</h5>
                      <h5 v-if="card.artists">{{ card.artists[0].name }}</h5>
                      <h5>{{ card.album.name }}</h5>
                    </span>
                    <div class="animation-wrapper">
                      <AudioAnimation v-if="audioPlaying && card.id === song"></AudioAnimation>
                    </div>
                  </v-flex>
                </v-layout>
              </div>
            </v-card-media>
            <v-card-actions class="white">
              <div class="rank">{{ index + 1 }}</div>
              <v-spacer></v-spacer>
              <v-btn icon @click="getTopTrackIndex('prev', card.id)" v-if="card.images"
                :disabled="topTracks.length === 0 || !topTracks[0].artists.some(e => e.id === card.id)">
                <v-icon>skip_previous</v-icon>
              </v-btn>
              <v-btn icon @click="playPreview(card.preview_url, card.id)" v-if="card.album">
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <v-btn icon @click="getTopTrackIndex(null, card.id)" v-else
                :disabled="topTracks.length === 0 || !topTracks[0].artists.some(e => e.id === card.id)">
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <v-btn icon @click="getTopTrackIndex('next', card.id)" v-if="card.images"
                :disabled="topTracks.length === 0 || !topTracks[0].artists.some(e => e.id === card.id)">
                <v-icon>skip_next</v-icon>
              </v-btn>
              <v-tooltip bottom open-delay="500" v-if="card.album">
                <v-btn icon slot="activator" @click="saveTrack(card.id)">
                  <v-icon>add</v-icon>
                </v-btn>
                <span>Add Song to Library</span>
              </v-tooltip>
              <v-tooltip class="GetArtistsTop" bottom open-delay="500" v-if="card.images">
                <v-btn icon @click="getArtistsTopTracks(card.id)" slot="activator">
                  <v-icon>format_list_numbered</v-icon>
                </v-btn>
                <span>Get Artist's Top Tracks</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <audio ref="audio" @timeupdate="audioUpdate"></audio>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
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
    playPreview (song, id) {
      // for v-if on animation
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
      this.song = id
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
        headers: { 'Authorization': 'Bearer ' + this.spotifyToken }
      }).then((res) => {
        if (res.data[0]) {
          this.alert.alertType = 'info'
          this.alert.alertIcon = 'info'
          this.alert.alertMessage = 'Song already in library'
          this.alert.active = true
        } else {
          const ids = {ids:[id]}
          axios.put('https://api.spotify.com/v1/me/tracks/?ids=', ids, {
            headers: { 'Authorization': 'Bearer ' + this.spotifyToken }
          }).then((res) => {
            this.alert.alertType = 'success'
            this.alert.alertIcon = 'check_circle'
            this.alert.alertMessage = 'Song added'
            this.alert.active = true
          }).catch((err) => {
            this.$emit('apiError', err)
          })
        }
      })
    },
    getArtistsTopTracks (id) {
      document.querySelector('audio').pause()
      this.topTrackIndex = 0
      axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`, {
        headers: { 'Authorization': 'Bearer ' + this.spotifyToken }
      }).then((res) => {
        if (res.data.tracks.length >= 5) {
          this.topTracks = res.data.tracks.slice(0, 5)
        } else {
          this.topTracks = res.data.tracks.slice(0, (res.data.tracks.length - 1))
        }
      }).catch((err) => {
        this.$emit('apiError', err)
      })
    },
    getTopTrackIndex (direction, id) {
      if (direction === 'next') {
        if (this.topTrackIndex < (this.topTracks.length - 1)) {
          this.topTrackIndex = this.topTrackIndex + 1
        } else {
          this.topTrackIndex = 0
        }
      }
      if (direction === 'prev') {
        if (this.topTrackIndex > 0) {
          this.topTrackIndex = this.topTrackIndex - 1
        } else {
          this.topTrackIndex = 4
        }
      }
      this.updateCurrentTrackStyle()
      this.playPreview(this.topTracks[this.topTrackIndex].preview_url, id)
    },
    updateCurrentTrackStyle () {
      document.querySelectorAll('.top-tracks').forEach(el => el.style.opacity = 0.5)
      document.querySelectorAll('.top-tracks')[this.topTrackIndex].style.opacity = 1
    },
    getBackgroundImg (card) {
      if (card.images && (this.topTracks.length === 0 || !this.topTracks[0].artists.some(e => e.id === card.id))) {
        return `background: linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.7)), url('${card.images[0].url}') center center / cover no-repeat;`
      } else if (card.images && this.topTracks[0].artists.some(e => e.id === card.id)) {
        return `background: linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.2)), url('${card.images[0].url}') center center / cover no-repeat;`
      } else {
        return `background: linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.7)), url('${card.album.images[0].url}') center center / cover no-repeat;`
      }
    }
  }

  const computed = {
    ...mapGetters([
      'spotifyToken',
      'tipsSetting'
    ])
  }

  export default {
    name,
    props,
    components,
    methods,
    computed,
    data () {
      return {
        song: null,
        addSong: null,
        audioPlaying: false,
        loading: false,
        alert: {
          active: false,
          alertType: null,
          alertIcon: null,
          alertMessage: null
        },
        topTracks: [],
        topTrackIndex: 0
      }
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

@media only screen and (max-width: 560px) {
  .card-wrapper {
    padding: 0 0 15px 0 !important;
  }
}
</style>
