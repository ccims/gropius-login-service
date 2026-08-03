/* eslint-disable */
import * as types from "./graphql.js";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n": typeof types.LegalInformationDocument;
    "\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n": typeof types.GetLegalInformationDocument;
    "\n    query checkUserIsAdmin($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on GropiusUser {\n                __typename\n                id\n                isAdmin\n            }\n        }\n    }\n": typeof types.CheckUserIsAdminDocument;
    "\n    query getBasicGropiusUserData($id: ID!) {\n        node(id: $id) {\n            ...UserData\n        }\n    }\n": typeof types.GetBasicGropiusUserDataDocument;
    "\n    query getAllGropiusUsers {\n        gropiusUserIds\n    }\n": typeof types.GetAllGropiusUsersDocument;
    "\n    mutation createNewUser($input: CreateGropiusUserInput!) {\n        createGropiusUser(input: $input) {\n            gropiusUser {\n                ...UserData\n            }\n        }\n    }\n": typeof types.CreateNewUserDocument;
    "\n    mutation setImsUserLink($gropiusUserId: ID!, $imsUserId: ID!) {\n        updateIMSUser(input: { id: $imsUserId, gropiusUser: $gropiusUserId }) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n": typeof types.SetImsUserLinkDocument;
    "\n    query getImsUserDetails($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            ...ImsUserWithDetail\n        }\n    }\n": typeof types.GetImsUserDetailsDocument;
    "\n    query getImsUsersByTemplatedFieldValues($imsFilterInput: IMSFilterInput!, $userFilterInput: IMSUserFilterInput!) {\n        imss(filter: $imsFilterInput) {\n            __typename\n            nodes {\n                __typename\n                id\n                users(filter: $userFilterInput) {\n                    __typename\n                    nodes {\n                        __typename\n                        id\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetImsUsersByTemplatedFieldValuesDocument;
    "\n    mutation createNewImsUserInIms($input: CreateIMSUserInput!) {\n        createIMSUser(input: $input) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n": typeof types.CreateNewImsUserInImsDocument;
    "\n    query getBasicImsUserData($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            id\n        }\n    }\n": typeof types.GetBasicImsUserDataDocument;
    "fragment ImsUserWithDetail on IMSUser {\n  __typename\n  id\n  username\n  displayName\n  email\n  templatedFields {\n    __typename\n    name\n    value\n  }\n  ims {\n    __typename\n    id\n    name\n    description\n    templatedFields {\n      __typename\n      name\n      value\n    }\n  }\n}": typeof types.ImsUserWithDetailFragmentDoc;
    "fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}": typeof types.BaseLegalInformationInfoFragmentDoc;
    "fragment UserData on GropiusUser {\n  __typename\n  id\n  username\n  displayName\n  email\n}": typeof types.UserDataFragmentDoc;
};
const documents: Documents = {
    "\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n":
        types.LegalInformationDocument,
    "\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n":
        types.GetLegalInformationDocument,
    "\n    query checkUserIsAdmin($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on GropiusUser {\n                __typename\n                id\n                isAdmin\n            }\n        }\n    }\n":
        types.CheckUserIsAdminDocument,
    "\n    query getBasicGropiusUserData($id: ID!) {\n        node(id: $id) {\n            ...UserData\n        }\n    }\n":
        types.GetBasicGropiusUserDataDocument,
    "\n    query getAllGropiusUsers {\n        gropiusUserIds\n    }\n": types.GetAllGropiusUsersDocument,
    "\n    mutation createNewUser($input: CreateGropiusUserInput!) {\n        createGropiusUser(input: $input) {\n            gropiusUser {\n                ...UserData\n            }\n        }\n    }\n":
        types.CreateNewUserDocument,
    "\n    mutation setImsUserLink($gropiusUserId: ID!, $imsUserId: ID!) {\n        updateIMSUser(input: { id: $imsUserId, gropiusUser: $gropiusUserId }) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n":
        types.SetImsUserLinkDocument,
    "\n    query getImsUserDetails($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            ...ImsUserWithDetail\n        }\n    }\n":
        types.GetImsUserDetailsDocument,
    "\n    query getImsUsersByTemplatedFieldValues($imsFilterInput: IMSFilterInput!, $userFilterInput: IMSUserFilterInput!) {\n        imss(filter: $imsFilterInput) {\n            __typename\n            nodes {\n                __typename\n                id\n                users(filter: $userFilterInput) {\n                    __typename\n                    nodes {\n                        __typename\n                        id\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetImsUsersByTemplatedFieldValuesDocument,
    "\n    mutation createNewImsUserInIms($input: CreateIMSUserInput!) {\n        createIMSUser(input: $input) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n":
        types.CreateNewImsUserInImsDocument,
    "\n    query getBasicImsUserData($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            id\n        }\n    }\n":
        types.GetBasicImsUserDataDocument,
    "fragment ImsUserWithDetail on IMSUser {\n  __typename\n  id\n  username\n  displayName\n  email\n  templatedFields {\n    __typename\n    name\n    value\n  }\n  ims {\n    __typename\n    id\n    name\n    description\n    templatedFields {\n      __typename\n      name\n      value\n    }\n  }\n}":
        types.ImsUserWithDetailFragmentDoc,
    "fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}":
        types.BaseLegalInformationInfoFragmentDoc,
    "fragment UserData on GropiusUser {\n  __typename\n  id\n  username\n  displayName\n  email\n}":
        types.UserDataFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n",
): (typeof documents)["\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n",
): (typeof documents)["\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query checkUserIsAdmin($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on GropiusUser {\n                __typename\n                id\n                isAdmin\n            }\n        }\n    }\n",
): (typeof documents)["\n    query checkUserIsAdmin($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on GropiusUser {\n                __typename\n                id\n                isAdmin\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getBasicGropiusUserData($id: ID!) {\n        node(id: $id) {\n            ...UserData\n        }\n    }\n",
): (typeof documents)["\n    query getBasicGropiusUserData($id: ID!) {\n        node(id: $id) {\n            ...UserData\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getAllGropiusUsers {\n        gropiusUserIds\n    }\n",
): (typeof documents)["\n    query getAllGropiusUsers {\n        gropiusUserIds\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createNewUser($input: CreateGropiusUserInput!) {\n        createGropiusUser(input: $input) {\n            gropiusUser {\n                ...UserData\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation createNewUser($input: CreateGropiusUserInput!) {\n        createGropiusUser(input: $input) {\n            gropiusUser {\n                ...UserData\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation setImsUserLink($gropiusUserId: ID!, $imsUserId: ID!) {\n        updateIMSUser(input: { id: $imsUserId, gropiusUser: $gropiusUserId }) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation setImsUserLink($gropiusUserId: ID!, $imsUserId: ID!) {\n        updateIMSUser(input: { id: $imsUserId, gropiusUser: $gropiusUserId }) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getImsUserDetails($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            ...ImsUserWithDetail\n        }\n    }\n",
): (typeof documents)["\n    query getImsUserDetails($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            ...ImsUserWithDetail\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getImsUsersByTemplatedFieldValues($imsFilterInput: IMSFilterInput!, $userFilterInput: IMSUserFilterInput!) {\n        imss(filter: $imsFilterInput) {\n            __typename\n            nodes {\n                __typename\n                id\n                users(filter: $userFilterInput) {\n                    __typename\n                    nodes {\n                        __typename\n                        id\n                    }\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    query getImsUsersByTemplatedFieldValues($imsFilterInput: IMSFilterInput!, $userFilterInput: IMSUserFilterInput!) {\n        imss(filter: $imsFilterInput) {\n            __typename\n            nodes {\n                __typename\n                id\n                users(filter: $userFilterInput) {\n                    __typename\n                    nodes {\n                        __typename\n                        id\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createNewImsUserInIms($input: CreateIMSUserInput!) {\n        createIMSUser(input: $input) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation createNewImsUserInIms($input: CreateIMSUserInput!) {\n        createIMSUser(input: $input) {\n            __typename\n            imsUser {\n                __typename\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getBasicImsUserData($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            id\n        }\n    }\n",
): (typeof documents)["\n    query getBasicImsUserData($imsUserId: ID!) {\n        node(id: $imsUserId) {\n            __typename\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment ImsUserWithDetail on IMSUser {\n  __typename\n  id\n  username\n  displayName\n  email\n  templatedFields {\n    __typename\n    name\n    value\n  }\n  ims {\n    __typename\n    id\n    name\n    description\n    templatedFields {\n      __typename\n      name\n      value\n    }\n  }\n}",
): (typeof documents)["fragment ImsUserWithDetail on IMSUser {\n  __typename\n  id\n  username\n  displayName\n  email\n  templatedFields {\n    __typename\n    name\n    value\n  }\n  ims {\n    __typename\n    id\n    name\n    description\n    templatedFields {\n      __typename\n      name\n      value\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}",
): (typeof documents)["fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment UserData on GropiusUser {\n  __typename\n  id\n  username\n  displayName\n  email\n}",
): (typeof documents)["fragment UserData on GropiusUser {\n  __typename\n  id\n  username\n  displayName\n  email\n}"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
