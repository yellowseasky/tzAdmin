<template>
  <div class="dashboard-container" />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  width: 100vw;
  height: calc(100vh - 82px);
  background-image: url('../../assets/CPM/CPM_lg.jpg');
  box-shadow: 2px 2px 20px rgba(63, 63, 63, .9) inset;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
