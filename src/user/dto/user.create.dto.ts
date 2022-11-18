import { IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    public email: string

    @IsString()
    public username: string

    @IsString()
    public password: string

    @IsString()
    public confirmPassword: string
}