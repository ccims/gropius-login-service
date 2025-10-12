import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphqlService } from "./graphql/graphql.service";
import { ActiveLogin } from "./postgres/ActiveLogin.entity";
import { AuthClient } from "./postgres/AuthClient.entity";
import { LoginUser } from "./postgres/LoginUser.entity";
import { StrategyInstance } from "./postgres/StrategyInstance.entity";
import { UserLoginData } from "./postgres/UserLoginData.entity";
import { UserLoginDataImsUser } from "./postgres/UserLoginDataImsUser.entity";
import { ActiveLoginService } from "./services/active-login.service";
import { AuthClientService } from "./services/auth-client.service";
import { LoginUserService } from "./services/login-user.service";
import { StrategiesService } from "./services/strategies.service";
import { StrategyInstanceService } from "./services/strategy-instance.service";
import { UserLoginDataImsUserService } from "./services/user-login-data-ims-user";
import { UserLoginDataService } from "./services/user-login-data.service";
import { ActiveLoginAccessService } from "./services/active-login-access.service";

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
        ]),
    ],
    providers: modelModuleExportedServices,
    exports: modelModuleExportedServices,
})
export class ModelModule {}
