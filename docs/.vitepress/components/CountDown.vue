<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
	event?: string
	targetTime: string
	endMessage?: string
}>()

const timeLeft = ref({
	total: 0,
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
})

const targetDate = new Date(props.targetTime)

function calculateTimeLeft() {
	const now = new Date()
	const remainingTime = targetDate.getTime() - now.getTime()

	if (remainingTime <= 0) {
		resetTimeLeft()
		return
	}

	timeLeft.value = {
		total: remainingTime,
		days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
		hours: Math.floor((remainingTime / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((remainingTime / (1000 * 60)) % 60),
		seconds: Math.floor((remainingTime / 1000) % 60),
	}
}

function resetTimeLeft() {
	timeLeft.value = {
		total: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	}
}

onMounted(() => {
	calculateTimeLeft()
	setInterval(calculateTimeLeft, 1000)
})
</script>

<template>
<div v-if="timeLeft.total > 0">
	<p>
		距离 {{ event || '事件' }} 还有
	</p>
	<p>
		<span class="time">{{ timeLeft.days }}</span>天
		<span class="time">{{ timeLeft.hours }}</span>小时
		<span class="time">{{ timeLeft.minutes }}</span>分
		<span class="time">{{ timeLeft.seconds }}</span>秒
	</p>
</div>
<p v-else>
	{{ endMessage || '时间到！' }}
</p>
</template>

<style scoped>
p {
	font-size: 1.2em;
}

.time {
	font-family: Consolas, monospace;
	font-size: 2em;
}

@media (width <= 768px) {
	p {
		font-size: 1rem;
	}
}
</style>
