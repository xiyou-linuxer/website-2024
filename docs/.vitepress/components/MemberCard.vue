<script setup lang="ts">
import type { Member } from '@/utils/member'
import { getAvatar } from '@/utils/member'

defineProps<Member>()
</script>

<template>
<div class="card">
	<img class="avatar" :src="getAvatar($props)">
	<span class="name">{{ name }}</span>
	<span class="title">{{ title }}</span>
	<a v-if="github" :href="`https://github.com/${github}`" target="_blank">
		<i class="fa-brands fa-github" />{{ github }}
	</a>
	<a v-if="link && linkText" :href="link" target="_blank">
		<i class="fa-solid fa-link" />{{ linkText }}
	</a>
</div>
</template>

<style scoped>
.card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px;
	border-radius: 12px;
	background-color: var(--vp-c-bg-soft);
	line-height: 1.2em;
	filter: hue-rotate(var(--hue));
}

@supports (color: color-mix(in srgb, transparent, transparent)) {
	.card {
		background-color: color-mix(in srgb, transparent, var(--vp-c-brand-soft) 40%);
	}
}

.card > .avatar {
	width: 3rem;
	height: 3rem;
	margin: 0.5rem 0;
	border-radius: 4rem;
	box-shadow: 2px 4px 1rem var(--vp-c-divider);
	filter: hue-rotate(calc(var(--hue) * -1));
}

.card > .name {
	font-weight: 600;
}

.card > .title {
	flex-grow: 1;
	margin-bottom: 0.5em;
	font-size: 0.8em;
	color: var(--vp-c-text-3);
}

.card.card a {
	overflow: hidden;
	max-width: 100%;
	background: unset;
	font-size: 0.8em;
	text-overflow: ellipsis;
	text-wrap: nowrap;
}

.card.card a[target]::after {
	content: unset;
}
</style>
