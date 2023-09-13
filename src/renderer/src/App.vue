<script setup lang="ts">
import { useRoute } from 'vue-router'
import Layout from '@renderer/layout/index.vue'

const route = useRoute()
console.log(route)
</script>

<template>
  <Layout />
</template>
