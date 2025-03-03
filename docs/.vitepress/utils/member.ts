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
    return member.github
        ? `https://wsrv.nl/?url=github.com/${member.github}.png`
        : member.qq
            ? `https://q1.qlogo.cn/g?b=qq&nk=${member.qq}&s=3`
            : `/favicon.ico`
}

export function getMember(search: string) {
    return members.find(member =>
        member.github === search || member.name === search) as Member
}

const memberIndex = members.map(member => ({
    ...member,
    searchString: Object.values(member).join(' ').toLowerCase(),
}))

export function getMembers(search: string) {
    const lowerSearch = search.toLowerCase()
    return memberIndex.filter(member => member.searchString.includes(lowerSearch))
}
