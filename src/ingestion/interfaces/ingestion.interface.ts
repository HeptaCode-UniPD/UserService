import { UserDataDTO } from "../dto/user-data.dto";
import { SaveRepoDto } from "../dto/save-repo.dto";
import { DeleteRepoDto } from "../dto/delete-repo.dto";
import { ValidatedUserDataDTO } from "../../user/application/dto/validated-user-data.dto";
import { ValidatedSaveRepoDTO } from "../../repo/application/dto/validated-save-repo.dto";
import { ValidatedDeleteRepoDTO } from "../../repo/application/dto/validated-delete-repo.dto";

export interface IngestionInterface {
    validateUser(data: UserDataDTO): ValidatedUserDataDTO;
    validateSaveRepo(data: SaveRepoDto): ValidatedSaveRepoDTO;
    validateDeleteRepo(data: DeleteRepoDto): ValidatedDeleteRepoDTO;
}