<script lang="ts" setup>
import { ref } from 'vue'
import defaultAvatar from '@renderer/assets/images/common/default-avatar.png'

const uploadRef = ref()
const files = ref([])

const submit = (e) => {
  e.stopPropagation()
  uploadRef.value.submit()
}

const onChange = (fileList) => {
  files.value = fileList
  console.log(fileList)
}
</script>

<template>
  <a-upload ref="uploadRef" action="/" :multiple="false" @change="onChange">
    <template #upload-button>
      <a-space align="center">
        <img class="avatar" :src="defaultAvatar" />
        <div class="upload-wrapper">
          <div class="upload-new-avatar">上传新头像</div>
          <div class="upload-support">支持JPG、PNG、GIF格式，小于2MB</div>
        </div>
      </a-space>
    </template>
  </a-upload>
</template>

<style lang="less" scoped>
.avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
}

.upload-wrapper {
  margin-left: 4px;
  display: inline-block;
  vertical-align: middle;

  .upload-new-avatar {
    margin-top: 6px;
    display: block;
    width: 90px;
    height: 24px;
    padding: 0;
    line-height: 24px;
    color: #4e5a70;
    color: var(#4e5a70);
    background: #ffffff;
    border-radius: 50px;
    text-align: center;
    border: 1px solid #eceff4;
  }

  .upload-support {
    font-size: 12px;
    cursor: text;
    color: #7a8599;
    margin-top: 4px;
  }
}
</style>
