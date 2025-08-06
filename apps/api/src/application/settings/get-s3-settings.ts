import settingsRepo from "@infra/repo/settings.repo";
import {db} from "@infra/service/db.service";

export default () => {
    settingsRepo(db).find('s3')
}