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
                <slot name="content" />
            </div>
        </template>
    </Tooltip>
</template>

<style scoped>
/* https://vue-tippy.netlify.app/props#appendto
   Tooltip 位于组件根部时，interactive tippy 会插入到父组件 */
:deep() ~ [data-tippy-root] > .tippy-box {
    padding: 0.5rem;
    font-size: inherit;
}
</style>
