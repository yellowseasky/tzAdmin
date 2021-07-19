<template>
  <div>
    <div class="block">
      <el-date-picker
        v-model="value2"
        class="filter-item"
        type="datetimerange"
        format="yyyy-MM-dd"
        align="right"
        :clearable="true"
        unlink-panels
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :picker-options="pickerOptions"
        @change="changeTime($event)"
      />
    </div>
    <h2>{{ pickerOptions.value1 }}</h2>
    <h2>{{ pickerOptions.value2 }}</h2>
  </div>
</template>

<script>
import { timeChange } from '@/utils'
export default {
  name: '',
  components: {

  },
  props: {

  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: [],
      value2: []
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 日期选择器数据处理
    async changeTime(val) {
      try {
        const startTime = timeChange(val[0])
        const endTime = timeChange(val[1])
        this.$emit('Time', startTime, endTime)
      } catch (e) {
        // 清理了日期
        this.$emit('Time', '', '')
      }
    }
  }
}
</script>

<style scoped lang='less'>
</style>
