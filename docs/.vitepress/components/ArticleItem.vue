<script setup lang="ts">
import type { Article } from '../utils/article'
import { computed } from 'vue'
import { useArticleStore } from '../stores/article'
import { getMemberByFeed } from '../utils/member'
import AutoCode from './AutoCode.vue'

const props = defineProps<Article>()

const article = useArticleStore()
const dateLabel = new Date(props.date).toLocaleString('zh-CN', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

const member = getMemberByFeed(props.feed)
const author = computed(() => article.getAuthor(member) || props.author)
const avatar = computed(() => article.getAvatar(member))
</script>

<template>
<a
	class="article-item"
	:href="link"
	target="_blank"
>
	<div class="title">{{ title }}</div>
	<AutoCode class="summary scrollcheck-y" tag="p" :text="description" />
	<div class="info-line">
		<img v-if="avatar" :src="avatar" :alt="member.name" class="avatar">
		<span class="author">{{ author }}</span> ·
		<time class="date" :datetime="date">
			{{ dateLabel }}
		</time>
	</div>
</a>
</template>

<style scoped>
.article-item.article-item {
	display: grid;
	grid-template-rows: auto 1fr auto;
	gap: 0.5rem;
	position: relative;
	overflow: hidden;
	max-height: 12rem;
	padding: 1rem;
	border-radius: 0.5rem;
	outline: 1px solid transparent;
	background: var(--vp-c-bg-soft);
	line-height: normal;
	color: var(--vp-c-text-1);
	z-index: 0;
}

.article-item:hover {
	outline-color: var(--vp-c-brand-1);
	background: none;
	color: var(--vp-c-brand-1);
}

.article-item.article-item.article-item.article-item::after {
	content: unset;
}

p.summary {
	--guessed-scrollbar-width: 0px;

	overflow: auto;
	opacity: 0.8;
	margin: 0;
	font-size: 0.8rem;
	line-height: 1.5;
	scrollbar-width: none;
}

.info-line {
	font-size: 0.8rem;
	color: var(--vp-c-text-2);
}

.avatar {
	position: absolute;
	opacity: 0.2;
	right: 0.8rem;
	bottom: 0.5rem;
	height: 3rem;
	border-radius: 3rem;
	transition: opacity 0.2s;
	z-index: -1;
}

.article-item:hover .avatar {
	opacity: 0.5;
}
</style>
