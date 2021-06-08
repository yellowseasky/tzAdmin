<template>
  <div>
    <header class="headerBar">
      <img src="@/assets/logo/CPM.png" class="sidebar-logo">
      <div class="line" />
      <div class="sidebar-title">
        <p>天倬云网管理系统</p>
        <p>WWW.CPM-TM.COM</p>
      </div>
    </header>
  </div>
</template>

<script>

export default {
  name: 'HeaderBar',
  components: {
  }
}
</script>

<style lang="scss" scoped>
// .sidebarLogoFade-enter-active {
//   transition: opacity 1.5s;
// }

// .sidebarLogoFade-enter,
// .sidebarLogoFade-leave-to {
//   opacity: 0;
// }
.headerBar {
      display: flex;
      position: fixed;
      font-size: 0px;
      top: 0;
      left: 0;
      z-index: 10;
      overflow: hidden;
      height: 50px !important;
      width: 100% !important;
      background-color: #436EEE;
      padding-left: 30px;
    }
    .sidebar-logo {
        height: 100%;
    }
    .line {
      display: flex;
      align-items: center;
      text-align: center;
      line-height: 100%;
      height: 70%;
      width: 2px;
      background-color: #fff;
      margin: auto 10px;
    }
    .sidebar-title {
      height: 100%;
      font-size: 15px;
      font-weight: 500;
      line-height: 5px;
      color: #fff;
    }
</style>
