import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/user.create.dto';
import { CreateGoogleUserDto } from 'src/user/dto/user.create.with.google.dto';
import { LoginUserDto } from 'src/user/dto/user.login.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AccessToken } from './interface/accesstoken';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    _generatePassword(): string {
        let password = '';
        const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
        const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specialCharacters = '?!*.';

        for (let i = 0; i < 4; i++) {
            password += lowerLetters.charAt(
                Math.floor(Math.random() * lowerLetters.length),
            );
        }

        for (let i = 0; i < 4; i++) {
            password += upperLetters.charAt(
                Math.floor(Math.random() * upperLetters.length),
            );
        }

        for (let i = 0; i < 4; i++) {
            password += digits.charAt(
                Math.floor(Math.random() * digits.length),
            );
        }

        for (let i = 0; i < 4; i++) {
            password += specialCharacters.charAt(
                Math.floor(Math.random() * specialCharacters.length),
            );
        }

        return password;
    }

    async validate(usernameOrEmail: string, password: string): Promise<User> {
        const user = await this.userService.findByEmailOrUsername(
            usernameOrEmail,
        );
        if (user && (await this.userService.checkPassword(user, password))) {
            const { password, ...result } = user;
            return result as any;
        }
        return null;
    }

    async login(loginDto: LoginUserDto): Promise<AccessToken> {
        let user: User;

        try {
            user = await this.userService.findByEmailOrUsername(
                loginDto.username,
            );
        } catch (err) {
            throw new UnauthorizedException(
                `There isn't any user with email or username: ${loginDto.username}`,
            );
        }

        if (!(await this.userService.checkPassword(user, loginDto.password))) {
            throw new UnauthorizedException(`Wrong password`);
        }

        const payload = { username: user.username, userId: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(signUp: CreateUserDto): Promise<User> {
        const user = await this.userService.create(signUp);
        const { password, ...result } = user;
        return result as any;
    }

    async authWithGoogle(req) {
        let user: User;

        // if there is no user in db register it
        try {
            user = await this.userService.findByEmailOrUsername(req.user.email);
            if (!user) {
                throw new Error();
            }
        } catch (err) {
            return this.registerWithGoogle(req);
        }

        const payload = { username: user.username, userId: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registerWithGoogle(req): Promise<User> {
        const createDTO: CreateGoogleUserDto = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            password: this._generatePassword(),
            username: `${req.user.firstName} ${req.user.lastName}`,
        };
        const user = await this.userService.createWithGoogle(createDTO);
        return user;
    }
}
