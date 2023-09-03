<script setup lang="tsx">
import { Form, FormItem } from '@arco-design/web-vue'
import { VNode, ref } from 'vue'
import { omit } from 'lodash-es'

type ICustomFormItemConfig = {
  render: (dataSource: typeof props.formConfig.model) => VNode
}

export type IMergeFormItemConfig = ICustomFormItemConfig & InstanceType<typeof FormItem>['$props']

const props = withDefaults(
  defineProps<{
    formItemConfig: IMergeFormItemConfig[]
    formConfig: InstanceType<typeof Form>['$props']
  }>(),
  {
    formItemConfig: () => [],
    formConfig: () => ({
      model: {}
    })
  }
)

const handleSubmit = (values) => {
  return Promise.resolve(values)
}

const formRef = ref<InstanceType<typeof Form>>()

defineExpose({
  formRef,
  handleSubmit
})
</script>

<template>
  <a-form
    ref="formRef"
    :model="formConfig.model"
    :rules="formConfig.rules"
    @submit-success="handleSubmit"
  >
    <a-form-item
      v-for="item in formItemConfig"
      :key="item.field"
      v-bind="omit(item, 'render')"
      :label="item.label"
    >
      <component :is="item.render(formConfig.model)" />
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped></style>
