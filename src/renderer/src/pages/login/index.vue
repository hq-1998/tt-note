<script setup lang="tsx">
import { ref, computed } from 'vue'
import ResetPassword from './components/ResetPassword/index.vue'
import VerifyCode from '@renderer/components/verify-code/index.vue'
import { user } from '@renderer/api'
import { reactive } from 'vue'
import { FieldRule, Form, Message } from '@arco-design/web-vue'
import { Validate, globalStorage } from '@renderer/utils'
import { ELoginType, ERegisterType } from '@renderer/api/user/data.d'
import { loginPwdMap, loginVerifyMap, registerPwdMap, registerVerifyMap } from './constants'

const title = import.meta.env.RENDERER_VITE_APP_TITLE

const loginType = ref<ELoginType>(ELoginType.passwordCode)
const registerType = ref<ERegisterType>(ERegisterType.LOGIN)
const loading = ref<boolean>(false)

const isSendVerifyCode = computed(() => loginType.value === ELoginType.verifyCode)

/** 切换登录态 */
const toggleLoginType = () => {
  form.password = ''
  formRef.value?.clearValidate()
  loginType.value = isSendVerifyCode.value ? ELoginType.passwordCode : ELoginType.verifyCode
}

/** 忘记密码 */
const modalVisible = ref(false)
const resetPwdRef = ref<{
  toggleModalVisible: () => void
}>()

const resetPassword = () => {
  resetPwdRef.value!.toggleModalVisible()
}

/** 表单 */
const formRef = ref<InstanceType<typeof Form>>()

const loginMap = computed(() => {
  return {
    [ELoginType.verifyCode]: loginVerifyMap,
    [ELoginType.passwordCode]: loginPwdMap
  }[loginType.value]
})

const registerMap = computed(() => {
  return {
    [ELoginType.verifyCode]: registerVerifyMap,
    [ELoginType.passwordCode]: registerPwdMap
  }[loginType.value]
})

const showMap = computed(() => {
  const isLogin = registerType.value === ERegisterType.LOGIN
  return isLogin ? loginMap.value : registerMap.value
})

const form = reactive({
  account: '',
  password: ''
})

const formRules: Record<keyof typeof form, FieldRule | FieldRule[]> = {
  account: [Validate.required('请输入手机号'), Validate.match(Validate.mobile, '手机号格式不正确')],
  password: [
    {
      validator: (value, cb) => {
        return new Promise<void>((resolve) => {
          if (!value) {
            cb(isSendVerifyCode.value ? '请输入验证码' : '请输入密码')
          }

          if (isSendVerifyCode.value) {
            if (!Validate.code.test(value)) {
              cb('验证码格式错误')
            }
          } else {
            if (!Validate.password.test(value)) {
              cb('密码格式不正确，仅支持英文数字至少包含两种字符类型')
            }
          }
          resolve()
        })
      }
    }
  ]
}

const handleSuccess = (values) => {
  const payload = {
    type: loginType.value as ELoginType,
    account: values.account,
    password: values.password
  }

  const api = isLogin.value ? user.login : user.register

  loading.value = true
  api(payload)
    .then((res) => {
      if (res.code === 0) {
        Message.success(`${isLogin.value ? '登录' : '注册'}成功`)
        if (isLogin.value) {
          setTimeout(() => {
            const { data } = res
            globalStorage.set('token', data.token)
            globalStorage.set('userInfo', data.userInfo)
            window.electron.ipcRenderer.invoke('closeWindow')
            window.electron.ipcRenderer.invoke('openSingleWindow', 'index')
            window.electron.ipcRenderer.invoke('setTrayUrl', { url: 'index' })
          }, 300)
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

/** 验证码 */
const handleTriggerValidate = async (cb?) => {
  const hasErrors = await formRef.value?.validateField('account')
  cb?.(!hasErrors)
}

const handleClick = async (callback) => {
  if (isSendVerifyCode.value) {
    if (!Validate.mobile.test(form.account)) {
      await handleTriggerValidate()
      return
    }
    user
      .sendLoginCode({
        account: form.account
      })
      .then((res) => {
        if (res.code === 0) {
          Message.success('验证码发送成功：' + res.data)
          callback?.()
        }
      })
  } else {
    resetPassword()
  }
}

/** 立即注册/立即登录 */
const handleSoonClick = () => {
  registerType.value =
    registerType.value === ERegisterType.REGISTER ? ERegisterType.LOGIN : ERegisterType.REGISTER
  loginType.value = ELoginType.passwordCode
}

/** 是否是登录 */
const isLogin = computed(() => {
  return registerType.value === ERegisterType.LOGIN
})
</script>

<template>
  <div class="modal">
    <header class="header">{{ `${isLogin ? '登录' : '注册'}${title}` }}畅享更多权益</header>
    <div class="auth-body">
      <div class="content">
        <a-row justify="space-between" :wrap="false">
          <div class="login-main">
            <h1 class="title">
              {{ showMap.title }}
            </h1>
            <div class="input-group">
              <a-form
                ref="formRef"
                hide-label
                :label-col-props="{ span: 0 }"
                :wrapper-col-props="{ span: 24 }"
                :model="form"
                :rules="formRules"
                @submit-success="handleSuccess"
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
                    v-if="isSendVerifyCode"
                    v-model="form.password"
                    allow-clear
                    :style="{ width: '277px' }"
                    :placeholder="showMap.placeholder"
                  >
                    <template #append>
                      <VerifyCode
                        :account="form.account"
                        class="send-code-btn"
                        @send-code="handleClick"
                        @trigger-validate="handleTriggerValidate"
                      /> </template
                  ></a-input>

                  <a-input-password
                    v-else
                    v-model="form.password"
                    allow-clear
                    :style="{ width: '277px' }"
                    :placeholder="showMap.placeholder"
                  >
                    <template v-if="isLogin" #append>
                      <a class="send-code-btn" @click="handleClick">忘记密码</a>
                    </template></a-input-password
                  >
                </a-form-item>
                <a-form-item>
                  <a-button :loading="loading" long type="primary" html-type="submit">{{
                    isLogin ? '登录' : '注册'
                  }}</a-button>
                </a-form-item>
              </a-form>

              <div :class="[isSendVerifyCode && 'layout-right', 'other-login-box']">
                <a-checkbox v-if="!isSendVerifyCode" :value="true">
                  <span class="remember">记住密码</span></a-checkbox
                >
                <span class="clickable" @click="toggleLoginType">{{
                  isSendVerifyCode
                    ? `密码${isLogin ? '登录' : '注册'}`
                    : `验证码${isLogin ? '登录' : '注册'}`
                }}</span>
              </div>
            </div>
          </div>
        </a-row>
      </div>
      <div class="agreement-box">
        注册登录即表示同意
        <a class="terms">用户协议</a>
        和
        <a class="privacy">隐私政策</a>
      </div>
      <footer class="register">
        {{ isLogin ? '还没有账号？' : '已有账号' }}
        <a class="clickable" @click="handleSoonClick">{{ isLogin ? '立即注册' : '立即登录' }}</a>
      </footer>
    </div>
    <ResetPassword ref="resetPwdRef" :modal-visible="modalVisible" />
  </div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
