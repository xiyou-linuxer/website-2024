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
