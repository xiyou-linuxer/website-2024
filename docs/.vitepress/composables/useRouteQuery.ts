import { computedWithControl } from '@vueuse/core'

interface UseRouteQueryOptions {
	mode?: 'replace' | 'push'
}
export function useRouteQuery(name: string, defaultValue = '', options?: UseRouteQueryOptions) {
	const { mode = 'replace' } = options ?? {}
	const query = computedWithControl([], {
		get() {
			if (typeof window === 'undefined')
				return defaultValue
			const params = new URLSearchParams(window.location.search)
			return params.get(name) ?? defaultValue
		},
		set(newValue: string) {
			if (typeof window === 'undefined')
				return
			const url = new URL(window.location.href)
			if (newValue !== defaultValue)
				url.searchParams.set(name, newValue)
			else
				url.searchParams.delete(name)
			window.history[`${mode}State`]({}, '', `${url.pathname}${url.search}${url.hash}`)
			query.trigger()
		},
	})
	return query
}
