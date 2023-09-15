<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Item } from '../index'
import BaseModal from '@renderer/components/base-modal/index.vue'
import markdown from '@renderer/assets/images/icons/document.png'

const emits = defineEmits(['update:modalVisible'])
const props = withDefaults(
  defineProps<{
    modalVisible: boolean
    data: Item | null
  }>(),
  {
    modalVisible: false,
    data: null
  }
)

const modalVisible = ref(props.modalVisible)

watch(
  () => props.modalVisible,
  (val) => {
    modalVisible.value = val
  }
)

const treeData = [
  {
    title: 'Trunk 0-0',
    key: '0-0',
    children: [
      {
        title: 'Branch 0-0-0',
        key: '0-0-0',
        children: [
          {
            title: 'Leaf',
            key: '0-0-0-0'
          },
          {
            title: 'Leaf',
            key: '0-0-0-1'
          }
        ]
      },
      {
        title: 'Branch 0-0-1',
        key: '0-0-1',
        children: [
          {
            title: 'Leaf',
            key: '0-0-1-0'
          }
        ]
      }
    ]
  }
]

const handleClose = () => {
  emits('update:modalVisible', false)
}

const handleConfirm = () => {}

defineOptions({
  name: 'MoveModal'
})
</script>

<template>
  <BaseModal
    v-model:visible="modalVisible"
    title="移动到"
    width="460px"
    class="modal"
    @handle-close="handleClose"
  >
    <div class="title">
      <img :src="markdown" />
      123213(1)
    </div>
    <div class="move-wrapper">
      <span class="move-label">移动到：</span>
      <div class="move-position">我的文件夹/</div>
    </div>
    <div class="tree-wrapper">
      <a-tree block-node :default-expand-all="false" :data="treeData" />
    </div>
    <footer class="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确认</a-button>
    </footer>
  </BaseModal>
</template>

<style lang="less" scoped>
.modal {
  .title {
    color: #4e5a70;
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .move-wrapper {
    margin: 16px 0;
    display: flex;
    align-items: center;

    .move-label {
      color: #7a8599;
    }

    .move-position {
      display: inline-block;
      flex: 1;
      vertical-align: top;
      color: #4e5a70;
      color: #4e5a70;
      cursor: default;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-radius: 4px;
      background-color: #f4f6f7;
      height: 32px;
      line-height: 32px;
      padding: 0 16px;
    }
  }

  .tree-wrapper {
    margin: 12px 0 20px;
    padding-right: 4px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #eceff4;
    padding: 3px 12px;
    height: 220px;
    overflow: auto;

    :deep(.arco-tree-node-title-text) {
      color: #4e5a70;
    }

    :deep(.arco-tree-node-switcher-icon) {
      color: #4e5a70;
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
