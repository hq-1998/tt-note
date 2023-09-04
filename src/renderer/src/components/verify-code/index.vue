<script setup lang="ts">
import { ref, computed } from 'vue'

const emits = defineEmits(['send-code', 'trigger-validate'])

const btnText = ref('获取验证码')
const counter = ref(60)
const isClicked = ref(false)

const handleSendCode = () => {
  emits('trigger-validate', (valid) => {
    console.log(valid, '+++')
    if (isClicked.value || !valid) return
    isClicked.value = true
    emits('send-code')
    const timer = setInterval(() => {
      if (counter.value > 0) {
        counter.value--
        btnText.value = `${counter.value}秒后重试`
      } else {
        clearInterval(timer)
        isClicked.value = false
        btnText.value = '获取验证码'
      }
    }, 1000)
  })
}

/** 默认值大于0 不能作为禁用的依据 还需要判断是否点击 */
const disabled = computed(() => counter.value > 0 && isClicked.value)
</script>

<template>
  <a-button :class="['send-code-btn', disabled && 'disabled']" @click="handleSendCode">
    {{ btnText }}
  </a-button>
</template>

<style lang="less" scoped>
.send-code-btn {
  color: #1e80ff;
  font-weight: 500;
  cursor: pointer;
  padding: 0px;

  &:hover {
    background: none;
  }
}

.disabled {
  color: #9aa0aa !important;
  background: #f0f1f3 !important;
}
</style>
