import members from '../data/members.json'

export interface Member {
	name: string
	grade: string
	title: string
	qq?: string
	github?: string
	linkText: string
	link: string
	feed: string
}

export function getAvatar(member: Member) {
	const { qq, github } = member

	if (github)
		return `https://wsrv.nl/?url=github.com/${github}.png%3fsize=92`
	if (qq)
		return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=3`
	return '/favicon.ico'
}

export function getGroupAvatar(group: string) {
	return `https://p.qlogo.cn/gh/${group}/${group}/0/`
}

export const grades = (() => {
	const gradeMap = new Map<string, number>()
	members.forEach((member) => {
		gradeMap.set(member.grade, (gradeMap.get(member.grade) || 0) + 1)
	})
	return Array.from(gradeMap, ([grade, length]) => ({ grade, length }))
})()

export function getMemberByFeed(feed: string) {
	return members.find(member => member.feed === feed) || {} as Member
}

const memberIndex = members.map(member => ({
	...member,
	searchString: Object.values(member).join(' ').toLowerCase(),
}))

export function getMembers(search: string) {
	const lowerSearch = search.toLowerCase()
	return memberIndex.filter(member => member.searchString.includes(lowerSearch))
}
