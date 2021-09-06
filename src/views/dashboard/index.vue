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
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  width: 95vw;
  height: 85vh;
  background-image: url('../../assets/CPM/CPM_lg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
