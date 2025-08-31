<script setup lang="ts">
import { getGroupAvatar } from '../utils/member'
import Dropdown from './atomic/Dropdown.vue'

withDefaults(defineProps<{ limit?: number }>(), {
	limit: 1,
})

const commGroup = [
	{ name: '2025 迎新交流群', id: '1056690528', code: 'https://qm.qq.com/q/VgW8oMhuCq' },
	{ name: '2024 迎新交流群', id: '669398734', code: 'https://qm.qq.com/q/m32sThRzI4' },
	{ name: '2023 迎新交流群', id: '854990503', code: 'https://qm.qq.com/q/MSgoCDRfmC' },
	{ name: '2022 迎新交流群', id: '809854994', code: 'https://qm.qq.com/cgi-bin/qm/qr?k=2a4KSyQRFSDgKENSTUKx4BOy3xOrQCfa' },
]
</script>

<template>
<span>
	<Dropdown v-for="group in commGroup.slice(0, limit)" :key="group.id" class="comm-group vp-doc" placement="right">
		<img :src="getGroupAvatar(group.id)" alt="" class="group-avatar">
		<div>
			{{ group.name }}
		</div>

		<Tip class="desc" copy>
			{{ group.id }}
		</Tip>

		<Icon icon="ri:arrow-right-s-line" class="arrow" />

		<template #content>
			<QRCode :src="commGroup[0].code" text="QQ 扫码加入" />
		</template>
	</Dropdown>
</span>
</template>

<style scoped>
.comm-group {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.2em 0.5em;
	position: relative;
	width: fit-content;
	margin: 1em 0 0;
	padding: 0.5em 1.6em 0.5em 0.8em;
	border-radius: 0.5rem;
	background: var(--vp-c-default-soft);
}

.group-avatar {
	height: 1.5em;
	border-radius: 10em;
}

.desc {
	font-size: 0.8em;
	line-height: 1.4;
	color: var(--vp-c-text-2);
}

:deep(.image) {
	margin: 0.5em;
	border-radius: 0.5em;
}

.arrow {
	position: absolute;
	right: 0.2em;
}
</style>
