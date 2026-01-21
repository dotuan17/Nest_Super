import { Exclude } from "class-transformer"
import { IsEmail, IsString } from "class-validator"

export class UserModel {
  @IsString()
  id: number
  @IsEmail()
  email: string
  @IsString()
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial)
  }
}
