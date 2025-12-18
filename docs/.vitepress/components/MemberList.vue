<script setup lang="ts">
import type { Member } from '@/utils/member'
import { useDebounceFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import members from '@/data/members.json'
import { grades, searchMembers } from '@/utils/member'
import MemberCard from './MemberCard.vue'

const props = defineProps<{
	showNewestNum?: number
}>()

type Grade = Member['grade']

const activeGrade = ref<Grade[]>(
	grades.map(entry => entry.grade).slice(0, props.showNewestNum ?? 1),
)

const highlightGrade = ref<Grade>('')

const activeGradeHue = computed(() => Object.fromEntries(activeGrade.value
	.slice()
	.sort((a, b) => b.localeCompare(a))
	.map((grade, i) => [grade, `${-i * 48}deg`]),
))

const search = ref('')

const activeMembers = computed(() => search.value
	? searchMembers(search.value)
	: members.filter(member => activeGrade.value.includes(member.grade)),
)

function toggleGrade(...grades: Grade[]) {
	return grades.reduce((acc, grade) => acc.includes(grade)
		? acc.filter(g => g !== grade)
		: [...acc, grade], activeGrade.value)
}

function setActiveGrade(e: MouseEvent, ...grades: Grade[]) {
	search.value = ''
	activeGrade.value = e.ctrlKey || e.metaKey
		? toggleGrade(...grades)
		: grades
}

const setHighlightGrade = useDebounceFn((grade: Grade) => {
	highlightGrade.value = grade
}, 100)
</script>

<template>
<div class="tabs-container">
	<div class="sticky-header">
		<div class="scrollcheck-x">
			<div class="tabs">
				<button
					v-for="{ grade, length } in grades"
					:key="grade"
					:class="{
						highlight: highlightGrade === grade,
						active: activeGrade.includes(grade) && !search,
					}"
					:style="{ '--hue': activeGradeHue[grade] }"
					@click="setActiveGrade($event, grade)"
				>
					<span class="grade">{{ grade }}</span>
					<span class="badge">{{ length }}</span>
				</button>
				<button @click="setActiveGrade($event, ...grades.map(g => g.grade))">
					<span class="grade">全部</span>
					<span class="badge">{{ members.length }}</span>
				</button>
			</div>
		</div>
	</div>

	<input
		v-model="search"
		class="search"
		type="search"
		placeholder="搜索成员"
	>

	<div class="tab-content">
		<MemberCard
			v-for="member in activeMembers"
			:key="member.github || member.name"
			v-bind="member"
			:class="{ colorful: activeGrade.length > 1 && !search }"
			:style="{ '--hue': activeGradeHue[member.grade] }"
			@mouseenter="setHighlightGrade(member.grade)"
			@mouseleave="setHighlightGrade('')"
		/>
	</div>
</div>
</template>

<style scoped>
.tabs-container {
	margin: 2rem 0;
}

.sticky-header {
	margin: 0 -1rem;
}

.scrollcheck-x {
	--guessed-scrollbar-height: 0px;

	margin: -0.5rem;
	padding: 0.5rem;
}

.tabs {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
}

/* stylelint-disable-next-line media-feature-range-notation */
@media (max-width: 50rem) {
	.tabs {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: 1fr 1fr;
		width: max-content;
		margin: 0 auto;
	}
}

.tabs button {
	display: flex;
	align-items: center;
	overflow: hidden;
	border: none;
	border-radius: 4px;
	background-color: var(--vp-c-bg-soft);
	cursor: pointer;
}

.tabs button > .grade {
	padding: 0 4px;
}

.tabs button > .badge {
	flex-grow: 1;
	padding: 0 2px;
	background-color: var(--vp-c-default-soft);
	vertical-align: middle;
}

.tabs button.highlight {
	/* stylelint-disable-next-line declaration-no-important */
	outline: 0.5em solid var(--vp-c-brand) !important;
}

.tabs button.active {
	background-color: var(--vp-c-brand);
	color: var(--vp-c-bg);
	filter: hue-rotate(var(--hue));
}

.search {
	display: block;
	margin: 0 auto 2rem;
}

.tab-content {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
	gap: 8px;
}
</style>
