<script setup lang="tsx">
import { ref, computed } from 'vue'
import ResetPassword from './components/ResetPassword/index.vue'
import QrcodeVue from 'qrcode.vue'
import { user } from '@renderer/api'
import { reactive } from 'vue'
import { FieldRule, Message, Form } from '@arco-design/web-vue'
import { Validate, globalStorage } from '@renderer/utils'

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

/** 表单 */
const formRef = ref<InstanceType<typeof Form>>()

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

const formRules: Record<keyof typeof form, FieldRule | FieldRule[]> = {
  account: [
    {
      required: true,
      message: '请输入手机号'
    },
    {
      match: Validate.mobile,
      message: '手机号格式不正确'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    },
    {
      match: Validate.password,
      message: '密码格式不正确，仅支持英文数字至少包含两种字符类型'
    }
  ]
}

const handleLogin = (values) => {
  user.login(values).then((res) => {
    if (res.code === 0) {
      const { data } = res
      globalStorage.set('token', data.token)
      globalStorage.set('userInfo', data.userInfo)
      window.electron.ipcRenderer.invoke('closeWindow')
      window.electron.ipcRenderer.invoke('openSingleWindow', 'index')
      Message.success('登录成功')
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
              <a-form
                ref="formRef"
                hide-label
                :label-col-props="{ span: 0 }"
                :wrapper-col-props="{ span: 24 }"
                :model="form"
                :rules="formRules"
                @submit-success="handleLogin"
              >
                <a-form-item field="account">
                  <a-input
                    v-model="form.account"
                    allow-clear
                    :style="{ width: '277px' }"
                    placeholder="请输入手机号"
                  />
                </a-form-item>
                <a-form-item field="password">
                  <a-input
                    v-model="form.password"
                    allow-clear
                    :style="{ width: '277px' }"
                    :placeholder="loginMap.placeholder"
                  >
                    <template #append>
                      <a class="send-vcode-btn" @click="resetPassword">{{ loginMap.btn }}</a>
                    </template></a-input
                  >
                </a-form-item>
                <a-form-item>
                  <a-button long type="primary" html-type="submit">登录</a-button>
                </a-form-item>
              </a-form>

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
