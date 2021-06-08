<template>
  <div class="login-container">
    <div class="login-box">
      <div class="header-title">
        <div class="logo-img"><img src="../../assets/logo/CPM.png" alt=""></div>
        <div class="logo-title">
          天倬供应链资源管理系统
        </div>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">用户登录</h3>
        </div>

        <el-form-item prop="username" class="input-item">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item prop="password" class="input-item">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;font-size:20  px" @click.native.prevent="handleLogin">用户登录</el-button>
      </el-form>
    </div>

  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { Message } from 'element-ui'
import { removeToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login').then(() => {
            this.$store.dispatch('user/getInfo', this.loginForm).then(res => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(() => {
              Message({
                message: '用户名或密码错误',
                type: 'error',
                duration: 5 * 1000
              })
              removeToken()
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:rgb(20, 20, 20);
$cursor: rgb(54, 54, 54);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    background: $bg;
    border-radius:5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#000000;
$light_gray:rgb(29, 28, 28);

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background: url('../../assets/login/login_bg.jpg') no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  .login-box {
    position: absolute;
    top: 50%;
    left: 62%;
    // transform: translateY(-50%) translateX(-50%);
    transform: translateY(-50%);
    width: 30%;
    // width: 450px;
    max-width: 100%;
  }
  .header-title {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100px;
    .logo-img {
      width: 20%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .logo-title {
      text-align: start;
      height: 100%;
      // width: 80%;
      font-size: 29px;
      font-weight: 600;
      line-height: 100px;
    }
  }
  .login-form {
    // position: relative;
    padding: 50px 35px 0;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc,0 0 10px #ccc;
    overflow: hidden;
    .input-item {
      margin: 40px 0;
      box-shadow: 0 0 2px #ccc,0 0 2px #ccc;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 50px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
