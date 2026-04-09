import { Controller, Post, Delete, Body, HttpCode, Get, Query } from "@nestjs/common";
import { UserService } from "../user/application/user.service";
import { RepoService } from "../repo/application/repo.service";
import { UserDataDTO } from "./dto/user-data.dto";
import { SaveRepoDto } from "./dto/save-repo.dto";
import { DeleteRepoDto } from './dto/delete-repo.dto';
import { ValidatedUserDataDTO } from "../user/application/dto/validated-user-data.dto";
import { ValidatedSaveRepoDTO } from "../repo/application/dto/validated-save-repo.dto";
import { ValidatedDeleteRepoDTO } from "../repo/application/dto/validated-delete-repo.dto";
import { ApiOperation, ApiQuery, ApiTags, ApiResponse } from "@nestjs/swagger";
import { RepoResponseDto } from "./dto/repo-response.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { UserResponseDTO } from "./dto/user-response.dto";
import { IngestionInterface } from "./interfaces/ingestion.interface";

@ApiTags('Ingestion')
@Controller()
export class IngestionController implements IngestionInterface {
    constructor(
        private readonly userService: UserService,
        private readonly repoService: RepoService,
    ) {}

    @Get('profile')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Return user profile information', type: UserResponseDTO })
    @ApiResponse({ status: 404, description: 'User not found' })
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
    @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() body: UserDataDTO): Promise<AuthResponseDto> {
        const validated = this.validateUser(body);
        const user = await this.userService.login(validated);
        return { userId: user.id, email: user.email};
    }

    @Get('repos')
    @ApiOperation({ summary: 'List all repos for a user' })
    @ApiResponse({ status: 200, description: 'Return list of repositories', type: [RepoResponseDto] })
    @ApiQuery({
        name: 'userId',
        required: true,
        description: 'User id returned from login',
    })
    async list(
        @Query('userId') userId: string,
    ): Promise<RepoResponseDto[]> {
        const repos = await this.repoService.listForUser(userId);
        return repos.map(repo => RepoResponseDto.fromDomain(repo));
    }

    @Post('repo')
    @ApiOperation({ summary: 'Save a new repo entry' })
    @ApiResponse({ status: 201, description: 'Repository saved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid repository data' })
    async addRepo(@Body() body: SaveRepoDto): Promise<{ id: string }> {
        const validated = this.validateSaveRepo(body);
        const repo = await this.repoService.addRepo(validated);
        return { id: repo.id };
    }

    @Delete('repo')
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete a repository entry' })
    @ApiResponse({ status: 200, description: 'Repository deleted successfully' })
    @ApiResponse({ status: 404, description: 'Repository or User not found' })
    async deleteRepo(@Body() body: DeleteRepoDto): Promise<void> {
        const validated = this.validateDeleteRepo(body);
        await this.repoService.deleteRepo(validated);
    }

    @Get('repo')
    @ApiOperation({ summary: 'Get a specific repository by ID' })
    @ApiResponse({ status: 200, description: 'Return repository details', type: RepoResponseDto })
    @ApiResponse({ status: 404, description: 'Repository not found' })
    @ApiQuery({
        name: 'repoId',
        required: true,
        description: 'The unique identifier of the repository',
    })
    async getById(
        @Query('repoId') repoId: string,
    ): Promise<RepoResponseDto> {
        const repo = await this.repoService.getRepoById(repoId);
        return RepoResponseDto.fromDomain(repo);
    }

    validateUser(data: UserDataDTO): ValidatedUserDataDTO {
        const validated = new ValidatedUserDataDTO();
        validated.email = data.email;
        validated.password = data.password;
        return validated;
    }

    validateSaveRepo(data: SaveRepoDto): ValidatedSaveRepoDTO {
        const validated = new ValidatedSaveRepoDTO();
        validated.idUtente = data.idUtente;
        validated.url = data.url;
        return validated;
    }

    validateDeleteRepo(data: DeleteRepoDto): ValidatedDeleteRepoDTO {
        const validated = new ValidatedDeleteRepoDTO();
        validated.idUtente = data.idUtente;
        validated.idRepo = data.idRepo;
        return validated;
    }
}