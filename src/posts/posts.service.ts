import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts() {
    return ['Post 1', 'Post 2', 'Post 3']
  }
  createPosts(body: any) {
    return body
  }
  getPostDetail(id: string) {
    return `Post detail with id: ${id}`
  }
  updatePost(id: string, body: any) {
    return { id, ...body }
  }
  deletePost(id: string) {
    return `Delete post with id: ${id}`
  }
}
