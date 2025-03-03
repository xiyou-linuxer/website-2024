import type { Member } from '../utils/member'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getDomain } from '../utils/link'
import { getAvatar } from '../utils/member'

const defaultPreference = {
    author: 'raw' as keyof typeof authorMap,
    avatar: 'name' as keyof typeof avatarMap,
    size: 'medium' as keyof typeof sizeMap,
    wide: true,
}

export const authorMap = {
    raw: {
        label: '原始值(Feed标题)',
        transform: () => undefined,
    },
    name: {
        label: '姓名',
        transform: (m: Member) => m.name,
    },
    github: {
        label: 'GitHub用户名',
        transform: (m: Member) => m.github,
    },
    link: {
        label: '博客域名',
        transform: (m: Member) => getDomain(m.feed),
    },
}

export const avatarMap = {
    none: {
        label: '不展示',
        transform: () => undefined,
    },
    name: {
        label: '作者头像',
        transform: (m: Member) => getAvatar(m),
    },
    link: {
        label: '网站图标',
        transform: (m: Member) => `https://unavatar.webp.se/${getDomain(m.feed)}?w`,
    },
}

export const sizeMap = {
    small: {
        label: '小',
        val: '16em',
    },
    medium: {
        label: '中',
        val: '20em',
    },
    large: {
        label: '大',
        val: '24em',
    },
}

export const useArticleStore = defineStore('article', () => {
    const preference = useLocalStorage('article-preference', { ...defaultPreference })
    const getAuthor = (m: Member) => authorMap[preference.value.author].transform(m)
    const getAvatar = (m: Member) => avatarMap[preference.value.avatar].transform(m)
    const size = computed(() => sizeMap[preference.value.size].val)

    return {
        preference,
        getAuthor,
        getAvatar,
        size,
    }
})
