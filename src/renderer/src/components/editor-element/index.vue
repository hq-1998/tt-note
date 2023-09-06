<template>
  <div
    ref="divRef"
    class="div-editable"
    contenteditable="true"
    @input="changeText"
    @focus="handleFocus"
    @blur="blurFunc"
    v-html="innerText"
  ></div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const props = withDefaults(
  defineProps<{
    value: string
  }>(),
  {
    value: ''
  }
)

defineOptions({
  name: 'DivEditable'
})

<<<<<<< HEAD
const value = defineModel('value')
const innerText = ref(value.value)
=======
const innerText = ref(props.value)
>>>>>>> parent of 74b6388 (feat: 新语言尝试 组件v-model改为defineModel宏)
const isChange = ref(true)
const divRef = ref<HTMLDivElement>()

const handleFocus = () => {
  isChange.value = false
}

watch(
  () => props.value,
  () => {
    if (isChange.value) {
      innerText.value = props.value
    }
  }
)

<<<<<<< HEAD
const emit = defineEmits(['blurFunc'])
=======
const emit = defineEmits(['update:value', 'blurFunc'])
>>>>>>> parent of 74b6388 (feat: 新语言尝试 组件v-model改为defineModel宏)

const changeText = () => {
  emit('update:value', divRef.value!.innerHTML)
}
const blurFunc = () => {
  isChange.value = true
  emit('blurFunc')
}
</script>

<style lang="less" scoped>
.div-editable {
  width: 100%;
  height: 100%;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  font-weight: bold;
  font-size: 32px;
  overflow: hidden;

  &[contenteditable='true'] {
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }

  &::webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
</style>
