import { Controller, Post, Delete, Body, HttpCode, Get, Query } from "@nestjs/common";
import { UserService } from "../user/application/user.service";
import { RepoService } from "../repo/application/repo.service";
import { UserDataDTO } from "./dto/user-data.dto";
import { SaveRepoDto } from "./dto/save-repo.dto";
import { ValidatedUserDataDTO } from "./dto/validated-user-data.dto";
import { ValidatedSaveRepoDTO } from "./dto/validated-save-repo.dto";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { RepoResponseDto } from "./dto/repo-response.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { UserResponseDTO } from "./dto/user-response.dto";

@Controller()
export class IngestionController {
    constructor(
        private readonly userService: UserService,
        private readonly repoService: RepoService,
    ) {}

    /*
    @Post('auth/register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() body: UserDataDTO): Promise<void> {
        const validated = this.validateUser(body);
        await this.userService.register(validated);
    }
    */

    @Get('profile')
    @ApiOperation({ summary: 'Information about the user'})
    @ApiQuery({
        name: 'userId',
        required: true,
        description: 'User id returned from login',
    })
    async profile(
        @Query('userId') userId: string,
    ): Promise<UserResponseDTO>{
        const user = await this.userService.getUser(userId);
        return UserResponseDTO.fromDomain(user);
    }


    @Post('auth/login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login — returns user id for subsequent requests' })
    async login(@Body() body: UserDataDTO): Promise<AuthResponseDto> {
        const validated = this.validateUser(body);
        const user = await this.userService.login(validated);
        return { userId: user.id, email: user.email};
    }

    @Get('repos')
    @ApiOperation({ summary: 'List all repos for a user' })
    @ApiQuery({
        name: 'userId',
        required: true,
        description: 'User id returned from login',
    })
    async list(
        @Query('userId') userId: string,
    ): Promise<RepoResponseDto[]> {
        const repos = await this.repoService.listForUser(userId);
        return repos.map(RepoResponseDto.fromDomain);
    }

    @Post('repo')
    @ApiOperation({ summary: 'Save a new repo entry' })
    async addRepo(@Body() body: SaveRepoDto): Promise<void> {
        const validated = this.validateSaveRepo(body);
        await this.repoService.addRepo(validated);
    }

    
    @Delete('repo')
    @HttpCode(200)
    async deleteRepo(@Body() body: SaveRepoDto): Promise<void> {
        const validated = this.validateRepo(body);
        await this.repoService.deleteRepo(validated.idUtente[0], validated.url); 
    }
    

    private validateUser(data: UserDataDTO): ValidatedUserDataDTO {
        const validated = new ValidatedUserDataDTO();
        validated.email = data.email;
        validated.password = data.password;
        return validated;
    }

    private validateSaveRepo(data: SaveRepoDto): ValidatedSaveRepoDTO {
        const validated = new ValidatedSaveRepoDTO();
        validated.idUtente = data.idUtente;
        validated.url = data.url;
        return validated;
    }

    private validateRepo(data: any): any {
        return {
            idUtente: Array.isArray(data.idUtente) ? data.idUtente : [data.idUtente],
            url: data.url
        };
    }
}