import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/user.create.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAllUsers(){
        return this.userService.getAllUserTest();
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    createUser(@Body() body: CreateUserDto) {
        return this.userService.create(body);
    }

    @Delete(":id")
    delete(@Param('id', new ParseIntPipe()) id: number) {
        return this.userService.delete(id);
    }    
}