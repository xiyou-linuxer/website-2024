// https://vitepress.dev/zh/guide/custom-theme
import type { Theme } from 'vitepress'
import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import VueTippy, { roundArrow } from 'vue-tippy'

import Dropdown from '../components/Dropdown.vue'
import Footer from '../components/Footer.vue'
import NotFound from '../components/NotFound.vue'

import './reusable.css'
import './theme-enhanced.css'
import './style.css'

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
			'doc-bottom': () => h(Footer),
			'not-found': () => h(NotFound),
		})
	},
	// enhanceApp({ app, router, siteData }) {
	enhanceApp({ app }) {
		app.component('Dropdown', Dropdown)
		app.component('Icon', Icon)
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
