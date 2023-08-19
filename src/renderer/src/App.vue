<script setup lang="ts">
const handleClick = () => {
  window.electron.ipcRenderer.send('mainTest', {
    b: 2
  })
}

const handleClick2 = () => {
  window.jsBridge.dialog.showOpenDialogSync()
}
</script>

<template>
  <div>123</div>
  <button @click="handleClick">渲染进程->主进程</button>
  <button @click="handleClick2">渲染进程->主进程->渲染进程</button>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
