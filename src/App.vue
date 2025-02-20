<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MarkdownContent from '../md/src.md'
import mermaid from 'mermaid'
onMounted(async () => {
  mermaid.initialize({ startOnLoad: false, fontFamily: 'Fira Code', theme: 'default' })
  mermaid.run()
})
</script>

<template>
  <MarkdownContent />
</template>

<style scoped></style>
