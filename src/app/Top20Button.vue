<template>
  <span>
    <v-btn @click="getTop20Ids" v-if="search.type === 'tracks'">Share Your Top 20</v-btn>

    <v-dialog v-model="showTop20Preview" fullscreen>
      <div id="top20" style="margin: auto;" class="grey lighten-3">
        <v-toolbar color="white">
          <v-toolbar-title class="green--text">
              {{ displayName }}'s Top 20 ({{ timePeriod[search.timeRange] }})
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn style="color:#1db954" flat @click="getShareUrl">Share</v-btn>
          <v-btn style="color:#1db954" flat @click.native="hideTop20">Discover Your Top 20</v-btn>
        </v-toolbar>
        <v-container fluid style="min-height:0;" grid-list-lg>
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
  import { mapGetters, mapActions } from 'vuex'

  import axios from 'axios'
  import _ from 'lodash'

  import Albums from './Albums'

  import { BASE_URL } from '../constants'

  const name = 'Top20Button'

  const props = {
    username: { type: String, required: true }
  }

  const components = {
    Albums
  }

  const methods = {
    ...mapActions([
      'savetop20Data',
      'saveTop20Username',
      'saveTop20DialogState'
    ]),
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
    },
    getShareUrl () {
      const data = 'data=' + btoa(this.top20Ids)
      const user = 'username=' + btoa(this.username)
      const show = 'showTop20Preview=true'
      const url = BASE_URL + '?' + show + '&' + data + '&' + user
      console.log(url)
    },
    clearTop20 () {
      this.savetop20Data(null)
      this.saveTop20Username(null)
      this.saveTop20DialogState(null)
    },
    hideTop20 () {
      this.showTop20Preview = false
      this.clearTop20()
    }
  }

  const computed = {
    ...mapGetters([
      'top20Data',
      'top20Username',
      'top20DialogState'
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
      this.accessToken = this.$route.query.access_token
      this.displayName = atob(this.top20Username) || this.username

      if (this.top20DialogState === 'true') {
        this.showTop20Preview = true
        this.top20Ids = atob(this.top20Data)
        this.getTop20Ids()
      } else {
        this.showTop20Preview = false
      }
    }
  }
</script>
