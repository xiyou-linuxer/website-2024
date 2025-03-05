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

const { api } = storeToRefs(useArticleStore())

const activeGrade = ref('')
watch(activeGrade, () => {
    articleList.value = []
    pageStatus.value = { ...initPageStatus }
})

const search = ref('')
const searchInput = useTemplateRef('search-input')
const activeMembers = computed(() =>
    search.value
        ? getMembers(search.value)
        : members.filter(member => member.grade === activeGrade.value),
)
const activeMember = ref<Member>()
watch(activeMember, () => {
    articleList.value = []
    pageStatus.value = { ...initPageStatus }
    // 触发 <Dropdown> 的 untrigger 态
    searchInput.value?.focus()
    searchInput.value?.blur()
})

function clearFilter() {
    search.value = ''
    activeGrade.value = ''
    activeMember.value = undefined
}

async function loadMore() {
    if (loading.value)
        return
    loading.value = true

    const url = queryBuild(api.value, {
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
        <a href="https://api.xiyoulinux.com/opml" target="_blank">OPML下载</a>
        <a href="https://github.com/xiyou-linuxer/blog-feed" target="_blank">源代码</a>
    </p>

    <div class="control sticky-header">
        <select v-model="activeGrade" class="grade-select">
            <option value="">
                全部年级
            </option>
            <option v-for="{ grade } in grades" :key="grade" :value="grade">
                {{ grade }} 级
            </option>
        </select>

        <Dropdown trigger="focusin">
            <input
                ref="search-input"
                v-model="search"
                class="search"
                type="search"
                placeholder="搜索成员"
            >
            <template #content="{ hide }">
                <button v-for="member in activeMembers" :key="member.feed" @click="(activeMember = member) && hide() ">
                    {{ member.name }}
                </button>
            </template>
        </Dropdown>

        <Icon icon="ri:filter-off-line" class="cursor-pointer" @click="clearFilter()" />

        <Dropdown>
            <Icon icon="ri:list-settings-fill" class="cursor-pointer" />
            <template #content>
                <ArticlePreference />
            </template>
        </Dropdown>
    </div>

    <TransitionGroup tag="section" class="article-list" :class="{ narrow: !preference.wide }">
        <ArticleItem v-for="item in articleList" :key="item._id" v-bind="item" />
        <div
            v-for="i in pageStatus.limit"
            v-show="pageStatus.page < pageStatus.totalPages"
            ref="load-trigger"
            :key="i"
            class="loading-item"
        />
    </TransitionGroup>
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
