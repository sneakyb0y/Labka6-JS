const bcrypt = require('bcrypt');
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.create.dto';
import { CreateGoogleUserDto } from './dto/user.create.with.google.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    _isValidPassword(password: string): boolean {
        /**
         * This regex will enforce these rules:
            At least one upper case English letter
            At least one lower case English letter
            At least one digit
            At least one special character
            Minimum eight in length
         */
        return /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(
            password,
        );
    }

    async create(createDTO: CreateUserDto) {
        if (createDTO.password !== createDTO.confirmPassword) {
            throw new BadRequestException('Confirm password not match');
        }

        const user = await this.userRepository.find({
            where: [
                { email: createDTO.email },
                { username: createDTO.username },
            ],
        });

        if (user.length > 0) {
            throw new BadRequestException('Email or username already taken!');
        }

        if (!this._isValidPassword(createDTO.password)) {
            throw new BadRequestException('Password doesnt match the pattern!');
        }

        const hashedPassword = await bcrypt.hash(createDTO.password, 10);

        const newUser = this.userRepository.create({
            email: createDTO.email,
            password: hashedPassword,
            username: createDTO.username,
        });

        const savedUser = await this.userRepository.save(newUser);
        delete savedUser.password;

        return savedUser;
    }

    async createWithGoogle(createDTO: CreateGoogleUserDto) {
        const user = await this.userRepository.find({
            where: [
                { email: createDTO.email },
                { username: createDTO.username },
            ],
        });

        if (user.length > 0) {
            throw new BadRequestException('Email or username already taken!');
        }

        if (!this._isValidPassword(createDTO.password)) {
            throw new BadRequestException('Password doesnt match the pattern!');
        }

        const newUser = this.userRepository.create({
            email: createDTO.email,
            password: createDTO.password,
            username: createDTO.username,
        });

        const savedUser = await this.userRepository.save(newUser);
        delete savedUser.password;

        return savedUser;
    }

    checkPassword(user: User, plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, user.password);
    }

    getAllUserTest() {
        return this.userRepository.find({
            select: {
                id: true,
                username: true,
                email: true,
            },
        });
    }

    findByEmailOrUsername(emailOrUsername: string) {
        return this.userRepository.findOne({
            where: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });
    }

    async delete(id: number) {
        await this.userRepository.delete({ id: id });
    }
}
