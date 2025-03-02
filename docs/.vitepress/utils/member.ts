import members from '../data/members'

export interface Member {
    name: string
    title: string
    qq?: string
    github?: string
    linkText: string
    link: string
}

export interface MemberGroup {
    grade: string
    members: Member[]
}

export function getAvatar(member: Member) {
    return member.github
        ? `https://wsrv.nl/?url=github.com/${member.github}.png`
        : member.qq
            ? `https://q1.qlogo.cn/g?b=qq&nk=${member.qq}&s=3`
            : `/favicon.ico`
}

export function getMemberByName(name: string) {
    for (const group of members) {
        for (const member of group.members) {
            if (member.github === name || member.name === name) {
                return member
            }
        }
    }
    return {} as Member
}
