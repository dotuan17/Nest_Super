import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { isUniqueConstraintPrismaError, isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async register(body: RegisterBodyDTO) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      })
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })
    if (!user) {
      throw new UnauthorizedException('Account is not exist')
    }
    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw new UnauthorizedException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ])
    }
    const tokens = this.generateTokens({ userId: user.id })
    return tokens
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })
    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })
      const tokens = await this.generateTokens({ userId: userId })
      return tokens
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException()
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })
      return { message: 'Logout thành công' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Logout thất bại')
      }
      throw new UnauthorizedException()
    }
  }
}
