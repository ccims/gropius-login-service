import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphqlService } from "./graphql/graphql.service.js";
import { ActiveLogin } from "./postgres/ActiveLogin.entity.js";
import { AuthClient } from "./postgres/AuthClient.entity.js";
import { LoginUser } from "./postgres/LoginUser.entity.js";
import { StrategyInstance } from "./postgres/StrategyInstance.entity.js";
import { UserLoginData } from "./postgres/UserLoginData.entity.js";
import { UserLoginDataImsUser } from "./postgres/UserLoginDataImsUser.entity.js";
import { ActiveLoginService } from "./services/active-login.service.js";
import { AuthClientService } from "./services/auth-client.service.js";
import { LoginUserService } from "./services/login-user.service.js";
import { StrategiesService } from "./services/strategies.service.js";
import { StrategyInstanceService } from "./services/strategy-instance.service.js";
import { UserLoginDataImsUserService } from "./services/user-login-data-ims-user.js";
import { UserLoginDataService } from "./services/user-login-data.service.js";
import { ActiveLoginAccessService } from "./services/active-login-access.service.js";
import { ActiveLoginAccess } from "./postgres/ActiveLoginAccess.entity.js";

const modelModuleExportedServices = [
    StrategiesService,
    LoginUserService,
    StrategyInstanceService,
    UserLoginDataService,
    UserLoginDataImsUserService,
    ActiveLoginService,
    AuthClientService,
    GraphqlService,
    ActiveLoginAccessService,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LoginUser,
            ActiveLogin,
            StrategyInstance,
            UserLoginData,
            UserLoginDataImsUser,
            AuthClient,
            ActiveLoginAccess,
        ]),
    ],
    providers: modelModuleExportedServices,
    exports: modelModuleExportedServices,
})
export class ModelModule {}
