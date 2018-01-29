<template>
  <div class="audio-wrapper">
    <template v-for="i in numOfBars">
      <div class="bar" :style="randomClass(i)" :key="i"></div>
    </template>
  </div>
</template>

<script>
  const name = 'AudioAnimation'

  const methods = {
    randomClass (i) {
      const barWidth = document.body.clientWidth * 0.02
      const padding = document.body.clientWidth * 0.005
      const left = (barWidth + padding) * (i - 1)
      const min = 700
      const max = 900
      let speed = Math.floor(Math.random() * ((min - max) + 1) + min)
      return 'left:' + left + 'px; animation-duration:' + speed + 'ms;'
    }
  }

  const computed = {
    numOfBars () {
      const barWidth = (this.windowWidth * 0.025) + 3.2
      const bars = this.windowWidth / barWidth
      return Math.floor(bars)
    }
  }

  export default {
    name,
    methods,
    computed,
    data () {
      return {
        windowWidth: undefined
      }
    },
    beforeMount () {
      this.windowWidth = document.body.clientWidth
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.windowWidth = document.body.clientWidth
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.windowWidth = document.body.clientWidth
      })
    }
  }
</script>

<style>
.audio-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap-reverse;
      flex-wrap: wrap-reverse;
  height: 100px;
  overflow: hidden;
}

.bar {
  margin-top: 100px;
  margin-left: 3px;
  background: #1db954;
  height: 100px;
  width: 2.5vw;
  -webkit-animation: sound 0ms -800ms linear infinite alternate;
          animation: sound 0ms -800ms linear infinite alternate;
  pointer-events: none;
}

@-webkit-keyframes sound {
  0% {
      opacity: .8;
      min-height: 3px;
      max-height: 10px;
  }
  100% {
      opacity: 1;
      min-height: 70px;
      max-height: 100px;
  }
}

@keyframes sound {
  0% {
      opacity: .8;
      min-height: 3px;
      max-height: 10px;
  }
  100% {
      opacity: 1;
      min-height: 70px;
      max-height: 100px;
  }
}
</style>
