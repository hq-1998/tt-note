<script setup lang="ts">
import { computed, ref } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import { useUserStore, useAreaStore } from '../store'
import { onBeforeMount } from 'vue'
import { globalStorage } from '../utils'
import { globalWebSocket } from '@renderer/websocket'
import { user, area } from '../api'
import { IUserInfo } from '../api/user/data'
import { IProvince } from '../api/area/data'

const areaStore = useAreaStore()
const userStore = useUserStore()

const collapse = ref(true)

onBeforeMount(() => {
  const token = globalStorage.get('token')
  const userInfo = globalStorage.get('userInfo')
  if (token && userInfo) {
    userStore.setToken(token)
    globalWebSocket.connect(userInfo.id)
    const promises = [user.getUserInfo(userInfo.id), area.getProvince()]
    Promise.all(promises).then((res) => {
      const [userInfo, province] = res
      if (userInfo.code === 0) {
        userStore.setUserInfo(userInfo.data as IUserInfo)
      }
      if (province.code === 0) {
        areaStore.setProvince(province.data as IProvince[])
      }
    })
  }
})

const handleCollapse = (e) => (collapse.value = e)

const width = computed(() => (collapse.value ? 48 : 200))
</script>

<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider breakpoint="lg" :width="width">
        <Sider @handle-collapse="handleCollapse"> </Sider>
      </a-layout-sider>
      <RouterView />
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
