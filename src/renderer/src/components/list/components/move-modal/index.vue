<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'
import markdown from '@renderer/assets/images/svg/markdown.svg'
import { IBaseNote } from '@renderer/store/note'

const emits = defineEmits(['update:modalVisible'])
const props = withDefaults(
  defineProps<{
    modalVisible: boolean
    data: IBaseNote | null
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
@import './style.less';
</style>
