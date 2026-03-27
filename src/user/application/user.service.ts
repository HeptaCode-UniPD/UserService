import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../domain/user.entity";
import { ValidatedUserDataDTO } from "../../ingestion/dto/validated-user-data.dto";
import type { IUserRepository } from "./ports/user.repository.interface";
import { USER_REPOSITORY } from "./ports/user.repository.interface";
import bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async register(data: ValidatedUserDataDTO): Promise<UserEntity> {
        const exists = await this.userRepository.existsByEmail(data.email);
        if (exists) {
            throw new ConflictException("User already exists");        
        }

        const passwordHash: string = await bcrypt.hash(data.password, 10) as string;

        const user = new UserEntity(
            randomUUID(),
            data.email,
            passwordHash
        );
        return this.userRepository.save(user);
    }

    async login(data: ValidatedUserDataDTO): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isValid: boolean = await bcrypt.compare(data.password, user.passwordHash) as boolean;
        if (!isValid) throw new UnauthorizedException("Invalid credentials");

        return user;
    }
}