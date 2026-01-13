import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDTO, RegisterResDTO } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.register(body)
    if (!result) {
      throw new BadRequestException('Register failed')
    }
    return result;
  }
}
