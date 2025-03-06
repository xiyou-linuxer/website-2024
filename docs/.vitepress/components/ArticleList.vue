<script setup lang="ts">
import type { Article } from '../utils/article'
import type { Member } from '../utils/member'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import members from '../data/members.json'
import { useArticleStore } from '../stores/article'
import { queryBuild } from '../utils/link'
import { getMembers, grades } from '../utils/member'
import ArticleItem from './ArticleItem.vue'
import ArticlePreference from './ArticlePreference.vue'

const { preference, size } = storeToRefs(useArticleStore())
const { api } = useArticleStore()

const loading = ref(false)
// 根据 API 返回的数据格式定义
const initPageStatus = {
    page: 0,
    totalPages: 1, // 保证触发 loadMore()
    total: 0,
    limit: 24,
}
const pageStatus = ref({ ...initPageStatus })
const articleList = ref<Article[]>([])

const search = ref('')
const activeGrade = ref('')
const activeMember = ref<Member>()
const activeMembers = computed(() => (search.value
    ? getMembers(search.value)
    : members.filter(member => member.grade === activeGrade.value || !activeGrade.value)
).filter(member => member.feed))

// activeGrade 值已更新，不应在 setFilter() 中重复赋值
watch(activeGrade, (grade, oldGrade) => grade !== oldGrade && setFilter())

function setFilter(options: { member?: Member } = {}) {
    const { member } = options
    pageStatus.value = { ...initPageStatus }
    articleList.value = []

    search.value = ''
    // 应该额外防止 activeGrade 重复赋值
    activeMember.value = member

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function loadMore() {
    if (loading.value)
        return
    loading.value = true

    const url = queryBuild(api('/articles'), {
        limit: pageStatus.value.limit,
        page: pageStatus.value.page + 1,
        feed: activeMember.value ? activeMember.value.feed || 'null' : undefined,
        tag: activeMember.value ? undefined : activeGrade.value,
    })

    const resp = await fetch(url)
    const { articles, pagination } = await resp.json()

    loading.value = false
    pageStatus.value = pagination
    articleList.value.push(...articles)
}

const loadTrigger = useTemplateRef<Element[]>('load-trigger')
let observer: IntersectionObserver

onMounted(() => {
    loadMore()
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
    <h1>{{ activeMember?.name || activeGrade || "群博" }} - 文章列表</h1>
    <p class="vp-doc stats">
        <span>共 {{ pageStatus.total }} 篇文章</span>
        <a :href="api('/opml')" target="_blank">OPML</a>
        <a :href="api('/rss')" target="_blank">RSS</a>
        <a href="https://github.com/xiyou-linuxer/blog-feed" target="_blank">API 源码</a>
    </p>

    <div class="control sticky-header">
        <select v-model="activeGrade" class="grade-select" aria-label="年级选择">
            <option value="">
                全部年级
            </option>
            <option v-for="{ grade } in grades" :key="grade" :value="grade">
                {{ grade }} 级
            </option>
        </select>

        <Dropdown trigger="focusin">
            <input
                v-model="search"
                class="search"
                type="search"
                placeholder="搜索成员"
            >
            <template v-if="activeMembers" #content="{ hide }">
                <button
                    v-for="member in activeMembers"
                    :key="member.feed"
                    @click="hide(), setFilter({ member })"
                >
                    {{ member.name }}
                </button>
            </template>
        </Dropdown>

        <Icon icon="ri:filter-off-line" class="cursor-pointer" title="重置筛选" @click="setFilter()" />

        <Dropdown>
            <Icon icon="ri:list-settings-fill" class="cursor-pointer" title="偏好设置" />
            <template #content>
                <ArticlePreference />
            </template>
        </Dropdown>
    </div>

    <section class="article-list" :class="{ narrow: !preference.wide }" :style="{ '--size': size }">
        <ArticleItem v-for="item in articleList" :key="item._id" v-bind="item" />
        <div
            v-for="i in pageStatus.limit"
            v-show="pageStatus.page < pageStatus.totalPages"
            ref="load-trigger"
            :key="i"
            class="loading-item"
        />
    </section>
</template>

<style scoped>
h1, .stats {
    margin: 2em 0 1rem;
    font: revert;
    line-height: normal;
    text-align: center;
}

.stats > *:not(:first-child) {
    margin-left: 1rem;
}

.control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.article-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--size, 20rem), 1fr));
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
</style>
