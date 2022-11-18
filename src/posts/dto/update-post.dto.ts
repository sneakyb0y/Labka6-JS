import { IsString, MinLength } from "class-validator"

export class UpdatePostDto {
    @MinLength(1)
    @IsString({ message: "Title field is required." })
    public title: string
    @IsString()
    public description: string
}