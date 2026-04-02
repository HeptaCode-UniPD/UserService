import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "../domain/user.entity";
import { ValidatedUserDataDTO } from "./dto/validated-user-data.dto";
import type { IUserRepository } from "./interfaces/user.repository.interface";
import { USER_REPOSITORY } from "./interfaces/user.repository.interface";
import { UserServiceLayerInterface } from "./interfaces/user.service.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements UserServiceLayerInterface {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async getUser(userId: string): Promise<UserEntity> {
        const user = await this.userRepository.findById(userId);
        if (!user) { throw new NotFoundException("User not found"); }
        return user;
    }

    async login(data: ValidatedUserDataDTO): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException("Invalid credentials");
        return user;
    }
}