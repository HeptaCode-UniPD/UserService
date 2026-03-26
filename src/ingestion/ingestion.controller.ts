import { Controller, Post, Delete, Body, HttpCode } from "@nestjs/common";
import { UserService } from "../user/application/user.service";
import { RepoService } from "../repo/application/repo.service";
import { UserDataDTO } from "./dto/user-data.dto";
import { RepoDataDTO } from "./dto/repo-data.dto";
import { ValidatedUserDataDTO } from "./dto/validated-user-data.dto";
import { ValidatedRepoDataDTO } from "./dto/validated-repo-data.dto";

@Controller()
export class IngestionController {
    constructor(
        private readonly userService: UserService,
        private readonly repoService: RepoService,
    ) {}

    @Post('auth/register')
    async register(@Body() body: UserDataDTO): Promise<void> {
        const validated = this.validateUser(body);
        await this.userService.register(validated);
    }

    @Post('auth/login')
    @HttpCode(200)
    async login(@Body() body: UserDataDTO): Promise<void> {
        const validated = this.validateUser(body);
        await this.userService.login(validated);
    }

    @Post('repo')
    async addRepo(@Body() body: RepoDataDTO): Promise<void> {
        const validated = this.validateRepo(body);
        await this.repoService.addRepo(validated);
    }

    @Delete('repo')
    @HttpCode(200)
    async deleteRepo(@Body() body: RepoDataDTO): Promise<void> {
        const validated = this.validateRepo(body);
        await this.repoService.deleteRepo(validated);
    }

    private validateUser(data: UserDataDTO): ValidatedUserDataDTO {
        const validated = new ValidatedUserDataDTO();
        validated.email = data.email;
        validated.password = data.password;
        return validated;
    }

    private validateRepo(data: RepoDataDTO): ValidatedRepoDataDTO {
        const validated = new ValidatedRepoDataDTO();
        validated.idUtente = data.idUtente;
        validated.url = data.url;
        return validated;
    }
}