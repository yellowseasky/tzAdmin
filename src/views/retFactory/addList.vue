<template>
  <div class="app-container">
    <div class="add-list">
      <el-button size="small" :loading="subLoading" class="filter-item" type="primary" @click="subArtList">提交</el-button>
      <!-- <el-button size="small" class="filter-item" type="primary" @click="exportArtList">导出</el-button> -->
    </div>
    <div class="title-box">
      <div class="title">基本信息</div>
    </div>
    <div class="add-list" style="margin-top:10px">
      <el-button size="small" class="filter-item" type="primary" @click="showList">选择外协订单</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="showListVisible"
      width="20%"
    >
      <span>该操作将会重新选择,您是否要重新选择？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showListVisible = false">取 消</el-button>
        <el-button type="primary" @click="determineChoose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外协订单选择列表 -->
    <el-dialog :visible.sync="listVisible" width="50%" height="400px">
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="stream-list" />
        <span class="title-text" style="font-weight: 600; color:#666666;">选择外协订单</span>
        <div class="button-right">
          <span class="title-close" @click="listVisible = false" />
        </div>
      </div>
      <el-table
        ref="detailListButtom"
        v-loading="listLoading"
        stripe
        :data="list"
        border
        height="300"
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />

        <el-table-column align="center" label="ID" width="70">
          <template slot-scope="{row}">
            <span>{{ row.rownum }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="单据编码">
          <template slot-scope="{row}">
            <span>{{ row.OutOCode }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间">
          <template slot-scope="{row}">
            <span>{{ row.OutOCreateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="外协类型">
          <template slot-scope="{row}">
            <span>{{ row.OutOType }}</span>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <!-- <pagination v-show="total>listQuery.pageSize" :total="total" :page-size="listQuery.pageSize" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="pageSize" /> -->
      <div slot="footer" class="dialog-footer" align="center">
        <el-button class="filter-item" type="primary" @click="selectList">
          选择
        </el-button>
      </div>
    </el-dialog>

    <!-- 外协详细选择列表 -->
    <el-dialog :visible.sync="detailListVisible" width="70%" height="300px">
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="stream-list" />
        <span class="title-text" style="font-weight: 600; color:#666666;">工件选择</span>
        <div class="button-right">
          <span class="title-close" @click="detailListVisible = false" />
        </div>
      </div>
      <!-- 穿梭框 -->
      <transfer :detail-list.sync="DetailList" @setArtifactList="getArtifactList" />
    </el-dialog>

    <!-- 转序单编辑表格 -->
    <el-table
      ref="outsourcingOrder"
      stripe
      border
      :data="artifactList"
      height="500"
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        type="index"
        width="50"
        align="center"
        label="ID"
      />

      <el-table-column align="center" label="物料编码">
        <template slot-scope="{row}">
          <span>{{ row.MBomDetCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物料名称">
        <template slot-scope="{row}">
          <span>{{ row.MBomDetName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物料规格">
        <template slot-scope="{row}">
          <span>{{ row.MBomDetSpecification }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="50" label="数量">
        <template slot-scope="{row}">
          <span>{{ row.OutODetNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物料单位">
        <template slot-scope="{row}">
          <span>{{ row.OutODetUnit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="热处理要求">
        <template slot-scope="{row}">
          <span v-if="row.MBomDetHRCComment">{{ row.MBomDetHRCComment }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前仓库">
        <template slot-scope="{row}">
          <span>{{ row.StorName }}</span>
        </template>
      </el-table-column>

      <!-- 动作按钮 -->
      <el-table-column label="动作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { orderList, orderListDetail } from '@/api/order'
import { subTransferList } from '@/api/transferOrder'
import { mapGetters } from 'vuex'
import Transfer from '@/components/Transfer'
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination'
export default {
  name: '',
  components: {
    // Pagination
    Transfer
  },
  props: {

  },
  data() {
    return {
      artifactList: [], // 转序单编辑数据
      list: [], // 外协订单
      DetailList: [], // 详细列表
      listQuery: {
        pageSize: 1000,
        pageNumber: 1,
        empId: '',
        outOCode: '',
        outOType: '',
        sTime: '',
        eTime: ''
      },
      outOIdArr: [],
      // total: 0, // 外协订单总页
      listLoading: true, // 外协订单加载
      listVisible: false, // 外协订单框弹出框
      downloadLoading: false, // 导出文件加载
      showListVisible: false,
      detailListVisible: false, // 外协详细订单弹出框
      subLoading: false // 提交加载
    }
  },
  computed: {
    ...mapGetters(['empId'])
  },
  watch: {
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 导出
    exportArtList() {
      // const data = this.artifactList.map((dataItem, index) => {
      //   const { MBomDetCode, MBomDetName, MBomDetSpecification, OutODetNumber, OutODetUnit, MBomDetHRCComment, StorName } = dataItem
      //   return { MBomDetCode, MBomDetName, MBomDetSpecification, OutODetNumber, OutODetUnit, MBomDetHRCComment, StorName }
      // })
      // this.downloadLoading = true
      alert('还未开发,敬请期待！')
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['物料编码', '物料名称', '物料规格', '数量', '物料单位', '热处理要求', '当前仓库']
      //   const filterVal = ['MBomDetCode', 'MBomDetName', 'MBomDetSpecification', 'OutODetNumber', 'OutODetUnit', 'MBomDetHRCComment', 'StorName']
      //   const list = this.artifactList
      //   const value = this.formatJson(filterVal, list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     value,
      //     filename: this.filename,
      //     autoWidth: this.autoWidth,
      //     bookType: this.bookType
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 提交
    async subArtList() {
      this.subLoading = true
      if (this.artifactList.length) {
        const data = this.artifactList.map((dataItem, index) => {
          const { EBomDetId, OutODetId, OutODetNumber } = dataItem
          return { MBomDetId: EBomDetId, OutODetId, MatHandDetNumber: OutODetNumber }
        })
        const res = await subTransferList(this.empId, data)
        if (res) {
          this.$message({
            message: `提交${res.message}`,
            type: 'success',
            duration: 3 * 1000
          })
          this.artifactList = []
        } else {
          this.$message({
            message: `提交${res.message}`,
            type: 'error',
            duration: 3 * 1000
          })
        }
      } else {
        this.$message({
          message: `请选择外协订单`,
          type: 'error',
          duration: 3 * 1000
        })
      }
      this.subLoading = false
    },
    // 穿梭框子组件传来数据
    getArtifactList(val) {
      this.detailListVisible = false
      this.artifactList = val
    },
    // 外协订单选择
    selectList() {
      if (this.outOIdArr.length > 0) {
        this.DetailData()
        this.listVisible = false
        this.detailListVisible = true
      } else {
        this.$message({
          message: '请先选择需要转序的订单',
          type: 'error',
          duration: 3 * 1000
        })
      }
      // 重置多选框
      this.$refs.detailListButtom.clearSelection()
    },
    // 删除
    handleDelete(row, index) {
      this.$notify({
        title: '操作',
        message: '删除成功',
        type: 'success',
        duration: 1500
      })
      this.artifactList.splice(index, 1)
    },
    // 多选触发事件
    handleSelectionChange(val) {
      // 根据单据id获取该订单的订单详细
      const outOIdArray = val.map(item => item.OutOId)
      this.outOIdArr = outOIdArray
    },
    // 请求外协订单数据
    async getList() {
      this.listLoading = true
      this.listQuery.empId = this.empId
      const { data } = await orderList(this.listQuery)
      this.list = data[0].list
      // this.total = data[1].totalCount
      this.listLoading = false
    },
    // 获取订单明细数据
    async DetailData() {
      this.DetailList = []
      this.outOIdArr.forEach(async(item) => {
        const { data } = await orderListDetail(item)
        this.DetailList.push(...data)
      })
    },
    showList() {
      if (this.artifactList.length > 0) {
        this.showListVisible = true
      } else {
        this.listVisible = true
        // 获取数据
        this.getList()
      }
    },
    determineChoose() {
      this.artifactList = []
      this.showListVisible = false
      this.listVisible = true
      // 获取数据
      this.getList()
    },
    // 分页设定页数据个数
    pageSize(val) {
      this.listQuery.pageSize = val.limit
      this.getList()
    }
  }
}
</script>

<style scoped lang='scss'>
.add-list {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  width: 100%;
  }
.title-box {
  width: 100%;
  border-bottom: 2px solid rgb(221, 221, 221);
  .title {
    margin-bottom: -2px;
    width: 9%;
    text-align: center;
    color: rgb(114, 113, 113);
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: 2px solid rgb(51, 74, 204);
  }
}

</style>
