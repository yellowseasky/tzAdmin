<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
    }
  },
  created() {

  },
  mounted() {
    this.IsPC()
  },
  methods: {
    IsPC() {
      var userAgentInfo = navigator.userAgent
      var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod']
      for (var v = 0; v < Agents.length; v++) {
        // 移动端
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          window.location.href = 'http://8.134.73.103:20001/index.html'
        }
      }
      // PC端
      // if (window.screen.width >= 768) {
      // }
    }
  }
}
</script>
