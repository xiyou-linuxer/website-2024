export interface Article {
    _id?: string
    __v?: number
    createdAt?: string

    title: string
    description: string
    link: string
    date: string
    author: string
    feed: string
    tag?: string
}
