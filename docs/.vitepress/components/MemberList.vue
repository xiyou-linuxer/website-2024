<script setup lang="ts">
import { computed, ref } from 'vue'
import members from '../data/members.json'
import { getMembers, grades } from '../utils/member'
import MemberCard from './MemberCard.vue'

const props = defineProps<{
    showNewestNum?: number
}>()

const activeGrade = ref<string[]>(
    grades.map(entry => entry.grade).slice(0, props.showNewestNum ?? 1),
)

const search = ref('')

const activeMembers = computed(() =>
    search.value
        ? getMembers(search.value)
        : members.filter(member => activeGrade.value.includes(member.grade)),
)

function setActiveGrade(e: MouseEvent, ...grade: string[]) {
    search.value = ''
    if (e.ctrlKey || e.shiftKey) {
        if (activeGrade.value.includes(grade[0]))
            activeGrade.value = activeGrade.value.filter(g => g !== grade[0])
        else
            activeGrade.value.push(grade[0])
    }
    else {
        activeGrade.value = grade
    }
}
</script>

<template>
    <div class="tabs-container">
        <div class="scrollcheck-x">
            <div class="tabs">
                <button
                    v-for="{ grade, length } in grades"
                    :key="grade"
                    :class="{ active: activeGrade.includes(grade) && !search }"
                    @click="setActiveGrade($event, grade)"
                >
                    <span class="grade">{{ grade }}</span>
                    <span class="badge">{{ length }}</span>
                </button>
            </div>
        </div>

        <input
            v-model="search"
            class="search"
            type="text"
            placeholder="搜索成员"
        >

        <div class="tab-content">
            <MemberCard
                v-for="member in activeMembers"
                :key="member.github || member.name"
                v-bind="member"
            />
        </div>
    </div>
</template>

<style scoped>
.tabs-container {
    margin: 2rem 0;
}

.scrollcheck-x {
    position: sticky;
    top: clamp(4rem, 8vw, 5rem);
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* stylelint-disable-next-line media-feature-range-notation */
@media (max-width: 768px) {
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

.tabs button.active {
    background-color: var(--vp-c-brand);
    color: var(--vp-c-bg);
}

.search {
    display: block;
    margin: 1rem auto;
    padding: 0.2rem 0.8rem;
    border-radius: 0.5rem;
    background-color: var(--vp-c-bg-soft);
}

.tab-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 8px;
}
</style>
