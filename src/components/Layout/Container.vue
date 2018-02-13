<template>
  <div class="nav">
    <v-content>
      <div fluid fill-height style="padding:16px">
        <v-layout
          justify-center
          align-center>
          <slot></slot>
        </v-layout>
      </div>
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
