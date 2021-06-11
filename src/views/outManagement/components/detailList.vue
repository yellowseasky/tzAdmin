<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" width="80%">
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="stream-list" />
        <span class="title-text">订单详细</span>
        <div class="button-right">
          <span class="title-close" />
        </div>
      </div>
      <el-table
        ref="detailListButtom"
        :data="detailList"
        border
        height="400"
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
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
        <el-button type="primary" @click="closeDialog">确 定</el-button>
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
import { getNewFile, getProfileFile } from '@/api/order'
import { Message } from 'element-ui'
export default {
  name: '',
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    detailList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      changeDialog: this.dialogTableVisible,
      fileDownloadLoading: false,
      profileFileLoading: false,
      ia: null, // 文件下载数据
      MBomDetCode: [], // 获取最新文件编号
      projectCode: [] // 型面文件编号
    }
  },
  computed: {
    dialogTableVisible_: {
      get() {
        return this.dialogTableVisible
      },
      set(val) {
        // grants_改变由父组件控制
        this.$emit('on-change-Visible', val)
      }
    }
  },
  mounted() {
  },
  methods: {
    closeDialog() {
      this.changeDialog = false
      // this.$emit('dialogTableVisibleEvent', { dialog: false })
      console.log('关闭了closeDialog')
      // this.$emit('on-change-Visible', { changeDialog: false })
    },
    // 关闭对话框
    cancel() {
      // this.closeDialog()
      this.changeDialog = false
      // this.$emit('dialogTableVisibleEvent', { dialog: false })
      // this.$emit('on-change-Visible', { changeDialog: false })
      console.log('cancel')
      // this.changeDialog = false
      // this.dialogVisible = false
    },
    // 下载文件
    fileDownload() {
      this.fileDownloadLoading = true
      if (this.MBomDetCode.length < 1) {
        Message({
          message: '请选择需要下载的文件',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.MBomDetCode.map(Code => {
          getNewFile(Code).then(res => {
            if (!res.success) {
              Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
              })
              return
            }
            const newFile = res.data[0].newFile
            this.toBinary(newFile)
          })
          // 重置多选框
          this.$refs.detailListButtom.clearSelection()
        })
      }
      this.fileDownloadLoading = false
    },
    // 下载型面文件
    profileFileDownload() {
      this.profileFileLoading = true
      if (this.projectCode.length < 1) {
        Message({
          message: '请选择需要下载的文件',
          type: 'error',
          duration: 5 * 1000
        })
        this.profileFileLoading = false
      } else {
        this.projectCode.forEach(Code => {
          getProfileFile(Code).then(res => {
            if (!res.success) {
              Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
              })
              return
            }
            const newFile = res.data[0].newFile
            this.toBinary(newFile)
          })
          // 重置多选框
          this.profileFileLoading = false
          this.$refs.detailListButtom.clearSelection()
        })
      }
    },
    // 转二进制
    toBinary(file) {
      // 二进制数组转换
      var ab = new ArrayBuffer(file.length)
      this.ia = new Uint8Array(ab)
      for (var i = 0; i < file.length; i++) {
        this.ia[i] = file.charCodeAt(i)
      }
      this.downFile(this.ia)
    },
    // 将内存中的数据保存为文件下载到本地
    downFile(json1) {
      // 兼容IE
      if (window.navigator.msSaveBlob) {
        const blob = new Blob(['json1'], { type: 'application/x-prt,charset=utf-8' })
        window.navigator.msSaveBlob(blob, +new Date() + '.prt')
      }
      var downloadA = document.createElement('a')
      var data = new Blob([json1], { type: 'application/x-prt' + ';charset=UTF-8' })
      var downloadUrl = window.URL.createObjectURL(data)
      downloadA.setAttribute('href', downloadUrl)
      downloadA.setAttribute('download', +new Date() + '.prt')
      document.body.appendChild(downloadA)
      downloadA.click()
      document.body.removeChild(downloadA)
    },
    // 多选
    handleSelectionChange(val) {
      const outOIdArray = val.map(item => item.MBomDetCode)
      const projectCodeArray = val.map(item => item.ProjectCode)
      this.MBomDetCode = outOIdArray
      this.projectCode = projectCodeArray
    }
  }
}
</script>

<style scoped lang='less'>
</style>
