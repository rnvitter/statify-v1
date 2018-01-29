<template>
  <div class="nav">
    <!-- <v-toolbar color="green" dark fixed app>
      <v-toolbar-title>Spotify Stats</v-toolbar-title>
    </v-toolbar> -->
    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
          align-center
        >
          <slot></slot>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
  const name = 'container'

  const props = {
    source: String
  }

  export default {
    name,
    props,
    data () {
      return {
        drawer: null
      }
    }
  }
</script>

<style>
  .toolbar {
    z-index: 999;
  }
</style>
