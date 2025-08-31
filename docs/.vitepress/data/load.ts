import fs from 'node:fs'
import matter from 'gray-matter'

const parseByGlobDefaultOptions = {
	filterEmptyTitle: true,
	filterEmptyDate: true,
	dateDesc: true,
	trimSiteName: true,
}

export type ParseByGlobOptions = typeof parseByGlobDefaultOptions

export function parseByGlob(glob: string, options?: ParseByGlobOptions) {
	const {
		filterEmptyTitle,
		filterEmptyDate,
		dateDesc,
		trimSiteName,
	} = { ...parseByGlobDefaultOptions, ...options }

	function parseFile(file: string) {
		const { data: { title = '', date } } = matter.read(file)

		return {
			text: title.replace(trimSiteName ? /^西邮 ?Linux ?兴趣小组 ?/ : '', '').trim(),
			date,
			link: file.replace(/\\/g, '/').replace(/^docs/, '').replace('.md', ''),
		}
	}

	const files = fs.globSync(glob)
	const items = files.map(parseFile)
		.filter(item => item.text || !filterEmptyTitle)
		.filter(item => item.date || !filterEmptyDate)
		.sort((a, b) => (+new Date(a.date) - +new Date(b.date)) * (dateDesc ? -1 : 1))

	return items
}
