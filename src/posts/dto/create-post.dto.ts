import { IsString, MinLength } from "class-validator";

export class CreatePostDto {
    @MinLength(1)
    @IsString({ message: "Title field is required." })
    public title: string
    @IsString()
    public description: string
}