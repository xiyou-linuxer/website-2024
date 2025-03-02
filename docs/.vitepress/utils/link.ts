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
