<script setup lang="ts">
import type { MemberGroup } from '../utils/member'
import { computed, ref } from 'vue'
import MemberCard from './MemberCard.vue'

const props = defineProps<{
    members: MemberGroup[]
    from?: number
    to?: number
}>()

const selectedMembers = computed(() => {
    const from = props.from ?? 0
    const to = props.to ?? props.members.length
    return props.members.slice(from, to)
})

const activeGradeIndex = ref<string>(selectedMembers.value[0]?.grade || '')

function setActiveGrade(grade: string) {
    activeGradeIndex.value = grade
}
</script>

<template>
    <div class="tabs-container">
        <div class="tabs">
            <button
                v-for="(gradeObj, gradeIndex) in selectedMembers" :key="gradeIndex"
                :class="{ active: activeGradeIndex === gradeObj.grade }" @click="setActiveGrade(gradeObj.grade)"
            >
                <span class="grade">{{ gradeObj.grade }}</span>
                <span class="badge">{{ gradeObj.members.length }}</span>
            </button>
        </div>
        <div
            v-for="gradeObj in selectedMembers" v-show="activeGradeIndex === gradeObj.grade" :key="gradeObj.grade"
            class="tab-contents"
        >
            <div class="members">
                <MemberCard v-for="member in gradeObj.members" :key="member.name" v-bind="member" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.tabs-container > * {
    margin: 2rem 0;
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
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

.tabs button > * {
    padding: 2px 4px;
}

.tabs button > .badge {
    background-color: var(--vp-c-default-soft);
}

.tabs button.active {
    background-color: var(--vp-c-brand);
    color: var(--vp-c-bg);
}

.members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 8px;
}
</style>
