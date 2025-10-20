<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { apiMap, authorMap, avatarMap, sizeMap, useArticleStore } from '@/stores/article'

const { preference } = storeToRefs(useArticleStore())
</script>

<template>
<form>
	<label for="author">来源展示</label>
	<select id="author" v-model="preference.author">
		<option v-for="(author, key) in authorMap" :key :value="key">
			{{ author.label }}
		</option>
	</select>

	<label for="avatar">头像展示</label>
	<select id="avatar" v-model="preference.avatar">
		<option v-for="(avatar, key) in avatarMap" :key :value="key">
			{{ avatar.label }}
		</option>
	</select>

	<label for="size">卡片尺寸</label>
	<select id="size" v-model="preference.size">
		<option v-for="(size, key) in sizeMap" :key :value="key">
			{{ size.label }}
		</option>
	</select>

	<label for="wide">宽屏</label>
	<input id="wide" v-model="preference.wide" type="checkbox">

	<label for="api">API</label>
	<select id="api" v-model="preference.api">
		<option v-for="(api, key) in apiMap" :key :value="key">
			{{ api.label }}
		</option>
	</select>
</form>
</template>

<style scoped>
form {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.5rem 1rem;
	padding: 0.5rem;
	text-align: left;
}
</style>
