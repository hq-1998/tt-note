<script lang="tsx" setup>
import { ref, reactive, watch } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'
import BaseForm from '@renderer/components/base-form/index.vue'
import Validate from '@renderer/utils/validate'
import UploadAvatar from '@renderer/components/upload-avatar/index.vue'
import type { IMergeFormItemConfig } from '@renderer/components/base-form/index.vue'
import styles from './style.module.less'
import { data, genderOptions } from './constant'

defineOptions({
  name: 'UserInfoModal'
})

const props = defineProps<{
  modalVisible: boolean
}>()

const modalVisible = ref(props.modalVisible)
const formRef = ref<typeof BaseForm>()
const form = reactive({
  mobile: '',
  account: '15605031018',
  nickName: '',
  gender: 1,
  area: '',
  sign: '',
  province: 'Haidian',
  city: 'Chaoyang'
})

const toggleModalVisible = () => {
  const oldVisible = modalVisible.value
  modalVisible.value = !oldVisible
  if (oldVisible) {
    formRef.value!.resetFields()
  }
}

watch(
  () => form.province,
  () => {
    form.city = ''
  }
)

defineExpose({
  toggleModalVisible
})

const formConfig = {
  model: form,
  rules: {
    nickName: [Validate.required('昵称不能为空')]
  }
}

const formItemConfig: IMergeFormItemConfig[] = [
  {
    label: '头像',
    field: 'mobile',
    hideAsterisk: true,
    render: () => <UploadAvatar />
  },
  {
    label: '账号',
    field: 'account',
    hideAsterisk: true,
    render: () => <span>{form.account}</span>
  },
  {
    label: '昵称',
    field: 'nickName',
    hideAsterisk: true,
    render: () => <a-input v-model={form.nickName} maxLength={16} placeholder="最多可输入16个字" />
  },
  {
    label: '性别',
    field: 'gender',
    hideAsterisk: true,
    render: () => (
      <a-radio-group v-model={form.gender}>
        {genderOptions.map((item) => {
          return (
            <a-radio key={item.value} value={item.value}>
              {item.label}
            </a-radio>
          )
        })}
      </a-radio-group>
    )
  },
  {
    label: '地区',
    field: 'area',
    hideAsterisk: true,
    render: () => (
      <a-space>
        <a-select v-model={form.province} style={{ width: '140px' }}>
          {Object.keys(data).map((value) => {
            return <a-option key={value}>{value}</a-option>
          })}
        </a-select>
        <a-select
          v-model={form.city}
          style={{ width: '140px' }}
          options={data[form.province as keyof typeof data] || []}
        />
      </a-space>
    )
  },
  {
    label: '签名',
    field: 'sign',
    hideAsterisk: true,
    render: () => <a-textarea v-model={form.sign} maxLength={30} placeholder="最多可输入30个字" />
  },
  {
    noStyle: true,
    render: () => (
      <div class={styles['flex-end']}>
        <a-space>
          <a-button>取消</a-button>
          <a-button type="primary" html-type="submit">
            保存
          </a-button>
        </a-space>
      </div>
    )
  }
]
</script>

<template>
  <BaseModal v-model:visible="modalVisible" width="400px">
    <BaseForm ref="formRef" :form-config="formConfig" :form-item-config="formItemConfig" />
  </BaseModal>
</template>
