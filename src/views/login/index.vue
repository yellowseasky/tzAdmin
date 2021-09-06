<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar_box">
        <img src="../../assets/logo/CPM.png" alt="">
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">天倬供应链资源管理系统</h3>
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

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;font-size:18px" @click.native.prevent="handleLogin">用户登录</el-button>
      </el-form>
    </div>

  </div>
</template>

<script>

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
    // 密码显示或隐藏
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
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login').then(() => {
            this.$store.dispatch('user/getInfo', this.loginForm).then(ret => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(err => {
              console.log('登录错误')

              this.$message({
                message: err,
                type: 'error',
                duration: 3 * 1000
              })
              removeToken()
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
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
$light_gray:rgb(94, 94, 94);
$border_gray: #ccc;
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
    left: 64%;
    transform: translateY(-60%);
    // width: 32%;
    width: 520px;
    max-width: 100%;
    .avatar_box {
      position: relative;
      width: 130px;
      height: 130px;
      top: 65px;
      border: 1px solid $border_gray;
      border-radius: 50%;
      padding: 10px;
      background-color: #fff;
      margin: auto;
      box-shadow: 0 0 20px $border_gray;
      img {
        background-color: #DEDEDE;
        padding: 5px;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .login-form {
    padding: 65px 35px 0;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    .input-item {
      margin: 30px 0;
      box-shadow: 0 0 2px $border_gray,0 0 2px $border_gray;
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
    border-bottom: 2px solid $border_gray;
    .title {
      font-size: 26px;
      color: $light_gray;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
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
  @media only screen and (max-width: 1480px) {
    .login-box {
      top: 50%;
      left: 55%;
      transform: translateY(-60%);
      .login-form {
        background-color: #fff;
      }
    }
  }
  @media only screen and (max-width: 1200px) {
    .login-box {
      transform: translate(-50%, -50%);
      width: 50%;
      top: 40%;
      left: 50%;
    }
  }
}
</style>
