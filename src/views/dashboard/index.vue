<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎来到天倬外企订单管理系统</div>
  </div>
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
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  // width: 100%;
  // height: 500px;
  // width: 82vw;
  // height: 82vh;
  // background-image: url('../../assets/CPM/CPM_lg.jpg');
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
}
</style>
