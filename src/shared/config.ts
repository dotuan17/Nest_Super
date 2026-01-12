import { plainToInstance } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

config({
  path: path.resolve('.env'),
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Khong tim thay file .env')
  process.exit(1)
}

class ConfigSchema {
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
  @IsString()
  PORT: string
}
const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
})

console.log("configServer===>",  configServer);
 

const e = validateSync(configServer)
if (e.length > 0) {
  console.log('cac gia tri khai bao trong file .env khong hop le');
  const errors = e.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      value: eItem.value,
    }
  })
  throw errors;
}

  const envConfig =  configServer

  export default envConfig