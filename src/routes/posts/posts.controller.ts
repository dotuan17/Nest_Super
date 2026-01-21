import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { GetPostItemDTO } from './post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
  @Get()
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId)
      .then((posts) => posts.map((post) => new GetPostItemDTO(post)))
  }

  @Post()
  @Auth([AuthType.Bearer], { condition: ConditionGuard.And })
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.createPosts(userId, body)
  }

  @Get(':id')
  getPostDetail(@Param('id') id: string) {
    return this.postsService.getPostDetail(id)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any) {
    return this.postsService.updatePost(id, body)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
