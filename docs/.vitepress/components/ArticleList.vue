<script setup lang="ts">
import type { Article } from '@/utils/article'
import type { Member } from '@/utils/member'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouteQuery } from '@/composables/useRouteQuery'
import members from '@/data/members.json'
import { useArticleStore } from '@/stores/article'
import { getMainDomain, queryBuild } from '@/utils/link'
import { getMemberByFeed, grades, searchMembers } from '@/utils/member'
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
const activeGrade = useRouteQuery('grade', '')
const activeFeed = useRouteQuery('feed', '')
const searchedMembers = computed(() => (search.value
	? searchMembers(search.value)
	: members.filter(member => member.grade === activeGrade.value || !activeGrade.value)
).filter(member => member.feed))

function setFilter(options: { member?: Member, grade?: string }) {
	const { member, grade } = options
	pageStatus.value = { ...initPageStatus }
	articleList.value = []

	search.value = ''
	activeGrade.value = grade || member?.grade || ''
	activeFeed.value = member?.feed ?? ''
	loadMore() // 保证快速切换时加载
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function loadMore() {
	if (loading.value)
		return
	loading.value = true

	const url = queryBuild(api('/articles'), {
		limit: pageStatus.value.limit,
		page: pageStatus.value.page + 1,
		feed: activeFeed.value,
		tag: activeFeed.value ? undefined : activeGrade.value,
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
<h1>{{ getMemberByFeed(activeFeed)?.name || (activeGrade && `${activeGrade}级`) || "群博" }} - 文章列表</h1>
<p class="vp-doc stats">
	<span v-if="activeFeed">来自<a :href="getMemberByFeed(activeFeed)?.link" target="_blank">{{ getMainDomain(activeFeed) }}</a></span>
	<span>共 {{ pageStatus.total }} 篇文章</span>
	<a :href="api('/opml')" target="_blank">OPML</a>
	<a :href="api('/rss')" target="_blank">RSS</a>
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
		<template v-if="searchedMembers" #content="{ hide }">
			<button
				v-if="activeFeed && !search"
				@click="hide(), setFilter({ grade: activeGrade })"
			>
				{{ activeGrade }} 级全部
			</button>
			<button
				v-for="member in searchedMembers"
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
		@click="setFilter(activeFeed ? { grade: activeGrade } : {})"
	>
		<Icon icon="ri:filter-off-line" width="20" />
	</button>

	<Dropdown tag="button" title="偏好设置">
		<Icon icon="ri:list-settings-fill" width="20" />
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
h1 {
	margin: 2em 0 2rem;
	font: revert;
	line-height: 1.4;
	text-align: center;
}

.stats {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5em 1em;
	margin: 1em 0;
}

.control {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
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

@keyframes fade-in {
	0% { opacity: 0; }
	50% { opacity: 1; }
}
</style>
