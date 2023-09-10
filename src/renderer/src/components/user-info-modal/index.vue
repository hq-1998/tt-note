<script lang="tsx" setup>
import { ref, reactive, watch } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'
import BaseForm from '@renderer/components/base-form/index.vue'
import Validate from '@renderer/utils/validate'
import UploadAvatar from '@renderer/components/upload-avatar/index.vue'
import type { IMergeFormItemConfig } from '@renderer/components/base-form/index.vue'
import styles from './style.module.less'
import { genderOptions } from './constant'
import { useAreaStore, useUserStore } from '@renderer/store'
import { area, user } from '@renderer/api'
import { EGender } from '@renderer/api/user/data'
import { Message } from '@arco-design/web-vue'
import { omit } from 'lodash-es'
import { IUserInfo } from '@renderer/api/user/data'

defineOptions({
  name: 'UserInfoModal'
})

const props = defineProps<{
  modalVisible: boolean
}>()

const modalVisible = ref(props.modalVisible)
const formRef = ref<typeof BaseForm>()
const areaStore = useAreaStore()
const userStore = useUserStore()
const loading = ref<boolean>(false)

const state = reactive<{
  form: {
    id: number
    account?: string
    nickName?: string
    gender: EGender
    signature: string
    province: number
    city: number | null
    avatar?: string
  }
}>({ form: userStore.userInfo })

const toggleModalVisible = () => {
  const oldVisible = modalVisible.value
  modalVisible.value = !oldVisible
  if (oldVisible) {
    formRef.value?.resetFields()
  }
}

watch(
  () => userStore.userInfo,
  (value) => {
    state.form = value
  },
  {
    deep: true
  }
)

watch(
  () => state.form.province,
  (value) => {
    if (value) {
      state.form.city = null
      area.getCityByPid(state.form.province).then((res) => {
        if (res.code === 0) {
          areaStore.setCity(res.data)
          state.form.city = res.data[0].cid
        }
      })
    }
  },
  {
    immediate: true
  }
)

defineExpose({
  toggleModalVisible
})

const rules = {
  nickName: [Validate.required('昵称不能为空')]
}

const formItemConfig: IMergeFormItemConfig[] = [
  {
    label: '头像',
    field: 'avatar',
    hideAsterisk: true,
    render: () => <UploadAvatar v-model={state.form.avatar} />
  },
  {
    label: '账号',
    field: 'account',
    hideAsterisk: true,
    render: () => <span>{state.form.account}</span>
  },
  {
    label: '昵称',
    field: 'nickName',
    hideAsterisk: true,
    render: () => (
      <a-input v-model={state.form.nickName} maxLength={16} placeholder="最多可输入16个字" />
    )
  },
  {
    label: '性别',
    field: 'gender',
    hideAsterisk: true,
    render: () => (
      <a-radio-group v-model={state.form.gender}>
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
    hideAsterisk: true,
    render: () => (
      <a-space>
        <a-select v-model={state.form.province} style={{ width: '140px' }}>
          {areaStore.province.map((item) => {
            return (
              <a-option value={item.pid} key={item.pid}>
                {item.name}
              </a-option>
            )
          })}
        </a-select>
        <a-select v-model={state.form.city} style={{ width: '140px' }}>
          {areaStore.city.map((item) => {
            return (
              <a-option value={item.cid} key={item.cid}>
                {item.name}
              </a-option>
            )
          })}
        </a-select>
      </a-space>
    )
  },
  {
    label: '签名',
    field: 'signature',
    hideAsterisk: true,
    render: () => (
      <a-textarea v-model={state.form.signature} maxLength={30} placeholder="最多可输入30个字" />
    )
  },
  {
    noStyle: true,
    render: () => (
      <div class={styles['flex-end']}>
        <a-space>
          <a-button onClick={toggleModalVisible}>取消</a-button>
          <a-button loading={loading.value} type="primary" html-type="submit">
            保存
          </a-button>
        </a-space>
      </div>
    )
  }
]

const handleSubmit = (values: IUserInfo) => {
  const payload = omit(values, ['account', 'isFirstLogin']) as Omit<
    IUserInfo,
    'account' | 'isFirstLogin'
  >
  loading.value = true
  user
    .updateUserInfo(payload)
    .then((res) => {
      if (res.code === 0) {
        Message.success('修改成功')
        toggleModalVisible()
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <BaseModal v-model:visible="modalVisible" width="400px">
    <BaseForm
      :rules="rules"
      :model="state.form"
      :form-item-config="formItemConfig"
      @submit-success="handleSubmit"
    />
  </BaseModal>
</template>
