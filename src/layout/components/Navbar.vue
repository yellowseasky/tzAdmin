<template>
  <div>
    <div class="navbar">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb class="breadcrumb-container" />
      <div class="right-menu">
        <div class="right-menu-item hover-effect">{{ currentTime }}</div>
        <el-dropdown class="avatar-container" trigger="click" style="top:-10px;">
          <div class="avatar-wrapper">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                主页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
            <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/" />
            <el-dropdown-item divided @click.native="changePsw()">
              <span style="display:block;">修改密码</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
          <svg-icon icon-class="signOut" style="font-size:38px" class="right-menu-item hover-effect" @click.native="logout" />
        </el-tooltip>
      </div>
    </div>
    <!-- 修改密码 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" @close="closeDialog">
      <div slot="title" class="dialog-title">
        <i class="el-icon-edit-outline" />
        <span class="title-text">修改密码</span>
        <div class="button-right">
          <span class="title-close" @click="cancel" />
        </div>
      </div>
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules">
        <el-form-item label="当前密码 " prop="oldPass" :label-width="formLabelWidth">
          <el-input
            v-model="ruleForm.oldPass"
            :type="PassType.oldPassType"
            placeholder="当前账户登录密码"
            autocomplete="off"
          />
          <span style="position: absolute;right:35px" @click="showPwd('oldPassType')">
            <svg-icon :icon-class="PassType.oldPassType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="新密码 " prop="newPass" :label-width="formLabelWidth">
          <el-input
            v-model="ruleForm.newPass"
            :type="PassType.newPassType"
            placeholder="设置一个新的账户登录密码"
            autocomplete="off"
          />
          <span style="position: absolute;right:35px" @click="showPwd('newPassType')">
            <svg-icon :icon-class="PassType.newPassType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="确认新密码 " prop="checkPass" :label-width="formLabelWidth">
          <el-input
            v-model="ruleForm.checkPass"
            :type="PassType.checkPass"
            placeholder="请重复你设置的密码"
            autocomplete="off"
          />
          <span style="position: absolute;right:35px" @click="showPwd('checkPass')">
            <svg-icon :icon-class="PassType.checkPass === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定 修 改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import { getPsw, setPsw, getId } from '@/utils/auth'
import { modifyPSW } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data() {
    // 就密码
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value !== getPsw()) {
        callback(new Error('你输入的密码有误'))
      } else {
        callback()
      }
    }
    // 新密码
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    // 确认新密码
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      timer: '', // 定义一个定时器的变量
      currentTime: null, // 获取当前时间
      dialogFormVisible: false,
      PassType: {
        oldPassType: 'password',
        newPassType: 'password',
        checkPass: 'password'
      },
      oldPassType: 'password',
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      // 表单宽度
      formLabelWidth: '100px',
      rules: {
        oldPass: [
          { required: true, validator: validateOldPass, trigger: 'blur' }
        ],
        newPass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    var _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function() {
      _this.currentTime = // 修改数据date
        new Date().getFullYear() +
        '年' +
        (new Date().getMonth() + 1) +
        '月' +
        new Date().getDate() +
        '日' +
        new Date().getHours() +
        '时' +
        new Date().getMinutes() +
        '分'
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  mounted() {
  },
  methods: {
    // 关闭对话框
    closeDialog() {
      this.resetForm()
    },
    showPwd(val) {
      console.log('val', val)
      if (val === 'oldPassType') {
        if (this.PassType.oldPassType === 'password') {
          this.PassType.oldPassType = ''
        } else {
          this.PassType.oldPassType = 'password'
        }
      } else if (val === 'newPassType') {
        if (this.PassType.newPassType === 'password') {
          this.PassType.newPassType = ''
        } else {
          this.PassType.newPassType = 'password'
        }
      } else {
        if (this.PassType.checkPass === 'password') {
          this.PassType.checkPass = ''
        } else {
          this.PassType.checkPass = 'password'
        }
      }
    },
    // 确认修改密码
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          delete this.ruleForm.checkPass
          modifyPSW(getId(), this.ruleForm.oldPass, this.ruleForm.newPass).then(res => {
            this.$message({
              message: '修改成功,请重新登录',
              type: 'success',
              duration: 3000
            })
            setPsw(this.ruleForm.newPass)
            this.resetForm()
            this.logout()
          }).catch(err => {
            this.$message({
              message: err,
              type: 'warning'
            })
          })
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '您的操作有误,请重新输入',
            type: 'warning'
          })
          this.resetForm()
        }
      })
    },
    // 修改密码
    changePsw() {
      this.dialogFormVisible = true
    },
    // 重置
    resetForm(formName) {
      this.$refs.ruleForm.resetFields()
    },
    // 关闭对话框
    cancel() {
      this.dialogFormVisible = false
    },
    // 取消
    cancelForm() {
      this.resetForm()
      this.dialogFormVisible = false
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/resetToken')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    timeBar() {
      var t = null
      t = setTimeout(time, 1000)// 開始运行
      function time() {
        clearTimeout(t)// 清除定时器
        var dt = new Date()
        var y = dt.getFullYear()
        var mt = dt.getMonth() + 1
        var day = dt.getDate()
        var h = dt.getHours()// 获取时
        var m = dt.getMinutes()// 获取分
        // var s = dt.getSeconds()// 获取秒
        document.querySelector('#datetime').innerHTML = y + '年' + mt + '月' + day + '日' + h + '时' + m + '分'
        t = setTimeout(time, 1000) // 设定定时器，循环运行
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  // margin-top: 50px;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .datetime {
      margin: 0 10px;
    }
    .item {
      margin: 4px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
