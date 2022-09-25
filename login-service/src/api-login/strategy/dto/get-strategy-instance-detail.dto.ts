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
     * All URLs that are relevant for the client whenusing this strategy instance to authenticte
     */
    urls: StrategyInstanceUrlsResponse;
}

/**
 * A response type containing url information for a strategy instance
 *
 * For every instance the redirect url is given, for instances allowing post credentials it also contains the post urls
 */
export class StrategyInstanceUrlsResponse {
    /**
     * The url to post credentials to, to log in using this strategy instance.
     *
     * Additionally `grant_type? must be set to "password" and the client must authenticate
     */
    postLogin?: string;

    /**
     * The url to post credentials to, to register or link **without** sync using this strategy instance.
     *
     * Additionally `grant_type? must be set to "password" and the client must authenticate
     */
    postRegister?: string;

    /**
     * The url to post credentials to, to register or link **with** avtivated sync functionality
     *
     * Additionally `grant_type? must be set to "password" and the client must authenticate
     */
    postRegisterSync?: string;

    /**
     * The url to redirect the user to, to log in using this strategy
     *
     * On the request, the query parameter `client_id` must be set
     */
    redirectLogin: string;

    /**
     * The url to redirect the user to, to register or link **without** sync using this strategy instance.
     *
     * On the request, the query parameter `client_id` must be set
     */
    redirectRegister: string;

    /**
     * The url to redirect the user to, to register or link **with** avtivated sync functionality
     *
     * On the request, the query parameter `client_id` must be set
     */
    redirectRegisterSync: string;
}
