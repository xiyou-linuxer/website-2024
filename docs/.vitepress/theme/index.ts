// https://vitepress.dev/zh/guide/custom-theme
import type { Theme } from 'vitepress'
import type { directive, Tippy } from 'vue-tippy'
import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import VueTippy, { roundArrow } from 'vue-tippy'

import Dropdown from '../components/atomic/Dropdown.vue'
import QRCode from '../components/atomic/QRCode.vue'
import Tip from '../components/atomic/Tip.vue'
import CommGroup from '../components/CommGroup.vue'
import Footer from '../components/Footer.vue'
import NotFound from '../components/NotFound.vue'

import './font.css'
import './reusable.css'
import './style.css'
import './theme-enhanced.css'
import 'tippy.js/dist/svg-arrow.css'

const globalComponents = {
	Dropdown,
	Icon,
	QRCode,
	Tip,
}

export type GlobalComponentTypes = typeof globalComponents

declare module 'vue' {
	interface GlobalComponents extends GlobalComponentTypes {
		Tooltip: typeof Tippy
	}

	interface GlobalDirectives {
		vTip: typeof directive
	}

	interface ComponentCustomProperties {
		$frontmatter: Record<string, any>
		$param: Record<string, any>
	}
}

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
			'doc-bottom': () => h(Footer),
			'not-found': () => h(NotFound),
			'home-hero-info-after': () => h(CommGroup),
		})
	},
	// enhanceApp({ app, router, siteData }) {
	enhanceApp({ app }) {
		// 注册 globalComponents
		Object.entries(globalComponents).forEach(args => app.component(...args))

		const pinia = createPinia()
		app.use(pinia)

		app.use(VueTippy, {
			component: 'Tooltip',
			directive: 'tip',
			defaultProps: {
				arrow: roundArrow,
			},
		})
	},
} satisfies Theme
