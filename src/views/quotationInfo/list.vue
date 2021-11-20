<template>
  <!-- 报价单 -->
  <div class="app-container">
    <!-- 表格菜单栏 -->
    <div class="filter-container">
      <el-input v-model="input" placeholder="请输入产品名称、型号或料号" style="width: 250px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search">查找</el-button>
      <el-button class="add-item" type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisible = true">添加报价</el-button>
    </div>

    <div class="title-box">
      <div class="title">报价单列表</div>
    </div>

    <el-table
      ref="detailListButtom"
      :data="dataList"
      stripe
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="报价单编号" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="供应商" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="价格" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="报价有效期" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发布时间" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="选标" width="140">
        <template slot-scope="{row}" size="medium">
          <el-tag>{{ row.MatHandCode }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加报价 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      input: '',
      dataList: [],
      dialogVisible: false // 添加报价对话框
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang='scss' scoped>
  .filter-container {
    // display: flex;
    width: 100%;
    padding-bottom: 5px;
    position: relative;
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 20px;
    }
    .add-item {
      position: absolute;
      right: 10px;
      margin-left: 200px;
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
  }
</style>
