import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.create.dto';
import { LoginUserDto } from 'src/user/dto/user.login.dto';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google.auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() signUpDto: CreateUserDto) {
        return this.authService.register(signUpDto);
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() signInDto: LoginUserDto) {
        return this.authService.login(signInDto);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    me(@AuthUser() user: User): User {
        return user;
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleLogin(@Req() req) {}

    @Get('google/redirect')
    @UseGuards(GoogleOauthGuard)
    async loginOrRegisterWithGoogle(@Req() req) {
        return this.authService.authWithGoogle(req);
    }
}
