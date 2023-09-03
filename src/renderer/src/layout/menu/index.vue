<script lang="tsx" setup>
import { ref } from 'vue'
const emits = defineEmits(['handleCollapse'])
const collapsed = ref(true)

const onCollapse = (val) => {
  collapsed.value = val
  emits('handleCollapse', val)
}

const handleSelect = () => {}

const doptionOptions = [
  {
    label: '消息通知',
    value: 'notify',
    icon: <icon-notification />
  },
  {
    label: '个人信息',
    value: 'message',
    icon: <icon-user />
  },
  {
    label: '退出登录',
    value: 'exit',
    icon: <icon-export />
  }
]
</script>

<template>
  <div class="menu-wrapper">
    <div class="top-wrapper">
      <div class="avatar-wrapper">
        <a-dropdown show-arrow :popup-translate="[35, 5]" @select="handleSelect">
          <a-avatar :size="collapsed ? 32 : 64"> <icon-gitlab /></a-avatar>
          <template #content>
            <a-doption v-for="item in doptionOptions" :key="item.value">
              {{ item.label }}
              <template #icon> <component :is="item.icon" /> </template
            ></a-doption>
          </template>
        </a-dropdown>
      </div>
      <div class="menu-list-wrapper">
        <a-menu
          v-model:collapsed="collapsed"
          show-collapse-button
          :style="{ width: '200px', height: '100%' }"
          :default-open-keys="['0']"
          @collapse="onCollapse"
        >
          <a-menu-item key="0">
            <template #icon><icon-apps></icon-apps> </template>
            最新
          </a-menu-item>
          <a-sub-menu key="1">
            <template #icon><icon-file /></template>
            <template #title>我的文件夹</template>
            <a-menu-item key="1_0">文件夹-1</a-menu-item>
            <a-menu-item key="1_1">文件夹-2</a-menu-item>
            <a-menu-item key="1_2">文件夹-3</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="2">
            <template #icon><icon-delete></icon-delete></template>
            回收站
          </a-menu-item>
        </a-menu>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.menu-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px 3px 0px 3px;
  box-sizing: border-box;
  height: 100%;

  .top-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    .avatar-wrapper {
      margin-bottom: 30px;
    }
    .menu-list-wrapper {
      flex: 1;
    }
    .button-wrapper {
      margin-bottom: 5px;
    }
  }
}
</style>
