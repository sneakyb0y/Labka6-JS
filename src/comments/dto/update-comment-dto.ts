import { IsString, MinLength } from "class-validator";

export class UpdateCommentDto {
    @MinLength(1)
    @IsString({ message: "Text field is required." })
    public text: string
}