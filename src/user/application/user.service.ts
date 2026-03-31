import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "../domain/user.entity";
import { ValidatedUserDataDTO } from "../../ingestion/dto/validated-user-data.dto";
import type { IUserRepository } from "./ports/user.repository.interface";
import { USER_REPOSITORY } from "./ports/user.repository.interface";
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    /*
    async register(data: ValidatedUserDataDTO): Promise<UserEntity> {
        const exists = await this.userRepository.existsByEmail(data.email);
        if (exists) {
            throw new ConflictException("User already exists");        
        }

        const passwordHash = (await (bcrypt as any).hash(data.password, 10)) as string;
        const user = new UserEntity(
            randomUUID(),
            data.email,
            passwordHash
        );
        return this.userRepository.save(user);
    }
    */

    async getUser(userId: string): Promise<UserEntity> {
        const user = await this.userRepository.findById(userId);

        if(!user) { throw new NotFoundException("User not found"); }

        return user;
    }

    async login(data: ValidatedUserDataDTO): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isValid = (await (bcrypt as any).compare(data.password, user.passwordHash)) as boolean;
        if (!isValid) throw new UnauthorizedException("Invalid credentials");

        return user;
    }
}