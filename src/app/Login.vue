<template>
  <div class="login">
    <div class="title-wrapper">
      <h2 class="title">Statify <span class="separator">|</span></h2>
      <v-btn class="login-btn" @click="login()" flat>Login</v-btn>
    </div>
    <AudioAnimation style="margin-bottom: -16px;"></AudioAnimation>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  import apiService from '../services/apiService'
  import AudioAnimation from '../components/AudioAnimation'

  const name = 'login'

  const components = {
    AudioAnimation
  }

  const methods = {
    ...mapActions([
      'savetopMusicData',
      'savetopMusicUsername',
      'savetopMusicType',
      'savetopMusicLimit',
      'savetopMusicDialogState'
    ]),
    login () {
      apiService.login()
        .then((res) => {
          window.location.replace(res.data)
        })
    },
    clearTopMusic () {
      this.savetopMusicData(null)
      this.savetopMusicUsername(null)
      this.savetopMusicType(null)
      this.savetopMusicLimit(null)
      this.savetopMusicDialogState(null)
    }
  }

  export default {
    name,
    methods,
    components,
    beforeMount () {
      this.clearTopMusic()
      if (this.$route.query.showTopMusicPreview) {
        this.savetopMusicData(decodeURIComponent(this.$route.query.data))
        this.savetopMusicUsername(decodeURIComponent(this.$route.query.username))
        this.savetopMusicType(decodeURIComponent(this.$route.query.type))
        this.savetopMusicLimit(decodeURIComponent(this.$route.query.limit).replace(/\/$/, ''))
        this.savetopMusicDialogState(decodeURIComponent(this.$route.query.showTopMusicPreview))
        window.history.replaceState(null, null, window.location.pathname)
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700');

.container {
  padding: 0px;
}
.login {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  height: calc(100vh - 32px);
}
.title-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  margin-top: auto;
  margin-bottom: auto;
}
.title {
  font-weight: 700;
  margin-left: 15px;
  color: #1db954;
  font-size: 28px !important;
}
.separator {
  font-weight: 300;
  margin-left: 10px;
  color: black;
  opacity: 0.5;
  font-weight: 100;
}
.login-btn {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  margin-top: 10px;
}
</style>
