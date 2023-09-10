<script setup lang="tsx">
import { FieldRule, Form, FormItem } from '@arco-design/web-vue'
import { VNode, ref } from 'vue'
import { omit } from 'lodash-es'

type ICustomFormItemConfig = {
  render: (dataSource: typeof props.model) => VNode
}

export type IMergeFormItemConfig = ICustomFormItemConfig & InstanceType<typeof FormItem>['$props']

const emits = defineEmits(['submit-success'])

const props = withDefaults(
  defineProps<{
    formItemConfig: IMergeFormItemConfig[]
    formConfig: Omit<InstanceType<typeof Form>['$props'], 'rules' | 'model'>
    rules: Record<string, FieldRule<any> | FieldRule<any>[]>
    model: Record<string, any>
  }>(),
  {
    formItemConfig: () => [],
    formConfig: () => ({}),
    rules: () => ({})
  }
)

const handleSubmit = (values) => {
  emits('submit-success', values)
}

const formRef = ref<InstanceType<typeof Form>>()

defineExpose({
  formRef
})
</script>

<template>
  <a-form ref="formRef" :model="model" :rules="rules" @submit-success="handleSubmit">
    <a-form-item
      v-for="item in formItemConfig"
      :key="item.field"
      v-bind="omit(item, 'render')"
      :label="item.label"
    >
      <component :is="item.render(model)" />
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped></style>
