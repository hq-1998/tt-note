<script lang="tsx" setup>
import { ref } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'
import updaterBackground from '@renderer/assets/images/common/updater-background.png'

defineOptions({
  name: 'UploadModal'
})

const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false
  }
})

const visible = ref(props.modalVisible)
const toggleModalVisible = () => {
  visible.value = !visible.value
}

defineExpose({
  toggleModalVisible
})

const updateContents = [
  '增加版本提醒功能',
  '更好地支持苹果/Android手机操作系统',
  '修复已知问题',
  '优化用户体验'
]
</script>

<template>
  <BaseModal
    v-model:visible="visible"
    hide-title
    simple
    :modal-style="{
      padding: '0px',
      background: 'transparent'
    }"
    :mask-closable="false"
    align-center
    width="320px"
  >
    <div class="update-background-wrapper">
      <div class="update-title">
        <span class="find-version">发现新版本</span>
        <span class="new-version">v1.0.1</span>
      </div>
      <img class="update-background-img" :src="updaterBackground" />
      <div class="update-content">
        <div class="update-content-title">更新内容</div>
        <div class="update-content-block">
          <div v-for="(item, index) in updateContents" :key="item" class="update-content-text">
            <span class="update-content-index">{{ index + 1 }}. </span>{{ item }}
          </div>
        </div>

        <div class="update-grade">
          <a-button class="after" @click="toggleModalVisible">以后再说</a-button>
          <a-button class="soon">立即升级</a-button>

          <!-- <div class="progress">
            <a-progress
              :show-text="false"
              color="#1f95fb"
              :percent="0.3"
              :style="{ width: '100%' }"
            >
            </a-progress>
            <span class="progress-loading">正在下载，请稍后(14.11/35.58M)</span>
          </div>  -->
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style lang="less" scoped>
.update-background-wrapper {
  background: transparent;
  min-height: 324px;
  .update-title {
    position: absolute;
    top: 50px;
    left: 20px;
    color: #ffffff;
    display: flex;
    flex-direction: column;

    .find-version {
      font-size: 24px;
    }
    .new-version {
      font-size: 13px;
    }
  }
  .update-background-img {
    width: 100%;
  }
  .update-content {
    background: #fff;
    position: absolute;
    top: 120px;
    left: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .update-success {
      width: 120px;
      height: 120px;
    }

    .update-success-text {
      color: lightgreen;
      font-size: 13px;
    }

    .update-content-title {
      color: #4e92df;
      font-size: 18px;
      font-weight: bold;
    }

    .update-content-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 70px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 0px;
      }

      .update-content-text {
        color: #5b6169;
        font-size: 13px;
      }

      .update-content-index {
        color: #2e3135;
      }
    }

    .update-grade {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      .after {
        flex: 1;
        color: #5b6169;
        border-radius: 5px;
      }
      .soon {
        flex: 1;
        color: #ffffff;
        background: linear-gradient(to right, #1785ff, #3da7ff);
        border-radius: 5px;
      }

      .progress {
        width: 100%;
        flex: 1;

        .progress-loading {
          color: #999999;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
