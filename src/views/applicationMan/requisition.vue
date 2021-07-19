<template>
  <div class="app-container">
    <!-- 表格菜单栏 -->
    <div class="filter-container">
      <el-input v-model="listQuery.outRCode" placeholder="请输入单据编码" style="width: 200px;" class="filter-item" clearable @clear="clearInput" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.outRType" placeholder="类型" clearable class="filter-item" style="width: 130px" @clear="clearSelect">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.display_name" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <datePicker @Time="getTime" />
    </div>

    <!-- 申请单列表 -->
    <div class="filter-container-table" />
    <el-table
      v-loading="listLoading"
      stripe
      :data="list"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="50" align="center" />

      <el-table-column align="center" label="单据编码">
        <template slot-scope="{row}">
          <span>{{ row.OutRCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.OutRCreateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前状态">
        <template slot-scope="{row}">
          <el-tag :type="row.WfStateName | statusFilter">{{ row.WfStateName }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="300" align="center" label="供应商名称">
        <template slot-scope="{row}">
          <span>{{ row.SupplierName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="外协类型">
        <template slot-scope="{row}">
          <el-tag size="medium">{{ row.OutRType }}</el-tag>
        </template>
      </el-table-column>
      <!-- 动作按钮 -->
      <el-table-column label="动作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="listDetail(row.OutRId, row.OutRCode)">
            申请单明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>listQuery.pageSize" :total="total" :page-size="listQuery.pageSize" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="pageSize" />
    <!-- 申请单明细 -->
    <el-dialog :visible.sync="dialogTableVisible" width="80%">
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="stream-list" />
        <span class="title-text" style="font-weight: 600; color:#666666">申请单明细</span>
        <div class="button-right">
          <span class="title-close" @click="cancel" />
        </div>
      </div>
      <el-table
        ref="detailListButtom"
        v-loading="detailListLoading"
        :data="DetailList"
        stripe
        border
        height="400"
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />

        <el-table-column type="index" label="序号" width="50" align="center" />

        <el-table-column align="center" width="200" label="物料编码">
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
            <span>{{ row.OutRDetNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="物料单位">
          <template slot-scope="{row}">
            <span>{{ row.OutRDetUnit }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="热处理要求">
          <template slot-scope="{row}">
            <span>{{ row.MBomDetHRCComment }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="加工说明">
          <template slot-scope="{row}">
            <span>{{ row.OutRDetPSPEC }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="70" label="备注">
          <template slot-scope="{row}">
            <span v-if="row.OutRDetComment">{{ row.OutRDetComment }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button :loading="fileDownloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="fileDownload">
          下载最新文件
        </el-button>
        <el-button :loading="profileFileLoading" class="filter-item" type="primary" icon="el-icon-download" @click="profileFileDownload">
          下载型面文件
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderList, orderListDetail } from '@/api/applicationOrder'
import { getNewFile, getProfileFile } from '@/api/order'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/DatePicker'
import { base64ToBlob } from '@/utils/index'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

const typeOptions = [
  { key: 1, display_name: '线割' },
  { key: 2, display_name: '研磨' },
  { key: 3, display_name: '车铣钻' },
  { key: 4, display_name: '电火花' },
  { key: 5, display_name: '热处理' },
  { key: 6, display_name: 'PVD' },
  { key: 7, display_name: '烧焊' },
  { key: 8, display_name: '热处理' },
  { key: 9, display_name: 'CNC' },
  { key: 10, display_name: 'Ticn' },
  { key: 11, display_name: '镭射' },
  { key: 12, display_name: '整件委外加工' },
  { key: 13, display_name: '铣底面' },
  { key: 14, display_name: '全套外协' },
  { key: 15, display_name: '检具设变' },
  { key: 16, display_name: '3D镭割' }
]

export default {
  name: '',
  components: {
    Pagination,
    DatePicker
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        已发布: 'success',
        未发布: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      DetailList: [],
      outRId: null, // 详细订单ID
      outRCode: null,
      listQuery: {
        pageSize: 20,
        pageNumber: 1,
        empId: '',
        outRCode: '',
        outRType: '',
        sTime: '',
        eTime: ''
      },
      typeOptions, // 外协类型
      total: 0, // 总页
      MBomDetCode: [], // 物料编码
      projectCode: [],
      listLoading: false,
      detailListLoading: false,
      dialogTableVisible: false, // 详细外协订单框
      fileDownloadLoading: false, // 下载文件加载
      profileFileLoading: false, // 下载型面文件加载
      searchListId: '' // 搜索数据
    }
  },
  computed: {
    ...mapGetters(['empId'])
  },
  watch: {

  },
  mounted() {
    this.getList()
  },
  methods: {
    // 时间表点击
    getTime(startTime, endTime) {
      this.listQuery.sTime = startTime
      this.listQuery.eTime = endTime
      this.getList()
    },
    // 搜索框清空触发数据
    clearInput() {
      this.listQuery.outRCode = ''
      this.getList()
    },
    // 清空下拉框
    clearSelect() {
      this.listQuery.outRType = ''
      this.getList()
    },
    // 处理搜索筛选
    async handleFilter() {
      if (this.listQuery.outRCode || this.listQuery.outRType) {
        this.listQuery.pageNumber = 1
      } else {
        this.listQuery.outRCode = ''
        this.listQuery.outRType = ''
      }
      this.getList()
    },
    // 下载最新文件
    fileDownload() {
      this.fileDownloadLoading = true
      if (this.MBomDetCode.length < 1) {
        this.$message({
          message: '请选择需要下载的文件',
          type: 'error',
          duration: 3 * 1000
        })
        this.fileDownloadLoading = false
      } else {
        const zip = JSZip()
        const promises = []
        // 文件错误
        const errorList = []
        this.MBomDetCode.forEach(Code => {
          const promise = getNewFile(Code).then(res => {
            if (!res.success) {
              this.$message({
                message: `文件编号:${Code}发生错误,${res.message}`,
                type: 'error',
                duration: 3 * 1000
              })
              errorList.push(res.success)
              return
            } else {
              const newFile = res.data[0].newFile
              const bomCodeName = res.data[0].bomCode + '.prt'
              const blob = base64ToBlob(newFile)
              // 存入文件名字和数据
              zip.file(bomCodeName, blob)
            }
          })
          promises.push(promise)
        })
        Promise.all(promises).then((res) => {
          if (promises.length > errorList.length) {
            zip.generateAsync({ type: 'blob' }).then(content => {
              saveAs(content, `${this.outRCode}.zip`)
            })
          } else {
            this.$message({
              message: `文件全部发生错误,请联系文件提供方！`,
              type: 'error',
              duration: 3 * 1000
            })
          }
          this.fileDownloadLoading = false
        })
      }
      // 重置多选框
      this.$refs.detailListButtom.clearSelection()
    },
    // 下载型面文件
    profileFileDownload() {
      this.profileFileLoading = true
      if (this.projectCode.length < 1) {
        this.$message({
          message: '请选择需要下载的文件',
          type: 'error',
          duration: 3 * 1000
        })
        this.profileFileLoading = false
      } else {
        const zip = new JSZip()
        const promises = []
        // 文件错误
        const errorList = []
        this.projectCode.forEach(Code => {
          const promise = getProfileFile(Code).then(res => {
            if (!res.success) {
              this.$message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
              })
              errorList.push(res.success)
              return
            } else {
              const newFile = res.data[0].newFile
              const bomCodeName = res.data[0].bomCode + '.prt'
              const blob = base64ToBlob(newFile)
              zip.file(bomCodeName, blob)
              promises.push(promise)
            }
          })
        })
        Promise.all(promises).then((res) => {
          if (promises.length > errorList.length) {
            zip.generateAsync({ type: 'blob' }).then(content => {
              saveAs(content, `${this.OutOCode}.zip`)
            })
          } else {
            this.$message({
              message: `文件全部发生错误,请联系文件提供方！`,
              type: 'error',
              duration: 3 * 1000
            })
          }
          this.profileFileLoading = false
        })
      }
      // 重置多选框
      this.$refs.detailListButtom.clearSelection()
      this.profileFileLoading = false
    },
    // 多选
    handleSelectionChange(val) {
      const outOIdArray = val.map(item => item.MBomDetCode)
      const projectCodeArray = val.map(item => item.ProjectCode)
      this.MBomDetCode = outOIdArray
      this.projectCode = projectCodeArray
    },
    // 分页设定页数据个数
    pageSize(val) {
      this.listQuery.pageSize = val.limit
      this.getList()
    },
    // 请求外协订单数据
    async getList() {
      this.listLoading = true
      this.listQuery.empId = this.empId
      const { data } = await orderList(this.listQuery)
      this.list = data[0].list
      this.total = data[1].totalCount
      this.listLoading = false
    },
    // 获取订单明细数据
    async DetailData() {
      this.detailListLoading = true
      const { data } = await orderListDetail(this.outRId)
      this.DetailList = data
      this.detailListLoading = false
    },
    listDetail(outRId, outRCode) {
      this.dialogTableVisible = true
      this.outRId = outRId
      this.outRCode = outRCode
      this.DetailData()
    },
    // 关闭对话框
    cancel() {
      this.dialogTableVisible = false
      this.fileDownloadLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  width: 100%;
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 20px;
  }
  .el-button {
    margin-right: 20px;
  }
}
</style>
