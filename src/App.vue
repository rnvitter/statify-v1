<template>
  <v-app id="app">
    <v-container>
      <div class="content">
        <home></home>
      </div>
    </v-container>
  </v-app>
</template>

<script>
  import Container from './components/Layout/Container'
  import Home from './app/Home'

  const components = {
    'v-container': Container,
    Home
  }

  export default {
    components
  }
</script>
