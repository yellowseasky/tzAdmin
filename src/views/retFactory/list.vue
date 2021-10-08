<template>
  <div class="app-container">
    <div class="title-box">
      <div class="title">基本信息</div>
      <div v-if="empType == '管理员'?false : true" class="add-list">
        <router-link to="/retFactory/add">
          <el-button size="small" class="filter-item" type="primary">新增</el-button>
        </router-link>
      </div>
    </div>
    <!-- 表格菜单栏 -->
    <div v-if="Object.keys(dataList).length" class="filter-container">
      <el-input v-model="searchListId" placeholder="请输入单据编码" style="width: 200px;" class="filter-item" clearable @clear="clearInput" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <datePicker @Time="getTime" />
    </div>

    <el-table
      ref="detailListButtom"
      v-loading="listLoading"
      :data="dataList"
      stripe
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="单据编码" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="{row}">
          <span>{{ row.MatHandCreatTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人">
        <template slot-scope="{row}">
          <span>{{ row.EmpName_Creat }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交送人">
        <template slot-scope="{row}">
          <span>{{ row.EmpName_Submit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="签收人">
        <template slot-scope="{row}">
          <span v-if="row.EmpName_Receive">{{ row.EmpName_Receive }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="原仓库" width="120">
        <template slot-scope="{row}">
          <span>{{ row.StorName_Source }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出仓库" width="120">
        <template slot-scope="{row}">
          <span v-if="row.StorName_Dest" size="medium">{{ row.StorName_Dest }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 动作按钮 -->
      <el-table-column label="动作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="listDetail(row.MatHandId)">
            明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total>listQuery.pageSize" :total="total" :page-size="listQuery.pageSize" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="pageSize" />

    <!-- 申请单明细 -->
    <el-dialog :visible.sync="dialogTableVisible" width="70%">
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="stream-list" />
        <span class="title-text" style="font-weight: 600; color:#666666">返厂单列表明细</span>
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
        height="300"
        highlight-current-row
        style="width: 100%"
      >

        <el-table-column type="index" label="序号" width="50" align="center" />

        <el-table-column align="center" label="物料编码" width="190">
          <template slot-scope="{row}">
            <span>{{ row.MatHandDetBomCode }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="物料规格" width="150">
          <template slot-scope="{row}">
            <span>{{ row.MatHandDetSpecification }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="物料名称">
          <template slot-scope="{row}">
            <span>{{ row.MatHandDetBomName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="单位">
          <template slot-scope="{row}">
            <span>{{ row.MatHandDetBomUnit1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="申请数量">
          <template slot-scope="{row}">
            <span>{{ row.MatHandDetNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="签收数量">
          <template slot-scope="{row}">
            <span>{{ row.MatHandDetBomNumber1 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/DatePicker'

import { transferList, transferListDetail } from '@/api/transferOrder'

export default {
  name: 'RetFactoryList',
  components: {
    Pagination,
    DatePicker
  },
  data() {
    return {
      dataList: [],
      DetailList: [],
      matHandId: null,
      empType: '',
      listQuery: {
        pageSize: 20,
        pageNumber: 1,
        empId: '',
        matHandCode: '', // 必须
        sTime: '',
        eTime: ''
      },
      total: 0, // 总数
      listLoading: false,
      detailListLoading: false,
      dialogTableVisible: false,
      searchListId: '' // 搜索数据
    }
  },
  mounted() {
    const { empType } = JSON.parse(localStorage.getItem('userInfo'))
    this.empType = empType
    this.getTransferList()
  },
  methods: {
    // 分页设定页数据个数
    pageSize(val) {
      this.listQuery.pageSize = val.limit
      this.getTransferList()
    },
    // 时间表点击
    getTime(startTime, endTime) {
      this.listQuery.sTime = startTime
      this.listQuery.eTime = endTime
      this.getTransferList()
    },
    // 处理搜索筛选
    async handleFilter() {
      if (this.searchListId) {
        this.listQuery.matHandCode = this.searchListId
        this.listQuery.pageNumber = 1
        this.getTransferList()
      } else {
        this.listQuery.matHandCode = ''
        this.getTransferList()
      }
    },
    // 搜索框清空触发数据
    clearInput() {
      this.listQuery.matHandCode = ''
      this.getTransferList()
    },
    // 明细
    listDetail(val) {
      this.dialogTableVisible = true
      this.matHandId = val
      this.DetailData()
    },
    // 获取转序明细数据
    async DetailData() {
      this.detailListLoading = true
      const { data } = await transferListDetail(this.matHandId)
      this.DetailList = data
      this.detailListLoading = false
    },
    // 转序单列表
    async getTransferList() {
      this.listLoading = true
      try {
        const { empId } = JSON.parse(localStorage.getItem('userInfo'))
        this.listQuery.empId = empId
        const { data } = await transferList(this.listQuery)
        this.dataList = data[0].list
        this.total = data[1].totalCount
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
          duration: 3 * 1000
        })
      }

      this.listLoading = false
    },
    // 关闭对话框
    cancel() {
      this.detailListLoading = false
      this.dialogTableVisible = false
    }
  }
}
</script>

<style scoped lang='scss'>
.filter-container {
  display: flex;
  width: 100%;
  padding-bottom: 5px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 20px;
  }
  .el-button {
    margin-right: 20px;
  }
}

.title-box {
  position: relative;
  width: 100%;
  border-bottom: 2px solid rgba(221, 221, 221, 0.6);
  margin: 10px 0;
  .title {
    margin-bottom: -2px;
    width: 9%;
    text-align: center;
    color: rgba(114, 113, 113);
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: 2px solid rgb(51, 74, 204);
  }
  .add-list {
    position: absolute;
    right: 10px;
    bottom: 5px;
    // display: flex;
    // justify-content: flex-end;
    // width: 100%;
    // padding-bottom: 0px;
  }
}

</style>
