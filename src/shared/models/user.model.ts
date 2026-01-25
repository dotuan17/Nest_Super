import { Exclude } from "class-transformer"
import { IsEmail, IsString } from "class-validator"

export class UserModel {
  id: number
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial)
  }
}
