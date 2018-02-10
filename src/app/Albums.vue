<template>
  <div v-if="data.length > 0" class="albums" :loading="loading">
    <v-container fluid grid-list-md class="grey lighten-4" v-if="!loading">
      <v-layout row wrap>
        <v-flex xs4 lg6 v-for="(card, index) in data" :key="card.title">
          <v-card style="width:100%">
            <v-card-media
              v-if="search.type === 'artists' ? card.images : card.album && card.album.images"
              @click="playPreview(card.preview_url)"
              :src="search.type === 'artists' ? card.images[0].url : card.album.images[0].url"
              height="50vh">
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span v-if="search.type === 'artists'">
                      <h4>{{ card.name }}</h4>
                    </span>
                    <span v-else>
                      <h5>{{ card.name }}</h5>
                      <h5 v-if="card.artists">{{ card.artists[0].name }}</h5>
                      <h5>{{ card.album.name }}</h5>
                    </span>
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
              <v-btn icon @click="$emit('saveSong', card.id)">
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
    <div class="animation-wrapper">
      <AudioAnimation v-if="audioPlaying"></AudioAnimation>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import AudioAnimation from '../components/AudioAnimation'

  const name = 'Albums'

  const props = {
    data: { type: Array, required: true },
    search: { type: Object, required: true },
    type: { type: String, required: true }
  }

  const components = {
    AudioAnimation
  }

  const methods = {
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
    audioUpdate () {
      const audio = this.$refs.audio
      if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
        this.audioPlaying = true
      } else {
        this.audioPlaying = false
      }
    }
  }

  export default {
    name,
    props,
    components,
    methods,
    data () {
      return {
        song: '',
        audioPlaying: false,
        loading: false,
        accessToken: ''
      }
    }
  }
</script>

<style>
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
.rank {
  color: black;
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
</style>
