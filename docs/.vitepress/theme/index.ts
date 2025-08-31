// https://vitepress.dev/zh/guide/custom-theme
import type { Theme } from 'vitepress'
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

import 'tippy.js/dist/svg-arrow.css'
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
			'home-hero-info-after': () => h(CommGroup),
		})
	},
	// enhanceApp({ app, router, siteData }) {
	enhanceApp({ app }) {
		app.component('Dropdown', Dropdown)
		app.component('Icon', Icon)
		app.component('QRCode', QRCode)
		app.component('Tip', Tip)

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
