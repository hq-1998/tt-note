<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import defaultAvatar from '@renderer/assets/images/common/default-avatar.png'
import BaseUpload from '@renderer/components/base-upload/index.vue'

defineOptions({
  name: 'UploadAvatar'
})

const modelValue = defineModel('modelValue')

const handleSuccess = (data: string) => {
  if (data) {
    modelValue.value = data
    Message.success('上传成功')
  }
}
</script>

<template>
  <BaseUpload @success="handleSuccess">
    <template #uploadButton>
      <a-space align="center">
        <a-image
          width="55"
          height="55"
          class="avatar"
          :src="modelValue || defaultAvatar"
          @click.stop
        />
        <div class="upload-wrapper">
          <div class="upload-new-avatar">上传新头像</div>
          <div class="upload-support">支持JPG、PNG、GIF格式，小于2MB</div>
        </div>
      </a-space>
    </template>
  </BaseUpload>
</template>

<style lang="less" scoped>
.avatar {
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
