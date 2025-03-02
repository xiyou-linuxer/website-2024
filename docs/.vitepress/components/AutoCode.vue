<script setup lang="ts">
import type { Component } from 'vue'
import { computed, h } from 'vue'

const props = withDefaults(defineProps<{
    text: string
    tag?: string | Component
}>(), {
    tag: 'span',
})

const autoCode = computed(() => {
    if (!props.text)
        return h(props.tag)
    const parts = props.text.split(/`([^`]+)`/g)
    const children = parts.map((part, i) => i % 2
        ? h('code', part)
        : part,
    )
    return h(props.tag, children)
})
</script>

<template>
    <component :is="autoCode" />
</template>
