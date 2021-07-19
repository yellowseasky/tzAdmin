<template>
  <div>
    <section>
      <!--工具条-->
      <el-row>
        <el-col :span="18" style="padding-bottom: 0px;margin-left:3%;">
          <el-form style="display:flex;align-items: center;">
            <el-form-item style="font-weight: bold;margin-bottom:0" label="未返工件明细" />
            <el-form-item style="margin-left:0%;margin-bottom:0">
              <el-button size="small" type="primary" :disabled="!selectDetailList.length" @click="addStaff">批量加入</el-button>
            </el-form-item>

            <el-form-item style="font-weight: bold;margin-left:45%;margin-bottom:0" label="已选工件明细" />
            <el-form-item style="margin-bottom:0">
              <el-button
                type="primary"
                size="small"
                :disabled="!selectedArtifactData.length"
                @click="removeStaff"
              >批量取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 外协订单明细 -->
      <div class="table-container" style="">
        <el-row :gutter="24">
          <el-col :span="11">
            <el-table
              ref="staffTable"
              v-loading="listLoading"
              height="300"
              width="400"
              style="width: 100%"
              :row-key="getRowKeys"
              :data="artifactList"
              border
              fit
              highlight-current-row
              @selection-change="handleArtifactChange"
            >
              <el-table-column type="selection" :reserve-selection="true" width="40" align="center" />
              <el-table-column type="index" label="序号" width="50" align="center" />

              <el-table-column label="工件编码" align="center" width="200">
                <template slot-scope="{row}">
                  <span>{{ row.MBomDetCode?row.MBomDetCode:'暂无' }}</span>
                </template>
              </el-table-column>

              <el-table-column label="工件名称" align="center" width="100">
                <template slot-scope="{row}">
                  <span>{{ row.MBomDetName ?row.MBomDetName:'暂无' }}</span>
                </template>
              </el-table-column>

              <!-- <el-table-column align="center" label="当前仓库">
                <template slot-scope="{row}">
                  <span>{{ row.StorName }}</span>
                </template>
              </el-table-column> -->

              <el-table-column align="center" width="50" label="数量">
                <template slot-scope="{row}">
                  <span>{{ row.OutODetNumber ?row.OutODetNumber:'暂无' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>

          <el-col :span="11" :offset="1">
            <el-table
              ref="selectedStaffTable"
              v-loading="listLoading"
              height="300"
              :row-key="getRowKeys2"
              :data="selectedArtifactList"
              border
              style="width:100%;margin-left:20px"
              fit
              highlight-current-row
              @selection-change="handleSelectedArtifactChange"
            >
              <el-table-column type="selection" :reserve-selection="true" width="45" />
              <el-table-column type="index" label="序号" width="50" align="center" />

              <el-table-column label="工件编码" align="center" width="200">
                <template slot-scope="{row}">
                  <span>{{ row.MBomDetCode?row.MBomDetCode:'暂无' }}</span>
                </template>
              </el-table-column>

              <el-table-column label="工件名称" align="center" width="100">
                <template slot-scope="{row}">
                  <span>{{ row.MBomDetName ?row.MBomDetName:'暂无' }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" width="50" label="数量">
                <template slot-scope="{row}">
                  <span>{{ row.OutODetNumber ?row.OutODetNumber:'暂无' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div style="text-align:center;margin:20px 0">
        <el-button type="primary" @click="modifyStaff()">确定</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: '',
  components: {

  },
  props: {
    detailList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      artifactList: [], // 左边表格数据
      selectedArtifactList: [], // 右边表格数据
      selectDetailList: [], // 选定左边表格详细列表
      selectedArtifactData: [], // 选定的工件数据
      selectArray: [], // 保存提交的数据
      listLoading: false
    }
  },
  computed: {

  },
  watch: {
    detailList(val) {
      this.artifactList = val.filter(item => item.StorName !== 'CNC加工')
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
  // 我看到elementUI上说这个是必须的，好像是这样的，不写就会报错，说RowKey有问题。。
    getRowKeys(row) {
      // 行数据的Key
      return row.id
    },
    getRowKeys2(row) {
      // 行数据的Key
      return row.id
    },
    // 获取搜索列表（左边表格数据）
    // 将左边表格选择项存入selectDetailList中
    // 左边表格点击复选框触发该事件
    handleArtifactChange(rows) {
      this.selectDetailList = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.selectDetailList.push(row)
          }
        })
      }
    },
    // 左边表格选择项移到右边
    addStaff() {
      setTimeout(() => {
        this.$refs['staffTable'].clearSelection()
        this.$refs['selectedStaffTable'].clearSelection()
      }, 0)
      let repeat = false
      this.selectedArtifactList.forEach(item => {
        if (
          this.selectDetailList[0] &&
          item.MBomDetId === this.selectDetailList[0].MBomDetId
        ) {
          repeat = true
          Message.error('此工件已添加')
          return
        }
      })
      if (repeat === false) {
        // 把左边选定的数据存入右边
        this.selectDetailList.forEach(item => {
          this.selectedArtifactList.push(item)
        })
        for (let i = 0; i < this.artifactList.length; i++) {
          for (let j = 0; j < this.selectDetailList.length; j++) {
            // 删除选中的数据
            if (
              this.artifactList[i] &&
              this.selectDetailList[j] &&
              this.artifactList[i].MBomDetId === this.selectDetailList[j].MBomDetId
            ) {
              this.artifactList.splice(i, 1)
            }
          }
        }
      }
    },
    // 右边表格选择项移到左边
    removeStaff() {
      setTimeout(() => {
        this.$refs['staffTable'].clearSelection()
        this.$refs['selectedStaffTable'].clearSelection()
      }, 0)
      this.selectedArtifactData.forEach(item => {
        this.artifactList.push(item)
      })
      for (let i = 0; i < this.selectedArtifactList.length; i++) {
        for (let j = 0; j < this.selectedArtifactData.length; j++) {
          if (
            this.selectedArtifactList[i] &&
            this.selectedArtifactData[j] &&
            this.selectedArtifactList[i].MBomDetId === this.selectedArtifactData[j].MBomDetId
          ) {
            this.selectedArtifactList.splice(i, 1)
          }
        }
      }
    },
    // 将右边表格选择项存入selectedStaffData中
    // 右边表格触发选中事件
    handleSelectedArtifactChange(rows) {
      this.selectedArtifactData = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.selectedArtifactData.push(row)
          }
        })
      }
    },
    // 提交（没有写提交功能，可不用）
    modifyStaff() {
      if (this.selectedArtifactList.length > 0) {
        this.$emit('setArtifactList', this.selectedArtifactList)
        this.selectedArtifactList = []
      } else {
        if (this.selectDetailList.length > 0) {
          Message({
            message: '请加入你已选的工件',
            type: 'warning',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: '请选择工件',
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  text-align: center !important;
  margin-left: 2% !important;
}
</style>
