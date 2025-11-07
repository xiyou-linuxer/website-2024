<script setup lang="ts">
import type { Article } from '@/utils/article'
import type { Member } from '@/utils/member'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, useTemplateRef } from 'vue'
import members from '@/data/members.json'
import { useArticleStore } from '@/stores/article'
import { queryBuild } from '@/utils/link'
import { getMembers, grades } from '@/utils/member'
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

function setFilter(options: { member?: Member, grade?: string } = {}) {
	const { member, grade } = options
	pageStatus.value = { ...initPageStatus }
	articleList.value = []

	search.value = ''
	activeGrade.value = grade || member?.grade || ''
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
// `useIntersectionObserver` | `useTemplateRef` of array type cannot be passed as argument
// @ts-expect-error https://github.com/vueuse/vueuse/issues/4712
useIntersectionObserver(loadTrigger, ([{ isIntersecting }]) => {
	if (isIntersecting)
		loadMore()
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
	<!-- @change 不会在 v-model 值改变时触发 -->
	<select
		v-model="activeGrade"
		class="bg-blur"
		aria-label="年级选择"
		@change="setFilter({ grade: activeGrade })"
	>
		<option value="">
			全部年级
		</option>
		<option v-for="{ grade } in grades" :key="grade" :value="grade">
			{{ grade }} 级
		</option>
	</select>

	<Dropdown trigger="focusin" class="search-dropdown">
		<input
			v-model="search"
			class="bg-blur"
			type="search"
			placeholder="搜索成员"
		>
		<template v-if="activeMembers" #content="{ hide }">
			<button
				v-if="activeMember && !search"
				@click="hide(), setFilter({ grade: activeGrade })"
			>
				{{ activeGrade }} 级全部
			</button>
			<button
				v-for="member in activeMembers"
				:key="member.feed"
				@click="hide(), setFilter({ member })"
			>
				{{ member.name }} <Badge type="info" :text="member.grade" />
			</button>
		</template>
	</Dropdown>

	<button
		class="bg-blur"
		title="重置筛选"
		@click="setFilter({ grade: activeGrade })"
	>
		<Icon icon="ri:filter-off-line" />
	</button>

	<Dropdown tag="button" title="偏好设置">
		<Icon icon="ri:list-settings-fill" />
		<template #content>
			<ArticlePreference />
		</template>
	</Dropdown>
</div>

<section class="article-list" :class="{ narrow: !preference.wide }" :style="{ '--size': size }">
	<ArticleItem v-for="item in articleList" :key="item._id || item.link" v-bind="item" />
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
	line-height: 1.4;
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
}

:deep(button) {
	font: inherit;
}

.search-dropdown input {
	width: 100%;
}

.article-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--size, 20rem), 1fr));
	gap: 1rem;
	margin: 2rem auto;
}

@supports (grid-template-rows: masonry) {
	.article-list {
		grid-template-rows: masonry;
	}

	.article-item.article-item {
		max-height: none;
	}
}

.article-list.narrow {
	max-width: 83rem;
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
