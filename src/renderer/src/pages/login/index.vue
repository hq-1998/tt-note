<script setup lang="tsx">
import { ref, computed } from 'vue'
import ResetPassword from './components/ResetPassword/index.vue'
import QrcodeVue from 'qrcode.vue'
import { user } from '@renderer/api'
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

enum ELoginType {
  verifyCode = 1,
  passwordCode = 2
}

const loginType = ref<ELoginType>(ELoginType.verifyCode)

const toggleLoginType = () => {
  loginType.value =
    loginType.value === ELoginType.verifyCode ? ELoginType.passwordCode : ELoginType.verifyCode
}

/** 忘记密码 */
const resetPwdRef = ref<{
  toggleModalVisible: () => void
}>()

const modalVisible = ref(false)
const resetPassword = () => {
  resetPwdRef.value!.toggleModalVisible()
}

const loginIcons = [
  {
    title: '微博',
    icon: <icon-weibo-circle-fill />
  },
  {
    title: '微信',
    icon: <icon-wechat />
  },
  {
    title: 'GitHub',
    icon: <icon-github />
  }
]

const loginVerifyMap = {
  title: '验证码登录',
  placeholder: '请输入验证码',
  btn: '获取验证码'
}

const loginPwdMap = {
  title: '密码登录',
  placeholder: '请输入密码',
  btn: '忘记密码'
}

const loginMap = computed(() => {
  return {
    [ELoginType.verifyCode]: loginVerifyMap,
    [ELoginType.passwordCode]: loginPwdMap
  }[loginType.value]
})

const title = import.meta.env.RENDERER_VITE_APP_TITLE

const form = reactive({
  account: '',
  password: ''
})

const handleLogin = () => {
  user.login(form).then((res) => {
    if (res.code === 0) {
      Message.success('登录成功')
      window.electron.ipcRenderer.invoke('closeWindow')
      window.electron.ipcRenderer.invoke('openSingleWindow', 'index')
    }
  })
}
</script>

<template>
  <div class="modal">
    <header class="header">登录{{ title }}畅享更多权益</header>
    <div class="auth-body">
      <div class="content">
        <a-row justify="space-between" :wrap="false">
          <div class="login-main">
            <h1 class="title">
              {{ loginMap.title }}
            </h1>
            <div class="input-group">
              <a-space direction="vertical" :size="24">
                <a-input
                  v-model="form.account"
                  placeholder="请输入手机号"
                  allow-clear
                  :style="{ width: '277px' }"
                ></a-input>
                <a-input
                  v-model="form.password"
                  :placeholder="loginMap.placeholder"
                  allow-clear
                  :style="{ width: '277px' }"
                >
                  <template #append>
                    <a class="send-vcode-btn" @click="resetPassword">{{ loginMap.btn }}</a>
                  </template>
                </a-input>
                <a-button long type="primary" @click="handleLogin">登录</a-button>
                <div class="other-login-box">
                  <div class="oauth-box">
                    <span>其他登录：</span>
                    <div v-for="item in loginIcons" :key="item.title" class="oauth">
                      <div class="oauth-bg">
                        <component :is="item.icon" />
                      </div>
                    </div>
                  </div>
                  <span class="clickable" @click="toggleLoginType">{{
                    loginType === 1 ? '密码登录' : '验证码登录'
                  }}</span>
                </div>
              </a-space>
            </div>
          </div>
          <div class="auth-qrcode">
            <h1 class="title">扫码登录</h1>
            <div class="qrcode-img-wrap">
              <QrcodeVue class="qrcode-img" value="https://www.baidu.com" :size="120" />
            </div>
            <div class="qrcode-text">
              打开
              <a class="app">小腾笔记APP</a>
              <div>点击“我-左上角扫一扫”登录</div>
            </div>
          </div>
        </a-row>
      </div>
      <footer class="agreement-box">
        注册登录即表示同意
        <a class="terms">用户协议</a>
        和
        <a class="privacy">隐私政策</a>
      </footer>
    </div>

    <ResetPassword ref="resetPwdRef" :modal-visible="modalVisible" />
  </div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
