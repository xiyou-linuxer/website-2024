<script setup lang="ts">
import type { Article } from '../utils/atricle'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useArticleStore } from '../stores/article'
import ArticleItem from './ArticleItem.vue'
import ArticlePreference from './ArticlePreference.vue'

const { preference, size } = storeToRefs(useArticleStore())

const loading = ref(false)
// 根据 API 返回的数据格式定义
const pageStatus = ref({
    page: 0,
    totalPages: 0,
    total: 0,
    size: 24,
})
const articleList = ref<Article[]>([])

async function loadMore() {
    if (loading.value)
        return
    loading.value = true

    const { size, page } = pageStatus.value
    const resp = await fetch(`https://blog.xiyoulinux.com/api/articles?size=${size}&page=${page + 1}`)

    const { articles, pagination } = await resp.json()

    loading.value = false
    pageStatus.value = pagination
    articleList.value.push(...articles)
}

const loadTrigger = useTemplateRef<Element[]>('load-trigger')
let observer: IntersectionObserver

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => entry.isIntersecting && loadMore())
    })
    loadTrigger.value?.forEach(item => observer.observe(item))
})

onUnmounted(() => {
    observer?.disconnect()
})
</script>

<template>
    <h1>文章列表（测试中）</h1>
    <p class="stats">
        共 {{ pageStatus.total }} 篇文章
        <Dropdown>
            <Icon icon="ri:list-settings-fill" />
            <template #content>
                <ArticlePreference />
            </template>
        </Dropdown>
    </p>

    <TransitionGroup tag="section" class="article-list" :class="{ narrow: !preference.wide }">
        <ArticleItem v-for="item in articleList" :key="item._id" v-bind="item" />
        <template v-if="pageStatus.page <= pageStatus.totalPages">
            <div v-for="i in pageStatus.size" ref="load-trigger" :key="i" class="loading-item" />
        </template>
    </TransitionGroup>
</template>

<style scoped>
h1, .stats {
    margin: 2em 0 2rem;
    font: revert;
    line-height: normal;
    text-align: center;
}

.article-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(v-bind(size), 1fr));
    gap: 1rem;
    padding: 0 5% 2rem;
}

.article-list.narrow {
    max-width: 83rem;
    margin: 0 auto;
}

.loading-item {
    min-height: 10rem;
    border-radius: 0.5rem;
    background-color: var(--vp-c-bg-soft);
    animation: fade-in 1s both;
    animation-timeline: view();
}

@keyframes fade-in {
    0% { opacity: 0; }
    50% { opacity: 1; }
}

.loading-item.v-enter-from {
    opacity: 0;
}

.loading-item.v-leave-active {
    display: none;
}
</style>
