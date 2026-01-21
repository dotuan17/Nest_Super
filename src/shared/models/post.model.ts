export class PostModel {
    id: number
    title: string
    content: string
    authorId: number
    createdAt: Date
    updateAt: Date

    constructor(partial: Partial<PostModel>) {
        Object.assign(this, partial)
    }
}