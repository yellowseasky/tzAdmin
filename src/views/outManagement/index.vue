<template>
  <div class="app-container">
    <!-- 表格菜单栏 -->
    <div class="filter-container">
      <el-input v-model="searchListId" placeholder="请输入单据编号" style="width: 200px;" class="filter-item" clearable @clear="clearInput" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
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
    <!-- 过滤容器 -->
    <div class="filter-container-table" />
    <el-table
      v-loading="listLoading"
      stripe
      :data="list"
      border
      highlight-current-row
      style="width: 100%"
      @cell-click="clickRowList"
    >

      <el-table-column align="center" label="ID" width="70">
        <template slot-scope="{row}">
          <span>{{ row.rownum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人">
        <template slot-scope="{row}">
          <el-tag size="medium">{{ row.EmpName_Creat }}</el-tag>
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

      <el-table-column width="300" align="center" label="供应商名称">
        <template slot-scope="{row}">
          <span>{{ row.SupplierName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前状态">
        <template slot-scope="{row}">
          <el-tag :type="row.WfStateName | statusFilter">
            {{ row.WfStateName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 动作按钮 -->
      <el-table-column label="动作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="listDetail(row.OutOId, row.OutOCode)">
            订单明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <pagination v-show="total>listQuery.pageSize" :total="total" :page-size="listQuery.pageSize" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="pageSize" />
    <!-- 订单详细 -->
    <el-dialog :visible.sync="dialogTableVisible" width="80%">
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="stream-list" />
        <span class="title-text" style="font-weight: 600; color:#666666">订单详细</span>
        <div class="button-right">
          <span class="title-close" @click="cancel" />
        </div>
      </div>
      <el-table
        ref="detailListButtom"
        v-loading="listLoading"
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

        <el-table-column align="center" width="50" label="外协数量">
          <template slot-scope="{row}">
            <span>{{ row.OutODetNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="物料单位">
          <template slot-scope="{row}">
            <span>{{ row.OutODetUnit }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="要求交期">
          <template slot-scope="{row}">
            <span>{{ row.OutODetDelieryTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="出厂日期">
          <template slot-scope="{row}">
            <span v-if="row.OutODetDeliveryTime">{{ row.OutODetDeliveryTime }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="回厂日期">
          <template slot-scope="{row}">
            <span v-if="row.OutODetAccepterTime">{{ row.OutODetAccepterTime }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="送货单编码">
          <template slot-scope="{row}">
            <span v-if="row.OutODetDeliveryCode">{{ row.OutODetDeliveryCode }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="热处理要求">
          <template slot-scope="{row}">
            <span v-if="row.MBomDetHRCComment">{{ row.MBomDetHRCComment }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="加工说明">
          <template slot-scope="{row}">
            <span v-if="row.OutODetPSPEC">{{ row.OutODetPSPEC }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="当前仓库">
          <template slot-scope="{row}">
            <span>{{ row.StorName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="备注">
          <template slot-scope="{row}">
            <span v-if="row.OutODetComment">{{ row.OutODetComment }}</span>
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
// import { downloadFile } from '../../utils/index'
import { orderList, orderListDetail, getNewFile, getProfileFile } from '@/api/order'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'
import { timeChange } from '@/utils'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default {
  name: 'InlineEditTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        外协已完成: 'primary',
        结算中: 'success',
        外协中: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      DetailList: [],
      listQuery: {
        pageSize: 20,
        pageNumber: 1,
        empId: '',
        outOCode: '',
        outOType: '',
        sTime: '',
        eTime: ''
      },
      total: 0, // 总页
      listLoading: true,
      fileDownloadLoading: false, // 最新文件
      profileFileLoading: false, // 型面文件
      outOId: null,
      OutOCode: null, // 单据编号
      dialogTableVisible: false, // 详细外协订单框
      MBomDetCode: [], // 获取最新文件编号
      projectCode: [], // 型面文件编号
      ia: null, // 文件下载数据
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
      value2: [],
      searchListId: '' // 搜索数据
    }
  },
  computed: {
    ...mapGetters(['empId'])
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页设定页数据个数
    pageSize(val) {
      this.listQuery.pageSize = val.limit
      this.getList()
    },
    // 搜索框清空触发数据
    clearInput() {
      this.listQuery.outOCode = ''
      this.getList()
    },
    // 日期选择器数据处理
    async changeTime(val) {
      try {
        const startTime = timeChange(val[0])
        const endTime = timeChange(val[1])
        this.listQuery.sTime = startTime
        this.listQuery.eTime = endTime
        this.getList()
      } catch (e) {
        // 清理了日期
        this.listQuery.sTime = ''
        this.listQuery.eTime = ''
        this.getList()
      }
      this.listLoading = false
    },
    // 处理搜索筛选
    async handleFilter() {
      this.listLoading = true
      if (this.searchListId) {
        this.paginationShow = false
        this.listQuery.outOCode = this.searchListId
        this.listQuery.pageNumber = 1
        this.getList()
      } else {
        this.listQuery.outOCode = ''
        this.getList()
      }
      this.listLoading = false
    },
    // 全选
    handleAllChange(val) {
    },
    // 多选
    handleSelectionChange(val) {
      const outOIdArray = val.map(item => item.MBomDetCode)
      const projectCodeArray = val.map(item => item.ProjectCode)
      this.MBomDetCode = outOIdArray
      this.projectCode = projectCodeArray
    },
    // 请求外协订单数据
    async getList() {
      this.listLoading = true
      this.listQuery.empId = this.empId
      const { data } = await orderList(this.listQuery)
      this.list = data[0].list
      this.total = data[1].totalCount
      // this.list = data.sort(sortId)
      // 数据按日期倒叙排列
      // function sortId(a, b) {
      //   return Date.parse(b.OutOCreateTime) - Date.parse(a.OutOCreateTime)
      // }
      this.listLoading = false
    },
    // 下载最新文件
    async fileDownload() {
      this.fileDownloadLoading = true
      if (this.MBomDetCode.length < 1) {
        Message({
          message: '请选择需要下载的文件',
          type: 'error',
          duration: 5 * 1000
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
              Message({
                message: `文件编号:${Code}发生错误,${res.message}`,
                type: 'error',
                duration: 5 * 1000
              })
              errorList.push(res.success)
              return
            } else {
              const newFile = res.data[0].newFile
              const bomCodeName = res.data[0].bomCode + '.prt'
              // downloadFile(bomCodeName, newFile)
              const blob = this.base64ToBlob(newFile)
              // 存入文件名字和数据
              zip.file(bomCodeName, blob)
            }
          })
          promises.push(promise)
        })
        // console.log('errorList', errorList)
        Promise.all(promises).then((res) => {
          if (promises.length > errorList.length) {
            zip.generateAsync({ type: 'blob' }).then(content => {
              saveAs(content, `${this.OutOCode}.zip`)
            })
          } else {
            Message({
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
        Message({
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
              Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
              })
              errorList.push(res.success)
              return
            } else {
              const newFile = res.data[0].newFile
              const bomCodeName = res.data[0].bomCode + '.prt'
              // downloadFile(bomCodeName, newFile)
              const blob = this.base64ToBlob(newFile)
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
            Message({
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
    // base转blob
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      // const contentType = parts[0].split(/:(.*?);/)[1]
      const raw = window.atob(parts)
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: 'application/x-prt' })
    },

    // 点击某个行数触发
    clickRowList(data) {
    },
    listDetail(outOId, OutOCode) {
      this.dialogTableVisible = true
      this.outOId = outOId
      this.OutOCode = OutOCode
      this.DetailData()
      this.listLoading = true
    },
    // 获取订单明细数据
    async DetailData() {
      const { data } = await orderListDetail(this.outOId)
      this.DetailList = data
      // console.log('DetailData详细数据', this.DetailList)
      this.listLoading = false
    },
    // 关闭对话框
    cancel() {
      this.fileDownloadLoading = false
      this.profileFileLoading = false
      this.dialogTableVisible = false
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
    margin-bottom: 10px;
  }
  .el-button {
    margin-right: 20px;
  }

}
.edit-input {
  padding-right: 100px;
  color: rgb(50, 50, 50);
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
