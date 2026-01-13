import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import envConfig from './shared/config'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor'
import { TransformInterceptor } from './shared/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({
    // Tu dong loai bo cac field khong dc khai bao decorator trong DTO
    whitelist:true,
    // Neu co filed khong duoc khai bao decorator trong DTO ma client truyen len se bao loi
    forbidNonWhitelisted: true,
    // Tu dong chuyen doi du lieu sang kieu duoc khai bao trong DTO
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    exceptionFactory: (validationErrors) => {
      return new UnprocessableEntityException(validationErrors.map(error => ({
        field: error.property,
        error: Object.values(error.constraints as any).join(', ')
      })));
    }
  }))
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(envConfig.PORT ?? 8000)
}
bootstrap()
