import { IsInt, IsNumber, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsInt()
    public postId: number
    @MinLength(1)
    @IsString({ message: "Text field is required." })
    public text: string
}