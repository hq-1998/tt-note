<script lang="ts" setup>
import { ref, reactive } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'
import Validate from '@renderer/utils/validate'
import VerifyCode from '@renderer/components/verify-code/index.vue'
import { user } from '@renderer/api'
import Message from '@arco-design/web-vue/es/message'
import { Form } from '@arco-design/web-vue'

const props = defineProps<{
  modalVisible: boolean
}>()

const modalVisible = ref(props.modalVisible)
const formRef = ref<InstanceType<(typeof Form)['$props']>>()

const form = reactive({
  account: '',
  newPassword: '',
  code: ''
})

const rules = {
  account: [
    Validate.required('手机号不能为空'),
    Validate.match(Validate.mobile, '手机号格式不正确')
  ],
  newPassword: [
    Validate.required('新密码不能为空'),
    Validate.match(Validate.password, '密码格式不正确，至少包含英文数字两种类型')
  ],
  code: [Validate.required('验证码不能为空'), Validate.match(Validate.code, '验证码格式不正确')]
}

const handleSubmit = (values) => {
  user.resetPassword(values).then((res) => {
    if (res.code === 0) {
      Message.success('修改成功')
      toggleModalVisible()
    }
  })
}

const toggleModalVisible = () => {
  const oldVisible = modalVisible.value
  modalVisible.value = !oldVisible
  if (oldVisible) {
    formRef.value.resetFields()
  }
}

/** 发送验证码 */
const handleClick = async (callback) => {
  user
    .sendResetPasswordCode({
      account: form.account
    })
    .then((res) => {
      if (res.code === 0) {
        Message.success('验证码发送成功：' + res.data)
        callback?.()
      }
    })
}

/** 验证码校验 */
const handleTriggerValidate = async (cb?) => {
  const hasErrors = await formRef.value.validateField(['account', 'newPassword'])
  cb?.(!hasErrors)
}

/** 关闭弹窗 */
const handleClose = () => {
  formRef.value.resetFields()
  modalVisible.value = false
}

defineExpose({
  toggleModalVisible
})
</script>

<template>
  <BaseModal
    v-model:visible="modalVisible"
    title="忘记密码"
    width="300px"
    @handle-close="handleClose"
  >
    <h1 class="title">手机号重置密码</h1>
    <a-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 0 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit-success="handleSubmit"
    >
      <a-form-item field="account" label="">
        <a-input v-model="form.account" :max-length="11" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item field="newPassword" label="">
        <a-input v-model="form.newPassword" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item field="code" label="">
        <a-input
          v-model="form.code"
          allow-clear
          :style="{ width: '277px' }"
          placeholder="请输入验证码"
        >
          <template #append>
            <VerifyCode
              class="send-code-btn"
              @send-code="handleClick"
              @trigger-validate="handleTriggerValidate"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" long html-type="submit">修改</a-button>
      </a-form-item>
    </a-form>
    <a-row justify="center">
      <span class="back" @click="toggleModalVisible">返回登录</span>
    </a-row>
  </BaseModal>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
