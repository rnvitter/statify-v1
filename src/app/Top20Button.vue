<template>
  <span>
    <v-btn @click="getTop20Ids" v-if="search.type === 'tracks'">Share Your Top 20</v-btn>

    <v-dialog v-model="showTop20Preview" fullscreen transition="dialog-bottom-transition" :overlay=false>

      <div
        id="top20"
        style="margin: auto;"
        class="grey lighten-3"
      >
        <v-toolbar color="white">
          <v-toolbar-title class="green--text">
              {{ username }}'s Top 20 ({{ timePeriod[search.timeRange] }})
          </v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn style="color:#1db954" flat @click.native="showTop20Preview = false">Share</v-btn>
            <v-btn style="color:#1db954" flat @click.native="showTop20Preview = false">Close</v-btn>
        </v-toolbar>
        <v-container
          fluid
          style="min-height: 0;"
          grid-list-lg
        >
          <v-layout row wrap>
            <v-card>
              <albums style="margin-top:0" :data="top20" :search="search" type="tracks"></albums>
            </v-card>
          </v-layout>
        </v-container>
      </div>
    </v-dialog>
  </span>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'

  import Albums from './Albums'

  const name = 'Top20Button'

  const props = {
    username: { type: String, required: true }
  }

  const components = {
    Albums
  }

  const methods = {
    getTop20Ids () {
      this.showTop20Preview = true
      this.loading = true
      const query = '?time_range=' + this.search.timeRange + '&limit=' + this.search.limit
        axios.get('https://api.spotify.com/v1/me/top/' + this.search.type + query, {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
          }
        }).then((res) => {
          const ids = []
          _.forEach(res.data.items, song => {
            ids.push(song.id)
          })
          this.top20Ids = ids.toString()
          this.encodedIds = btoa(this.top20Ids)
          this.getTop20Data()
        })
    },
    getTop20Data () {
        axios.get('https://api.spotify.com/v1/tracks/?ids=' + this.top20Ids, {
          headers: {
            'Authorization': 'Bearer ' + this.accessToken
          }
        }).then((res) => {
          console.log(res.data.tracks)
          this.top20 = res.data.tracks
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
        showTop20Preview: false,
        top20Ids: [],
        top20: [],
        search: {
          type: 'tracks',
          timeRange: 'short_term',
          limit: 20
        },
        timePeriod: {
          'short_term': 'Last Month',
          'medium_term': 'Last 6 Months',
          'long_term': 'Last Several Years'
        }
      }
    },
    beforeMount () {
      if (process.env.NODE_ENV === 'production') {
        this.accessToken = window.location.href.split('=')[1]
      } else {
        this.accessToken = this.$route.path.split('=')[1]
      }
    }
  }
</script>
