import { fromUrl, parseDomain, ParseResultType } from 'parse-domain'

export function getDomain(url: string) {
    const domain = fromUrl(url)
    return typeof domain === 'symbol' ? url : domain
}

export function getMainDomain(url: string, useIcann?: boolean) {
    const hostname = getDomain(url)
    const parseResult = parseDomain(hostname)
    if (parseResult.type !== ParseResultType.Listed)
        return hostname
    const { domain, topLevelDomains } = useIcann ? parseResult.icann : parseResult
    return `${domain}.${topLevelDomains.join('.')}`
}

export function queryBuild(base: string, params: Record<string, any>) {
    const newParams: Record<string, string> = {}
    Object.keys(params).forEach((key) => {
        const value = params[key]
        // 忽略 undefined、null、空字符串，不忽略空数组、空对象
        if (value == null || value === '')
            return
        newParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value)
    })

    const queryString = new URLSearchParams(newParams).toString()
    return base + (base.includes('?') ? '&' : '?') + queryString
}
