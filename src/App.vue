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

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,900');

  html,
  html * {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }

  html, body {
    font-family: 'Roboto', sans-serif;
    -webkit-overflow-scrolling: touch;
  }

  h3 {
    color: #1db954;
    font-weight: 900;
    font-size: 20px;
  }

  h4 {
    color: white;
    text-shadow: 2px 2px 5px black;
    font-weight: 300;
    font-size: 24px;
  }

  h5 {
    color: white;
    text-shadow: 2px 2px 5px black;
    font-weight: 300;
    font-size: 20px;
  }
</style>
