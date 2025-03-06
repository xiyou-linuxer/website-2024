<template>
    <Tooltip
        class="dropdown"
        interactive
        placement="bottom"
        :arrow="false"
        :hide-on-click="false"
        :offset="[0, 0]"
    >
        <slot />
        <template #content="{ hide }">
            <div class="dropdown-content">
                <slot name="content" :hide />
            </div>
        </template>
    </Tooltip>
</template>

<style scoped>
.dropdown-content.dropdown-content {
    display: grid;
    overflow-y: auto;
    max-height: clamp(4rem, 50vh, 20rem);
    margin: -0.5em;
    scrollbar-width: thin;
}

.dropdown-content > :deep(button) {
    padding: 0.2em 0.5em;
    text-align: start;
    transition: color 0.1s, background-color 0.2s;
    cursor: pointer;
}

.dropdown-content > :deep(button):hover {
    background-color: var(--vp-c-bg-soft);
}

/* https://vue-tippy.netlify.app/props#appendto
   Tooltip 位于组件根部时，interactive tippy 会插入到父组件 */
:deep() ~ [data-tippy-root] > .tippy-box {
    padding: 0.5rem;
    font-size: inherit;
}
</style>
