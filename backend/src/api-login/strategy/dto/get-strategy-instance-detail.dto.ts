import { StrategyInstance } from "../../../model/postgres/StrategyInstance.entity";

/**
 * Response object for a strategy instance including more detail that the entity type
 *
 * Additionally contains information for the client such as needed urls
 */
export class StrategyInstanceDetailResponse {
    /**
     * {@link StrategyInstance.id}
     */
    id: string;
    /**
     * {@link StrategyInstance.name}
     */
    name: string | null;
    /**
     * {@link StrategyInstance.type}
     */
    type: string;
    /**
     * {@link StrategyInstance.isLoginActive}
     */
    isLoginActive: boolean;
    /**
     * {@link StrategyInstance.isSelfRegisterActive}
     */
    isSelfRegisterActive: boolean;
    /**
     * {@link StrategyInstance.isSyncActive}
     */
    isSyncActive: boolean;
    /**
     * {@link StrategyInstance.doesImplicitRegister}
     */
    doesImplicitRegister: boolean;
    /**
     * Instance config with sensitive data removed
     * 
     * {@link StrategyInstance.instanceConfig}
     */
    instanceConfig: object;
}

