import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsController } from './routes/posts/posts.controller'
import { PostsModule } from './routes/posts/posts.module'
import { PostsService } from './routes/posts/posts.service'
import { SharedModule } from './shared/shared.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    SharedModule,
    
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService],
})
export class AppModule {}
