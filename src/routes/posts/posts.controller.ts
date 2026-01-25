import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostBodyDTO } from './post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
  @Get()
  async getPosts(@ActiveUser('userId') userId: number) {
    const posts = await this.postsService.getPosts(userId)
    const result = posts.map((post) => new GetPostItemDTO(post))
    return result
  }

  @Auth([AuthType.Bearer], { condition: ConditionGuard.And })
  @Post()
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {
    const result = await this.postsService.createPosts(userId, body)
    return new GetPostItemDTO(result)
  }

  @Get('detail/:id')
  async getPostDetail(@Param('id') id: string) {
    const result = await this.postsService.getPostDetail(Number(id))
    return new GetPostItemDTO(result)
  }

  @Auth([AuthType.Bearer])
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostBodyDTO, @ActiveUser('userId') userId: number) {
    const result = await this.postsService.updatePost({
      postId:Number(id), 
      userId,
      body
    })
    return new GetPostItemDTO(result)
  }

  @Auth([AuthType.Bearer])
  @Delete(':id')
  deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number): Promise<boolean> {
    return this.postsService.deletePost(Number(id), userId)
  }
}
