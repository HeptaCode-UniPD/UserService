import { UserEntity } from "../../domain/user.entity";
import { ValidatedUserDataDTO } from "../dto/validated-user-data.dto";

export interface UserServiceLayerInterface {
    login(data: ValidatedUserDataDTO): Promise<UserEntity>;
    getUser(userId: string): Promise<UserEntity>;
}