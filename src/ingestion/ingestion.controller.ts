import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "../user/application/user.service";
import { UserDataDTO } from "./dto/user-data.dto";
import { ValidatedUserDataDTO } from "./dto/validated-user-data.dto";

@Controller('auth')
export class IngestionController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() body: UserDataDTO): Promise<void> {
        const validated = this.validate(body);
        await this.userService.register(validated);
    }

    @Post('login')
    async login(@Body() body: UserDataDTO): Promise<void> {
        const validated = this.validate(body);
        await this.userService.login(validated);
    }

    private validate(data: UserDataDTO): ValidatedUserDataDTO {
        const validated = new ValidatedUserDataDTO();
        validated.email = data.email;
        validated.password = data.password;
        return validated;
    }
}