<script lang="ts" setup>
import { ref, reactive } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'
import Validate from '@renderer/utils/validate'

const props = defineProps<{
  modalVisible: boolean
}>()

const modalVisible = ref(props.modalVisible)
const formRef = ref()
const codeMessage = ref('获取验证码')
const form = reactive({
  mobile: '',
  newPassword: '',
  code: ''
})

const rules = {
  mobile: [
    Validate.required('手机号不能为空'),
    Validate.match(Validate.mobile, '手机号格式不正确')
  ],
  newPassword: [
    Validate.required('新密码不能为空'),
    Validate.match(Validate.password, '密码格式不正确，至少包含英文数字两种类型')
  ],
  code: [Validate.required('验证码不能为空'), Validate.match(Validate.code, '验证码格式不正确')]
}

const handleSubmit = async (_data) => {}

const toggleModalVisible = () => {
  const oldVisible = modalVisible.value
  modalVisible.value = !oldVisible
  if (oldVisible) {
    formRef.value.resetFields()
  }
}

/** 获取验证码 */
let isClickBtn = false
const handleGetCode = async () => {
  const errors = await formRef.value.validateField('mobile')
  if (!errors && !isClickBtn) {
    isClickBtn = true
    let count = 60
    codeMessage.value = `${count}秒后重新获取`
    const timer = setInterval(() => {
      if (count > 0) {
        count--
        codeMessage.value = `${count}秒后重新获取`
      } else {
        isClickBtn = false
        clearInterval(timer)
        codeMessage.value = '获取验证码'
      }
    }, 1000)
  }
}

defineExpose({
  toggleModalVisible
})
</script>

<template>
  <BaseModal v-model:visible="modalVisible" width="300px">
    <template #title>登录小站畅享更多权益</template>
    <h1 class="title">
      手机号重置密码
      <!-- <span class="prompt-button clickable">邮箱重置密码</span> -->
    </h1>
    <a-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 0 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="handleSubmit"
    >
      <a-form-item field="mobile" label="">
        <a-input v-model="form.mobile" :max-length="11" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item field="newPassword" label="">
        <a-input v-model="form.newPassword" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item field="code" label="">
        <a-input v-model="form.code" placeholder="请输入验证码">
          <template #append>
            <a class="code" type="text" @click="handleGetCode">{{ codeMessage }}</a>
          </template></a-input
        >
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
