import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Duration: any;
  JSON: any;
  URL: any;
};

/** Event representing that an entity is affected by an Issue */
export type AddedAffectedEntityEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'AddedAffectedEntityEvent';
  /** The entity affected by the Issue. */
  addedAffectedEntity?: Maybe<AffectedByIssue>;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/** Event representing that an entity is affected by an Issue */
export type AddedAffectedEntityEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an entity is affected by an Issue */
export type AddedAffectedEntityEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an Artefact was added to an Issue. */
export type AddedArtefactEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'AddedArtefactEvent';
  /** The Artefact added to the Issue. */
  addedArtefact?: Maybe<Artefact>;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/** Event representing that an Artefact was added to an Issue. */
export type AddedArtefactEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Artefact was added to an Issue. */
export type AddedArtefactEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that a Label was added to an Issue. */
export type AddedLabelEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'AddedLabelEvent';
  /** The Label added to the Issue. */
  addedLabel?: Maybe<Label>;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/** Event representing that a Label was added to an Issue. */
export type AddedLabelEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that a Label was added to an Issue. */
export type AddedLabelEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an Issue was pinned on a Trackable. */
export type AddedToPinnedIssuesEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'AddedToPinnedIssuesEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The Trackable the Issue is now pinned on. */
  pinnedOn?: Maybe<Trackable>;
};


/** Event representing that an Issue was pinned on a Trackable. */
export type AddedToPinnedIssuesEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Issue was pinned on a Trackable. */
export type AddedToPinnedIssuesEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that the Issue was added to a Trackable. */
export type AddedToTrackableEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'AddedToTrackableEvent';
  /** The Trackable the Issue was added to. */
  addedToTrackable?: Maybe<Trackable>;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/** Event representing that the Issue was added to a Trackable. */
export type AddedToTrackableEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the Issue was added to a Trackable. */
export type AddedToTrackableEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * Entities that can be affected by an Issue, meaning that this entity is in some regard
 *     impacted by e.g. a bug described by an issue, or the non-present of a feature described by an issue.
 *
 */
export type AffectedByIssue = {
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
};


/**
 * Entities that can be affected by an Issue, meaning that this entity is in some regard
 *     impacted by e.g. a bug described by an issue, or the non-present of a feature described by an issue.
 *
 */
export type AffectedByIssueAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Entities that can be affected by an Issue, meaning that this entity is in some regard
 *     impacted by e.g. a bug described by an issue, or the non-present of a feature described by an issue.
 *
 */
export type AffectedByIssueExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Entities that can be affected by an Issue, meaning that this entity is in some regard
 *     impacted by e.g. a bug described by an issue, or the non-present of a feature described by an issue.
 *
 */
export type AffectedByIssueExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for AffectedByIssue. */
export type AffectedByIssueConnection = {
  __typename?: 'AffectedByIssueConnection';
  /** A list of all edges of the current page. */
  edges: Array<AffectedByIssueEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<AffectedByIssue>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type AffectedByIssueEdge = {
  __typename?: 'AffectedByIssueEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: AffectedByIssue;
};

/** Filter used to filter AffectedByIssue */
export type AffectedByIssueFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<AffectedByIssueFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<AffectedByIssueFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<AffectedByIssueFilterInput>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AffectedByIssueListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<AffectedByIssueFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<AffectedByIssueFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<AffectedByIssueFilterInput>;
};

/** Defines the order of a AffectedByIssue list */
export type AffectedByIssueOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<AffectedByIssueOrderField>;
};

/** Fields a list of AffectedByIssue can be sorted by */
export enum AffectedByIssueOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type Artefact = AuditedNode & ExtensibleNode & MutableTemplatedNode & Node & TemplatedNode & {
  __typename?: 'Artefact';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** A URL to the file this Artefact references */
  file: Scalars['URL'];
  /** If present, the first line of the file this Artefact references, inclusive */
  from?: Maybe<Scalars['Int']>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Issues which currently have this Artefact. */
  issues: IssueConnection;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** IssueComments which currently reference this Artefact. */
  referencingComments: IssueCommentConnection;
  /** The Template of this Artefact. */
  template: ArtefactTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** If present, the last line of the file this Artefact references, inclusive */
  to?: Maybe<Scalars['Int']>;
  /** The Trackable this Artefact is part of. */
  trackable: Trackable;
  /** If present, the current version of this Artefact */
  version?: Maybe<Scalars['String']>;
};


/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type ArtefactExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type ArtefactExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type ArtefactIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type ArtefactReferencingCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueCommentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueCommentOrder>;
};


/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type ArtefactTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * An Artefact referencing a file defined via a URL.
 *     Can optionally specify a line range (from - to), and a version.
 *     Is part of exactly one Trackable.
 *     Can be referenced by Comments and Issues.
 *     Artefacts are synced to all IMSProjects of the Trackable they are part of.
 *     READ is granted if READ is granted on `trackable`.
 *
 */
export type ArtefactTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for Artefact. */
export type ArtefactConnection = {
  __typename?: 'ArtefactConnection';
  /** A list of all edges of the current page. */
  edges: Array<ArtefactEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Artefact>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ArtefactEdge = {
  __typename?: 'ArtefactEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Artefact;
};

/** Filter used to filter Artefact */
export type ArtefactFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ArtefactFilterInput>>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by file */
  file?: InputMaybe<StringFilterInput>;
  /** Filter by from */
  from?: InputMaybe<NullableIntFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by issues */
  issues?: InputMaybe<IssueListFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ArtefactFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ArtefactFilterInput>>;
  /** Filter by referencingComments */
  referencingComments?: InputMaybe<IssueCommentListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ArtefactTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by to */
  to?: InputMaybe<NullableIntFilterInput>;
  /** Filters for nodes where the related node match this filter */
  trackable?: InputMaybe<TrackableFilterInput>;
  /** Filter by version */
  version?: InputMaybe<NullableStringFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ArtefactListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ArtefactFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ArtefactFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ArtefactFilterInput>;
};

/** Defines the order of a Artefact list */
export type ArtefactOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ArtefactOrderField>;
};

/** Fields a list of Artefact can be sorted by */
export enum ArtefactOrderField {
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by file */
  File = 'FILE',
  /** Order by from */
  From = 'FROM',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT',
  /** Order by to */
  To = 'TO',
  /** Order by version */
  Version = 'VERSION'
}

/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & Template & {
  __typename?: 'ArtefactTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Templates that extend this template. */
  extendedBy: ArtefactTemplateConnection;
  /** Template this template extends. */
  extends: ArtefactTemplateConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: ArtefactConnection;
};


/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplateExtendedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactTemplateOrder>;
};


/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplateExtendsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactTemplateOrder>;
};


/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Artefacts
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ArtefactTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactOrder>;
};

/** The connection type for ArtefactTemplate. */
export type ArtefactTemplateConnection = {
  __typename?: 'ArtefactTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<ArtefactTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ArtefactTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ArtefactTemplateEdge = {
  __typename?: 'ArtefactTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ArtefactTemplate;
};

/** Filter used to filter ArtefactTemplate */
export type ArtefactTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ArtefactTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by extendedBy */
  extendedBy?: InputMaybe<ArtefactTemplateListFilterInput>;
  /** Filter by extends */
  extends?: InputMaybe<ArtefactTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ArtefactTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ArtefactTemplateFilterInput>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ArtefactTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ArtefactTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ArtefactTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ArtefactTemplateFilterInput>;
};

/** Defines the order of a ArtefactTemplate list */
export type ArtefactTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ArtefactTemplateOrderField>;
};

/** Fields a list of ArtefactTemplate can be sorted by */
export enum ArtefactTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Event representing that a User is assigned to an Issue.
 *     An Assignment is only active if it is still in `assignments` on Issue.
 *
 */
export type Assignment = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'Assignment';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The type of Assignment, e.g. REVIEWER. Allowed types are defined by the IssueTemplate. */
  type?: Maybe<AssignmentType>;
  /** The User assigned to the Issue. */
  user: User;
};


/**
 * Event representing that a User is assigned to an Issue.
 *     An Assignment is only active if it is still in `assignments` on Issue.
 *
 */
export type AssignmentExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Event representing that a User is assigned to an Issue.
 *     An Assignment is only active if it is still in `assignments` on Issue.
 *
 */
export type AssignmentExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for Assignment. */
export type AssignmentConnection = {
  __typename?: 'AssignmentConnection';
  /** A list of all edges of the current page. */
  edges: Array<AssignmentEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Assignment>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type AssignmentEdge = {
  __typename?: 'AssignmentEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Assignment;
};

/** Filter used to filter Assignment */
export type AssignmentFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<AssignmentFilterInput>>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<AssignmentFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<AssignmentFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  type?: InputMaybe<AssignmentTypeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  user?: InputMaybe<UserFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AssignmentListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<AssignmentFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<AssignmentFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<AssignmentFilterInput>;
};

/** Defines the order of a Assignment list */
export type AssignmentOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<AssignmentOrderField>;
};

/** Fields a list of Assignment can be sorted by */
export enum AssignmentOrderField {
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT'
}

/**
 * Type for an Assignment, like REVIEWER. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type AssignmentType = ExtensibleNode & Named & NamedNode & Node & {
  __typename?: 'AssignmentType';
  /** Assignments which use this type. */
  assignmentsWithType: AssignmentConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** IssueTemplates this is part of. */
  partOf: IssueTemplateConnection;
};


/**
 * Type for an Assignment, like REVIEWER. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type AssignmentTypeAssignmentsWithTypeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AssignmentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssignmentOrder>;
};


/**
 * Type for an Assignment, like REVIEWER. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type AssignmentTypeExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Type for an Assignment, like REVIEWER. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type AssignmentTypeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Type for an Assignment, like REVIEWER. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type AssignmentTypePartOfArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};

/** The connection type for AssignmentType. */
export type AssignmentTypeConnection = {
  __typename?: 'AssignmentTypeConnection';
  /** A list of all edges of the current page. */
  edges: Array<AssignmentTypeEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<AssignmentType>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type AssignmentTypeEdge = {
  __typename?: 'AssignmentTypeEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: AssignmentType;
};

/** Filter used to filter AssignmentType */
export type AssignmentTypeFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<AssignmentTypeFilterInput>>;
  /** Filter by assignmentsWithType */
  assignmentsWithType?: InputMaybe<AssignmentListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<AssignmentTypeFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<AssignmentTypeFilterInput>>;
  /** Filter by partOf */
  partOf?: InputMaybe<IssueTemplateListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AssignmentTypeListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<AssignmentTypeFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<AssignmentTypeFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<AssignmentTypeFilterInput>;
};

/** Defines the order of a AssignmentType list */
export type AssignmentTypeOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<AssignmentTypeOrderField>;
};

/** Fields a list of AssignmentType can be sorted by */
export enum AssignmentTypeOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * ExtensibleNode which provides auditing information, which can e.g. be used for the sync
 *     When it was created and last modified, if the it is already deleted, and by who it was created and last modified.
 *
 */
export type AuditedNode = {
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/**
 * ExtensibleNode which provides auditing information, which can e.g. be used for the sync
 *     When it was created and last modified, if the it is already deleted, and by who it was created and last modified.
 *
 */
export type AuditedNodeExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * ExtensibleNode which provides auditing information, which can e.g. be used for the sync
 *     When it was created and last modified, if the it is already deleted, and by who it was created and last modified.
 *
 */
export type AuditedNodeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for AuditedNode. */
export type AuditedNodeConnection = {
  __typename?: 'AuditedNodeConnection';
  /** A list of all edges of the current page. */
  edges: Array<AuditedNodeEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<AuditedNode>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type AuditedNodeEdge = {
  __typename?: 'AuditedNodeEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: AuditedNode;
};

/** Filter used to filter AuditedNode */
export type AuditedNodeFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<AuditedNodeFilterInput>>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<AuditedNodeFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<AuditedNodeFilterInput>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AuditedNodeListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<AuditedNodeFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<AuditedNodeFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<AuditedNodeFilterInput>;
};

/** Defines the order of a AuditedNode list */
export type AuditedNodeOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<AuditedNodeOrderField>;
};

/** Fields a list of AuditedNode can be sorted by */
export enum AuditedNodeOrderField {
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT'
}

export type BasePermission = {
  /** If, the permission is granted to all users. Use with caution. */
  allUsers: Scalars['Boolean'];
  /** The description of this entity. */
  description: Scalars['String'];
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** GropiusUsers granted this Permission */
  users: GropiusUserConnection;
};


export type BasePermissionUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GropiusUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GropiusUserOrder>;
};

/** The connection type for BasePermission. */
export type BasePermissionConnection = {
  __typename?: 'BasePermissionConnection';
  /** A list of all edges of the current page. */
  edges: Array<BasePermissionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<BasePermission>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type BasePermissionEdge = {
  __typename?: 'BasePermissionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: BasePermission;
};

/** Filter used to filter BasePermission */
export type BasePermissionFilterInput = {
  /** Filter by allUsers */
  allUsers?: InputMaybe<BooleanFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<BasePermissionFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<BasePermissionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<BasePermissionFilterInput>>;
  /** Filter by users */
  users?: InputMaybe<GropiusUserListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type BasePermissionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<BasePermissionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<BasePermissionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<BasePermissionFilterInput>;
};

/** Defines the order of a BasePermission list */
export type BasePermissionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<BasePermissionOrderField>;
};

/** Fields a list of BasePermission can be sorted by */
export enum BasePermissionOrderField {
  /** Order by allUsers */
  AllUsers = 'ALL_USERS',
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Base type for both Template and SubTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     READ is always granted.
 *
 */
export type BaseTemplate = {
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
};


/**
 * Base type for both Template and SubTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     READ is always granted.
 *
 */
export type BaseTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Base type for both Template and SubTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     READ is always granted.
 *
 */
export type BaseTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Base type for both Template and SubTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     READ is always granted.
 *
 */
export type BaseTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * Main Body of an Issue.
 *     Each Issue has exactly one Body. Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type Body = AuditedNode & Comment & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'Body';
  /** IssueComments which answer this Comment. */
  answeredBy: IssueCommentConnection;
  /**
   * The text of the Comment.
   *         Supports GFM (GitHub Flavored Markdown).
   *         Updates to the body cause lastEditedAt and lastEditedBy to change, while updates to referencedArtefacts
   *         do not.
   *
   */
  body: Scalars['String'];
  /**
   * Keep track when the body of the Comment was last updated.
   *         If not updated yet, the DateTime of creation.
   *
   */
  bodyLastEditedAt: Scalars['DateTime'];
  /**
   * The User who last edited the body of this Comment.
   *         If not edited yet, the creator of the Comment.
   *
   */
  bodyLastEditedBy: User;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/**
 * Main Body of an Issue.
 *     Each Issue has exactly one Body. Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type BodyAnsweredByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueCommentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueCommentOrder>;
};


/**
 * Main Body of an Issue.
 *     Each Issue has exactly one Body. Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type BodyExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Main Body of an Issue.
 *     Each Issue has exactly one Body. Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type BodyExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Filter used to filter Body */
export type BodyFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<BodyFilterInput>>;
  /** Filter by answeredBy */
  answeredBy?: InputMaybe<IssueCommentListFilterInput>;
  /** Filter by body */
  body?: InputMaybe<StringFilterInput>;
  /** Filter by bodyLastEditedAt */
  bodyLastEditedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  bodyLastEditedBy?: InputMaybe<UserFilterInput>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<BodyFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<BodyFilterInput>>;
};

/** Filter which can be used to filter for Nodes with a specific Boolean field */
export type BooleanFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['Boolean']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** Event representing that an Issue was closed. */
export type ClosedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'ClosedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/** Event representing that an Issue was closed. */
export type ClosedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Issue was closed. */
export type ClosedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * Supertype for IssueComment and Body.
 *     Represents a text block in the Timeline.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type Comment = {
  /** IssueComments which answer this Comment. */
  answeredBy: IssueCommentConnection;
  /**
   * The text of the Comment.
   *         Supports GFM (GitHub Flavored Markdown).
   *         Updates to the body cause lastEditedAt and lastEditedBy to change, while updates to referencedArtefacts
   *         do not.
   *
   */
  body: Scalars['String'];
  /**
   * Keep track when the body of the Comment was last updated.
   *         If not updated yet, the DateTime of creation.
   *
   */
  bodyLastEditedAt: Scalars['DateTime'];
  /**
   * The User who last edited the body of this Comment.
   *         If not edited yet, the creator of the Comment.
   *
   */
  bodyLastEditedBy: User;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/**
 * Supertype for IssueComment and Body.
 *     Represents a text block in the Timeline.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type CommentAnsweredByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueCommentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueCommentOrder>;
};


/**
 * Supertype for IssueComment and Body.
 *     Represents a text block in the Timeline.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type CommentExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Supertype for IssueComment and Body.
 *     Represents a text block in the Timeline.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type CommentExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Filter used to filter Comment */
export type CommentFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<CommentFilterInput>>;
  /** Filter by answeredBy */
  answeredBy?: InputMaybe<IssueCommentListFilterInput>;
  /** Filter by body */
  body?: InputMaybe<StringFilterInput>;
  /** Filter by bodyLastEditedAt */
  bodyLastEditedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  bodyLastEditedBy?: InputMaybe<UserFilterInput>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<CommentFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<CommentFilterInput>>;
};

/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type Component = AffectedByIssue & ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & TemplatedNode & Trackable & {
  __typename?: 'Component';
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** Artefacts of this trackable, typically some kind of file. */
  artefacts: ArtefactConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /**
   * List of interfaces this component specifies.
   *         Note that visible/invisible InterfaceSpecifications are defined by a specific version of this component
   *
   */
  interfaceSpecifications: InterfaceSpecificationConnection;
  /**
   * The set of Issues which are part of this Trackable.
   *         An Issue has to be part of a Trackable to use the Labels and Artefacts defined by the Trackable.
   *
   */
  issues: IssueConnection;
  /** The set of Labels which can be added to issues of this trackable. */
  labels: LabelConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Permissions for this Component. */
  permissions: ComponentPermissionConnection;
  /** Issues which are pinned to this trackable, subset of `issues`. */
  pinnedIssues: IssueConnection;
  /** If existing, the URL of the repository (e.g. a GitHub repository). */
  repositoryURL?: Maybe<Scalars['URL']>;
  /** IMSProjects this Trackable is synced to and from. */
  syncsTo: ImsProjectConnection;
  /** The Template of this Component. */
  template: ComponentTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** Versions of this components. */
  versions: ComponentVersionConnection;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentArtefactsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentInterfaceSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentLabelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<LabelFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LabelOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentPermissionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentPermissionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentPermissionOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentPinnedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentSyncsToArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsProjectOrder>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};


/**
 * Entity which represents a software component, e.g. a library, a microservice, or a deployment platform, ....
 *     The type of software component is defined by the template.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     Defines InterfaceSpecifications, but visible/invisible InterfaceSpecificationVersions depend on the ComponentVersion.
 *     Can be affected by Issues.
 *     READ is granted via an associated ComponentPermission or if READ is granted on any Project including any
 *     ComponentVersion in `versions` of this Component.
 *
 */
export type ComponentVersionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentVersionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentVersionOrder>;
};

/** The connection type for Component. */
export type ComponentConnection = {
  __typename?: 'ComponentConnection';
  /** A list of all edges of the current page. */
  edges: Array<ComponentEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Component>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ComponentEdge = {
  __typename?: 'ComponentEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Component;
};

/** Filter used to filter Component */
export type ComponentFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ComponentFilterInput>>;
  /** Filter by artefacts */
  artefacts?: InputMaybe<ArtefactListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by interfaceSpecifications */
  interfaceSpecifications?: InputMaybe<InterfaceSpecificationListFilterInput>;
  /** Filter by issues */
  issues?: InputMaybe<IssueListFilterInput>;
  /** Filter by labels */
  labels?: InputMaybe<LabelListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ComponentFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ComponentFilterInput>>;
  /** Filter by permissions */
  permissions?: InputMaybe<ComponentPermissionListFilterInput>;
  /** Filter by pinnedIssues */
  pinnedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filter by repositoryURL */
  repositoryURL?: InputMaybe<NullableStringFilterInput>;
  /** Filter by syncsTo */
  syncsTo?: InputMaybe<ImsProjectListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ComponentTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by versions */
  versions?: InputMaybe<ComponentVersionListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ComponentFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ComponentFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ComponentFilterInput>;
};

/** Defines the order of a Component list */
export type ComponentOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ComponentOrderField>;
};

/** Fields a list of Component can be sorted by */
export enum ComponentOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/** NodePermission to grant specific permissions to a set of Components. */
export type ComponentPermission = Named & Node & {
  __typename?: 'ComponentPermission';
  /** If, the permission is granted to all users. Use with caution. */
  allUsers: Scalars['Boolean'];
  /** The description of this entity. */
  description: Scalars['String'];
  /** All permissions this Permission grants */
  entries: Array<ComponentPermissionEntry>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** Nodes on which the Permission is granted. */
  nodesWithPermission: ComponentConnection;
  /** GropiusUsers granted this Permission */
  users: GropiusUserConnection;
};


/** NodePermission to grant specific permissions to a set of Components. */
export type ComponentPermissionNodesWithPermissionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentOrder>;
};


/** NodePermission to grant specific permissions to a set of Components. */
export type ComponentPermissionUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GropiusUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GropiusUserOrder>;
};

/** The connection type for ComponentPermission. */
export type ComponentPermissionConnection = {
  __typename?: 'ComponentPermissionConnection';
  /** A list of all edges of the current page. */
  edges: Array<ComponentPermissionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ComponentPermission>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ComponentPermissionEdge = {
  __typename?: 'ComponentPermissionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ComponentPermission;
};

/** ComponentPermission entry enum type. */
export enum ComponentPermissionEntry {
  /**
   * Allows to add the Component to Projects
   * Note: this should be handled very carefully, as adding a Component to a Project gives
   * all users with READ access to the Project READ access to the Component
   */
  AddToProjects = 'ADD_TO_PROJECTS',
  /** Grants all other permissions on the Node except READ. */
  Admin = 'ADMIN',
  /**
   * Allows to create Comments on Issues on this Trackable.
   * Also allows editing of your own Comments.
   */
  Comment = 'COMMENT',
  /**
   * Allows to create new Issues on the Trackable.
   * This includes adding Issues from other Trackables.
   */
  CreateIssues = 'CREATE_ISSUES',
  /** Allows adding Issues on this Trackable to other Trackables. */
  ExportIssues = 'EXPORT_ISSUES',
  /** Allows adding Labels on this Trackable to other Trackables. */
  ExportLabels = 'EXPORT_LABELS',
  /** Allows to link **from** Issues on this Trackable to other Issues (on this or other Trackables). */
  LinkFromIssues = 'LINK_FROM_ISSUES',
  /** Allows to link Issues (on this or other Trackables) **to** Issues on this Trackable.  */
  LinkToIssues = 'LINK_TO_ISSUES',
  /** Allows to add, remove, and update Artefacts on this Trackable. */
  ManageArtefacts = 'MANAGE_ARTEFACTS',
  /**
   * Allows to add, remove, and update IMSProjects on this Trackable.
   * Note: for adding, `IMSPermissionEntry.SYNC_TRACKABLES` is required additionally
   */
  ManageIms = 'MANAGE_IMS',
  /**
   * Allows to manage issues.
   * This includes `CREATE_ISSUES` and `COMMENT`.
   * This does NOT include `LINK_TO_ISSUES` and `LINK_FROM_ISSUES`.
   * Additionaly includes
   *   - change the Template
   *   - add / remove Labels
   *   - add / remove Artefacts
   *   - change any field on the Issue (title, startDate, dueDate, ...)
   *   - change templated fields
   * In contrast to `MODERATOR`, this does not allow editing / removing Comments of other users
   */
  ManageIssues = 'MANAGE_ISSUES',
  /**
   * Allows to add, remove, and update Labels on this Trackable.
   * Also allows to delete a Label, but only if it is allowed on all Trackable the Label is on.
   */
  ManageLabels = 'MANAGE_LABELS',
  /**
   * Allows to moderate Issues on this Trackable.
   * This allows everything `MANAGE_ISSUES` allows.
   * Additionally, it allows editing and deleting Comments of other Users
   */
  Moderator = 'MODERATOR',
  /**
   * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
   * See documentation for specific Node for the specific conditions.
   */
  Read = 'READ',
  /**
   * Allows to create Relations with a version of this Component or an Interface of this Component
   * as start.
   * Note: as these Relations cannot cause new Interfaces on this Component, this can be granted
   * more permissively compared to `RELATE_TO_COMPONENT`.
   */
  RelateFromComponent = 'RELATE_FROM_COMPONENT',
  /**
   * Allows to create Relations with a version of this Component or an Interface of this Component
   * as end.
   * Note: this should be handled carefully, as such Relations can result in new Interfaces
   * on the ComponentVersion.
   */
  RelateToComponent = 'RELATE_TO_COMPONENT'
}

/** Filter used to filter ComponentPermission */
export type ComponentPermissionFilterInput = {
  /** Filter by allUsers */
  allUsers?: InputMaybe<BooleanFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ComponentPermissionFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Filter by nodesWithPermission */
  nodesWithPermission?: InputMaybe<ComponentListFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ComponentPermissionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ComponentPermissionFilterInput>>;
  /** Filter by users */
  users?: InputMaybe<GropiusUserListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentPermissionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ComponentPermissionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ComponentPermissionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ComponentPermissionFilterInput>;
};

/** Defines the order of a ComponentPermission list */
export type ComponentPermissionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ComponentPermissionOrderField>;
};

/** Fields a list of ComponentPermission can be sorted by */
export enum ComponentPermissionOrderField {
  /** Order by allUsers */
  AllUsers = 'ALL_USERS',
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & RelationPartnerTemplate & Template & {
  __typename?: 'ComponentTemplate';
  /** SubTemplate applied to all ComponentVersions of Components with this Template */
  componentVersionTemplate: ComponentVersionTemplate;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Templates that extend this template. */
  extendedBy: ComponentTemplateConnection;
  /** Template this template extends. */
  extends: ComponentTemplateConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** RelationConditions which allow this template for the end of the relation. */
  possibleEndOfRelations: RelationConditionConnection;
  /** Templates of InterfaceSpecifications which can be invisible on Components with this Template. */
  possibleInvisibleInterfaceSpecifications: InterfaceSpecificationTemplateConnection;
  /** RelationConditions which allow this template for the start of the relation. */
  possibleStartOfRelations: RelationConditionConnection;
  /** Templates of InterfaceSpecifications which can be visible on Components with this Template. */
  possibleVisibleInterfaceSpecifications: InterfaceSpecificationTemplateConnection;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: ComponentConnection;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplateExtendedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentTemplateOrder>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplateExtendsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentTemplateOrder>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplatePossibleEndOfRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplatePossibleInvisibleInterfaceSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationTemplateOrder>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplatePossibleStartOfRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplatePossibleVisibleInterfaceSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationTemplateOrder>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Components.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines SubTemplate for ComponentVersions.
 *
 */
export type ComponentTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentOrder>;
};

/** The connection type for ComponentTemplate. */
export type ComponentTemplateConnection = {
  __typename?: 'ComponentTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<ComponentTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ComponentTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ComponentTemplateEdge = {
  __typename?: 'ComponentTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ComponentTemplate;
};

/** Filter used to filter ComponentTemplate */
export type ComponentTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ComponentTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by extendedBy */
  extendedBy?: InputMaybe<ComponentTemplateListFilterInput>;
  /** Filter by extends */
  extends?: InputMaybe<ComponentTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ComponentTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ComponentTemplateFilterInput>>;
  /** Filter by possibleEndOfRelations */
  possibleEndOfRelations?: InputMaybe<RelationConditionListFilterInput>;
  /** Filter by possibleInvisibleInterfaceSpecifications */
  possibleInvisibleInterfaceSpecifications?: InputMaybe<InterfaceSpecificationTemplateListFilterInput>;
  /** Filter by possibleStartOfRelations */
  possibleStartOfRelations?: InputMaybe<RelationConditionListFilterInput>;
  /** Filter by possibleVisibleInterfaceSpecifications */
  possibleVisibleInterfaceSpecifications?: InputMaybe<InterfaceSpecificationTemplateListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ComponentTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ComponentTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ComponentTemplateFilterInput>;
};

/** Defines the order of a ComponentTemplate list */
export type ComponentTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ComponentTemplateOrderField>;
};

/** Fields a list of ComponentTemplate can be sorted by */
export enum ComponentTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersion = AffectedByIssue & ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & RelationPartner & TemplatedNode & Versioned & {
  __typename?: 'ComponentVersion';
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** The Component which defines this ComponentVersions */
  component: Component;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Projects which include this ComponentVersion */
  includingProjects: ProjectConnection;
  /** Relations which use this as the end of the Relation. */
  incomingRelations: RelationConnection;
  /** InterfaceDefinitions on this ComponentVersion. */
  interfaceDefinitions: InterfaceDefinitionConnection;
  /** IntraComponentDependencySpecifications associated with this ComponentVersion */
  intraComponentDependencySpecifications: IntraComponentDependencySpecificationConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Relations which use this as the start of the Relation. */
  outgoingRelations: RelationConnection;
  /** The Template of this ComponentVersion */
  template: ComponentVersionTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** The version of this ComponentVersion */
  version: Scalars['String'];
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionIncludingProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectOrder>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionIncomingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionInterfaceDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceDefinitionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceDefinitionOrder>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionIntraComponentDependencySpecificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IntraComponentDependencySpecificationOrder>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionOutgoingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Version of a component.
 *     Can specifies visible/invisible InterfaceSpecifications.
 *     Can be used in Relations, affected by issues and included by Projects.
 *     READ is granted if READ is granted on `component`.
 *
 */
export type ComponentVersionTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for ComponentVersion. */
export type ComponentVersionConnection = {
  __typename?: 'ComponentVersionConnection';
  /** A list of all edges of the current page. */
  edges: Array<ComponentVersionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ComponentVersion>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ComponentVersionEdge = {
  __typename?: 'ComponentVersionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ComponentVersion;
};

/** Filter used to filter ComponentVersion */
export type ComponentVersionFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ComponentVersionFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  component?: InputMaybe<ComponentFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by includingProjects */
  includingProjects?: InputMaybe<ProjectListFilterInput>;
  /** Filter by incomingRelations */
  incomingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filter by interfaceDefinitions */
  interfaceDefinitions?: InputMaybe<InterfaceDefinitionListFilterInput>;
  /** Filter by intraComponentDependencySpecifications */
  intraComponentDependencySpecifications?: InputMaybe<IntraComponentDependencySpecificationListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ComponentVersionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ComponentVersionFilterInput>>;
  /** Filter by outgoingRelations */
  outgoingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ComponentVersionTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by version */
  version?: InputMaybe<StringFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentVersionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ComponentVersionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ComponentVersionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ComponentVersionFilterInput>;
};

/** Defines the order of a ComponentVersion list */
export type ComponentVersionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ComponentVersionOrderField>;
};

/** Fields a list of ComponentVersion can be sorted by */
export enum ComponentVersionOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME',
  /** Order by version */
  Version = 'VERSION'
}

/**
 * SubTemplate for ComponentVersion.
 *     Part of a ComponentTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ComponentVersionTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'ComponentVersionTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: ComponentTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: ComponentVersionConnection;
};


/**
 * SubTemplate for ComponentVersion.
 *     Part of a ComponentTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ComponentVersionTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for ComponentVersion.
 *     Part of a ComponentTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ComponentVersionTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for ComponentVersion.
 *     Part of a ComponentTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ComponentVersionTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for ComponentVersion.
 *     Part of a ComponentTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ComponentVersionTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentVersionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentVersionOrder>;
};

/** Filter used to filter ComponentVersionTemplate */
export type ComponentVersionTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ComponentVersionTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ComponentVersionTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ComponentVersionTemplateFilterInput>>;
};

/** Input for the createGropiusUser mutation */
export type CreateGropiusUserInput = {
  /** The displayName of the created User */
  displayName: Scalars['String'];
  /** The email of the created User if present */
  email?: InputMaybe<Scalars['String']>;
  /** The initial value of the extension fields */
  extensionFields?: InputMaybe<Array<JsonFieldInput>>;
  /** If true, the created GropiusUser is a global admin */
  isAdmin: Scalars['Boolean'];
  /** The username of the created GropiusUser, must be unique, must match /^[a-zA-Z0-9_-]+$/ */
  username: Scalars['String'];
};

export type CreateGropiusUserPayload = {
  __typename?: 'CreateGropiusUserPayload';
  /** The created GropiusUser */
  gropiusUser?: Maybe<GropiusUser>;
};

/** Input for the createIMSUser mutation */
export type CreateImsUserInput = {
  /** The displayName of the created User */
  displayName: Scalars['String'];
  /** The email of the created User if present */
  email?: InputMaybe<Scalars['String']>;
  /** The initial value of the extension fields */
  extensionFields?: InputMaybe<Array<JsonFieldInput>>;
  /** If present, the id of the GropiusUser the created IMSUser is associated with */
  gropiusUser?: InputMaybe<Scalars['ID']>;
  /** The id of the IMS the created IMSUser is part of */
  ims: Scalars['ID'];
  /** Initial values for all templatedFields */
  templatedFields: Array<JsonFieldInput>;
  /** The username of the created IMSUser, must be unique */
  username?: InputMaybe<Scalars['String']>;
};

export type CreateImsUserPayload = {
  __typename?: 'CreateIMSUserPayload';
  /** The created IMSUser */
  imsuser?: Maybe<ImsUser>;
};

/** Filter which can be used to filter for Nodes with a specific DateTime field */
export type DateTimeFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['DateTime']>;
};

/** Event representing that the due date of an Issue changed. */
export type DueDateChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'DueDateChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new due date. */
  newDueDate?: Maybe<Scalars['DateTime']>;
  /** The old due date. */
  oldDueDate?: Maybe<Scalars['DateTime']>;
};


/** Event representing that the due date of an Issue changed. */
export type DueDateChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the due date of an Issue changed. */
export type DueDateChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that the estimated time of an Issue changed. */
export type EstimatedTimeChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'EstimatedTimeChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new estimated time of the Issue. */
  newEstimatedTime?: Maybe<Scalars['Duration']>;
  /** The old estimated time of the Issue. */
  oldEstimatedTime?: Maybe<Scalars['Duration']>;
};


/** Event representing that the estimated time of an Issue changed. */
export type EstimatedTimeChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the estimated time of an Issue changed. */
export type EstimatedTimeChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Entity which provides dynamic extension fields. */
export type ExtensibleNode = {
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
};


/** Entity which provides dynamic extension fields. */
export type ExtensibleNodeExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Entity which provides dynamic extension fields. */
export type ExtensibleNodeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Filter which can be used to filter for Nodes with a specific Float field */
export type FloatFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['Float']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['Float']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['Float']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['Float']>>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['Float']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['Float']>;
};

/**
 * Permission associated with a set of users.
 *     Can have NodePermissions to grant permissions on specific Nodes.
 *     READ is granted if the global admin is granted.
 *
 */
export type GlobalPermission = Named & Node & {
  __typename?: 'GlobalPermission';
  /** If, the permission is granted to all users. Use with caution. */
  allUsers: Scalars['Boolean'];
  /** The description of this entity. */
  description: Scalars['String'];
  /** All permissions this Permission grants */
  entries: Array<PermissionEntry>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** GropiusUsers granted this Permission */
  users: GropiusUserConnection;
};


/**
 * Permission associated with a set of users.
 *     Can have NodePermissions to grant permissions on specific Nodes.
 *     READ is granted if the global admin is granted.
 *
 */
export type GlobalPermissionUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GropiusUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GropiusUserOrder>;
};

/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUser = ExtensibleNode & Node & User & {
  __typename?: 'GropiusUser';
  /** Assignments the user is part of, this includes assignments which aren't active. */
  assignments: AssignmentConnection;
  /** AuditedNodes the user created. */
  createdNodes: AuditedNodeConnection;
  /** The name which should be displayed for the user. */
  displayName: Scalars['String'];
  /** The email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The IMSUsers linked to this GropiusUser. */
  imsUsers: ImsUserConnection;
  /** True if the user is an admin */
  isAdmin: Scalars['Boolean'];
  /** Issues the user participated in. */
  participatedIssues: IssueConnection;
  /** Permissions the user has. */
  permissions: BasePermissionConnection;
  /** A unique identifier for the GropiusUser. Note that this might not be unique across all Users. */
  username: Scalars['String'];
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserAssignmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AssignmentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssignmentOrder>;
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserCreatedNodesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AuditedNodeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AuditedNodeOrder>;
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserImsUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsUserOrder>;
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserParticipatedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * A user of the Gropius System.
 *     The username can be used as unique identifier for GropiusUsers.
 *     IMSUsers can be linked to a GropiusUser.
 *     Note however that this link does not affect relationships, e.g. if an IMSUser is part of an Assignment,
 *     after the IMSUser was linked to a GropiusUser, the GropiusUser does not link directly to the Assignment.
 *     Therefore, to collect all Assignments, Issue participations etc. it is necessary to also request all
 *     linked IMSUsers and their Assignments etc.
 *
 */
export type GropiusUserPermissionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<BasePermissionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BasePermissionOrder>;
};

/** The connection type for GropiusUser. */
export type GropiusUserConnection = {
  __typename?: 'GropiusUserConnection';
  /** A list of all edges of the current page. */
  edges: Array<GropiusUserEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<GropiusUser>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type GropiusUserEdge = {
  __typename?: 'GropiusUserEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: GropiusUser;
};

/** Filter used to filter GropiusUser */
export type GropiusUserFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<GropiusUserFilterInput>>;
  /** Filter by assignments */
  assignments?: InputMaybe<AssignmentListFilterInput>;
  /** Filter by createdNodes */
  createdNodes?: InputMaybe<AuditedNodeListFilterInput>;
  /** Filter by displayName */
  displayName?: InputMaybe<StringFilterInput>;
  /** Filter by email */
  email?: InputMaybe<NullableStringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by imsUsers */
  imsUsers?: InputMaybe<ImsUserListFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<GropiusUserFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<GropiusUserFilterInput>>;
  /** Filter by participatedIssues */
  participatedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filter by permissions */
  permissions?: InputMaybe<BasePermissionListFilterInput>;
  /** Filter by username */
  username?: InputMaybe<NullableStringFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type GropiusUserListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<GropiusUserFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<GropiusUserFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<GropiusUserFilterInput>;
};

/** Defines the order of a GropiusUser list */
export type GropiusUserOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<GropiusUserOrderField>;
};

/** Fields a list of GropiusUser can be sorted by */
export enum GropiusUserOrderField {
  /** Order by displayName */
  DisplayName = 'DISPLAY_NAME',
  /** Order by email */
  Email = 'EMAIL',
  /** Order by id */
  Id = 'ID'
}

/** Filter which can be used to filter for Nodes with a specific ID field */
export type IdFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['ID']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['ID']>>;
};

/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type Ims = ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & TemplatedNode & {
  __typename?: 'IMS';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** Permissions for this IMS. */
  permissions: ImsPermissionConnection;
  /** Projects which are synced to this IMS. */
  projects: ImsProjectConnection;
  /** The Template of this Component. */
  template: ImsTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** Users of this IMS. */
  users: ImsUserConnection;
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsPermissionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsPermissionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsPermissionOrder>;
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsProjectOrder>;
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};


/**
 * Entity which represents an issue management system (like GitHub, Jira, Redmine, ...).
 *     Trackables can be added to this via an IMSProject, so that their issues are synced to this IMS.
 *     READ is granted via an associated IMSPermission.
 *
 */
export type ImsUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsUserOrder>;
};

/** The connection type for IMS. */
export type ImsConnection = {
  __typename?: 'IMSConnection';
  /** A list of all edges of the current page. */
  edges: Array<ImsEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Ims>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ImsEdge = {
  __typename?: 'IMSEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Ims;
};

/** Filter used to filter IMS */
export type ImsFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsFilterInput>>;
  /** Filter by permissions */
  permissions?: InputMaybe<ImsPermissionListFilterInput>;
  /** Filter by projects */
  projects?: InputMaybe<ImsProjectListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ImsTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by users */
  users?: InputMaybe<ImsUserListFilterInput>;
};

/**
 * Issue on an IMS, represents an Issue synced to an IMS.
 *     The representation of the Issue on the IMS depends on the type of IMS.
 *     READ is granted if read is granted on `issue`.
 *
 */
export type ImsIssue = ExtensibleNode & Node & TemplatedNode & {
  __typename?: 'IMSIssue';
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The IMSProject the issue is synced with. */
  imsProject: ImsProject;
  /** The Issue that is synced by the IMSProject */
  issue: Issue;
  /** The Template of this Component. */
  template: ImsIssueTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/**
 * Issue on an IMS, represents an Issue synced to an IMS.
 *     The representation of the Issue on the IMS depends on the type of IMS.
 *     READ is granted if read is granted on `issue`.
 *
 */
export type ImsIssueExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Issue on an IMS, represents an Issue synced to an IMS.
 *     The representation of the Issue on the IMS depends on the type of IMS.
 *     READ is granted if read is granted on `issue`.
 *
 */
export type ImsIssueExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Issue on an IMS, represents an Issue synced to an IMS.
 *     The representation of the Issue on the IMS depends on the type of IMS.
 *     READ is granted if read is granted on `issue`.
 *
 */
export type ImsIssueTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Issue on an IMS, represents an Issue synced to an IMS.
 *     The representation of the Issue on the IMS depends on the type of IMS.
 *     READ is granted if read is granted on `issue`.
 *
 */
export type ImsIssueTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for IMSIssue. */
export type ImsIssueConnection = {
  __typename?: 'IMSIssueConnection';
  /** A list of all edges of the current page. */
  edges: Array<ImsIssueEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ImsIssue>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ImsIssueEdge = {
  __typename?: 'IMSIssueEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ImsIssue;
};

/** Filter used to filter IMSIssue */
export type ImsIssueFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsIssueFilterInput>>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  imsProject?: InputMaybe<ImsProjectFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsIssueFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsIssueFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ImsIssueTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsIssueListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ImsIssueFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ImsIssueFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ImsIssueFilterInput>;
};

/** Defines the order of a IMSIssue list */
export type ImsIssueOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ImsIssueOrderField>;
};

/** Fields a list of IMSIssue can be sorted by */
export enum ImsIssueOrderField {
  /** Order by id */
  Id = 'ID'
}

/**
 * SubTemplate for IMSIssue.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsIssueTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'IMSIssueTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: ImsTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: ImsIssueConnection;
};


/**
 * SubTemplate for IMSIssue.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsIssueTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for IMSIssue.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsIssueTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for IMSIssue.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsIssueTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for IMSIssue.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsIssueTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsIssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsIssueOrder>;
};

/** Filter used to filter IMSIssueTemplate */
export type ImsIssueTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsIssueTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsIssueTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsIssueTemplateFilterInput>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ImsFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ImsFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ImsFilterInput>;
};

/** Defines the order of a IMS list */
export type ImsOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ImsOrderField>;
};

/** Fields a list of IMS can be sorted by */
export enum ImsOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/** NodePermission to grant specific permissions to a set of IMSs. */
export type ImsPermission = Named & Node & {
  __typename?: 'IMSPermission';
  /** If, the permission is granted to all users. Use with caution. */
  allUsers: Scalars['Boolean'];
  /** The description of this entity. */
  description: Scalars['String'];
  /** All permissions this Permission grants */
  entries: Array<ImsPermissionEntry>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** Nodes on which the Permission is granted. */
  nodesWithPermission: ImsConnection;
  /** GropiusUsers granted this Permission */
  users: GropiusUserConnection;
};


/** NodePermission to grant specific permissions to a set of IMSs. */
export type ImsPermissionNodesWithPermissionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsOrder>;
};


/** NodePermission to grant specific permissions to a set of IMSs. */
export type ImsPermissionUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GropiusUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GropiusUserOrder>;
};

/** The connection type for IMSPermission. */
export type ImsPermissionConnection = {
  __typename?: 'IMSPermissionConnection';
  /** A list of all edges of the current page. */
  edges: Array<ImsPermissionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ImsPermission>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ImsPermissionEdge = {
  __typename?: 'IMSPermissionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ImsPermission;
};

/** IMSPermission entry enum type. */
export enum ImsPermissionEntry {
  /** Grants all other permissions on the Node except READ. */
  Admin = 'ADMIN',
  /**
   * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
   * See documentation for specific Node for the specific conditions.
   */
  Read = 'READ',
  /** Allows to create IMSProjects with this IMS. */
  SyncTrackables = 'SYNC_TRACKABLES'
}

/** Filter used to filter IMSPermission */
export type ImsPermissionFilterInput = {
  /** Filter by allUsers */
  allUsers?: InputMaybe<BooleanFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsPermissionFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Filter by nodesWithPermission */
  nodesWithPermission?: InputMaybe<ImsListFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsPermissionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsPermissionFilterInput>>;
  /** Filter by users */
  users?: InputMaybe<GropiusUserListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsPermissionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ImsPermissionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ImsPermissionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ImsPermissionFilterInput>;
};

/** Defines the order of a IMSPermission list */
export type ImsPermissionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ImsPermissionOrderField>;
};

/** Fields a list of IMSPermission can be sorted by */
export enum ImsPermissionOrderField {
  /** Order by allUsers */
  AllUsers = 'ALL_USERS',
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProject = ExtensibleNode & MutableTemplatedNode & Node & TemplatedNode & {
  __typename?: 'IMSProject';
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The IMS this project is a part of. */
  ims?: Maybe<Ims>;
  /** The IMSIssues synced to by this project. */
  imsIssues: ImsIssueConnection;
  /** Issues which are currently partially synced with this IMSProject */
  partiallySyncedIssues: IssueConnection;
  /** The Template of this Component. */
  template: ImsProjectTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** The trackable which is synced. */
  trackable: Trackable;
};


/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProjectExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProjectExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProjectImsIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsIssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsIssueOrder>;
};


/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProjectPartiallySyncedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProjectTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Project on an IMS, represents a Trackable synced to an IMS.
 *     The representation on the IMS depends on the type of IMS, e.g. for GitHub, a project is a repository.
 *     READ is granted if READ is granted on `trackable` or `ims`.
 *
 */
export type ImsProjectTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for IMSProject. */
export type ImsProjectConnection = {
  __typename?: 'IMSProjectConnection';
  /** A list of all edges of the current page. */
  edges: Array<ImsProjectEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ImsProject>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ImsProjectEdge = {
  __typename?: 'IMSProjectEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ImsProject;
};

/** Filter used to filter IMSProject */
export type ImsProjectFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsProjectFilterInput>>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  ims?: InputMaybe<ImsFilterInput>;
  /** Filter by imsIssues */
  imsIssues?: InputMaybe<ImsIssueListFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsProjectFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsProjectFilterInput>>;
  /** Filter by partiallySyncedIssues */
  partiallySyncedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ImsProjectTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filters for nodes where the related node match this filter */
  trackable?: InputMaybe<TrackableFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsProjectListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ImsProjectFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ImsProjectFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ImsProjectFilterInput>;
};

/** Defines the order of a IMSProject list */
export type ImsProjectOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ImsProjectOrderField>;
};

/** Fields a list of IMSProject can be sorted by */
export enum ImsProjectOrderField {
  /** Order by id */
  Id = 'ID'
}

/**
 * SubTemplate for IMSProject.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsProjectTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'IMSProjectTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: ImsTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: ImsProjectConnection;
};


/**
 * SubTemplate for IMSProject.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsProjectTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for IMSProject.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsProjectTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for IMSProject.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsProjectTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for IMSProject.
 *     Part of a IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsProjectTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsProjectOrder>;
};

/** Filter used to filter IMSProjectTemplate */
export type ImsProjectTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsProjectTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsProjectTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsProjectTemplateFilterInput>>;
};

/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & Template & {
  __typename?: 'IMSTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Templates that extend this template. */
  extendedBy: ImsTemplateConnection;
  /** Template this template extends. */
  extends: ImsTemplateConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** SubTemplate applied to all IMSIssues with this Template */
  imsIssueTemplate: ImsIssueTemplate;
  /** SubTemplate applied to all IMSProjects with this Template */
  imsProjectTemplate: ImsProjectTemplate;
  /** SubTemplate applied to all IMSUsers with this Template */
  imsUserTemplate: ImsUserTemplate;
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: ImsConnection;
};


/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplateExtendedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsTemplateOrder>;
};


/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplateExtendsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsTemplateOrder>;
};


/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for imss
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsOrder>;
};

/** The connection type for IMSTemplate. */
export type ImsTemplateConnection = {
  __typename?: 'IMSTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<ImsTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ImsTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ImsTemplateEdge = {
  __typename?: 'IMSTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ImsTemplate;
};

/** Filter used to filter IMSTemplate */
export type ImsTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by extendedBy */
  extendedBy?: InputMaybe<ImsTemplateListFilterInput>;
  /** Filter by extends */
  extends?: InputMaybe<ImsTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsTemplateFilterInput>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ImsTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ImsTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ImsTemplateFilterInput>;
};

/** Defines the order of a IMSTemplate list */
export type ImsTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ImsTemplateOrderField>;
};

/** Fields a list of IMSTemplate can be sorted by */
export enum ImsTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUser = ExtensibleNode & Node & TemplatedNode & User & {
  __typename?: 'IMSUser';
  /** Assignments the user is part of, this includes assignments which aren't active. */
  assignments: AssignmentConnection;
  /** AuditedNodes the user created. */
  createdNodes: AuditedNodeConnection;
  /** The name which should be displayed for the user. */
  displayName: Scalars['String'];
  /** The email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The GropiusUser this IMSUser is linked to. An IMSUser might be linked to no GropiusUser. */
  gropiusUser?: Maybe<GropiusUser>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The IMS this user is part of. */
  ims: Ims;
  /** Issues the user participated in. */
  participatedIssues: IssueConnection;
  /** The Template of this IMSUser */
  template: ImsUserTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** The username of the IMSUser. Synced from the IMS this user is part of. Might not be unique. */
  username?: Maybe<Scalars['String']>;
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserAssignmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AssignmentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssignmentOrder>;
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserCreatedNodesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AuditedNodeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AuditedNodeOrder>;
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserParticipatedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * A user an IMS.
 *     This user might be linked to a GropiusUser.
 *     Note that this link can change at any time.
 *     The username might not be unique.
 *     It is possible that this user never heard of Gropius, and is only known to the system due to sync adapters.
 *
 */
export type ImsUserTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for IMSUser. */
export type ImsUserConnection = {
  __typename?: 'IMSUserConnection';
  /** A list of all edges of the current page. */
  edges: Array<ImsUserEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ImsUser>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ImsUserEdge = {
  __typename?: 'IMSUserEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ImsUser;
};

/** Filter used to filter IMSUser */
export type ImsUserFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsUserFilterInput>>;
  /** Filter by assignments */
  assignments?: InputMaybe<AssignmentListFilterInput>;
  /** Filter by createdNodes */
  createdNodes?: InputMaybe<AuditedNodeListFilterInput>;
  /** Filter by displayName */
  displayName?: InputMaybe<StringFilterInput>;
  /** Filter by email */
  email?: InputMaybe<NullableStringFilterInput>;
  /** Filters for nodes where the related node match this filter */
  gropiusUser?: InputMaybe<GropiusUserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  ims?: InputMaybe<ImsFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsUserFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsUserFilterInput>>;
  /** Filter by participatedIssues */
  participatedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<ImsUserTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by username */
  username?: InputMaybe<NullableStringFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsUserListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ImsUserFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ImsUserFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ImsUserFilterInput>;
};

/** Defines the order of a IMSUser list */
export type ImsUserOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ImsUserOrderField>;
};

/** Fields a list of IMSUser can be sorted by */
export enum ImsUserOrderField {
  /** Order by displayName */
  DisplayName = 'DISPLAY_NAME',
  /** Order by email */
  Email = 'EMAIL',
  /** Order by id */
  Id = 'ID'
}

/**
 * SubTemplate for IMSUser.
 *     Part of an IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsUserTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'IMSUserTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: InterfaceSpecificationTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: InterfaceConnection;
};


/**
 * SubTemplate for IMSUser.
 *     Part of an IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsUserTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for IMSUser.
 *     Part of an IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsUserTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for IMSUser.
 *     Part of an IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsUserTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for IMSUser.
 *     Part of an IMSTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type ImsUserTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceOrder>;
};

/** Filter used to filter IMSUserTemplate */
export type ImsUserTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ImsUserTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ImsUserTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ImsUserTemplateFilterInput>>;
};

/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type Interface = AffectedByIssue & ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & RelationPartner & TemplatedNode & {
  __typename?: 'Interface';
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Relations which use this as the end of the Relation. */
  incomingRelations: RelationConnection;
  /** The definition of this interface. */
  interfaceDefinition: InterfaceDefinition;
  /** Participants of IntraComponentDependencySpecifications where this is used. */
  intraComponentDependencyParticipants: IntraComponentDependencyParticipantConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Relations which use this as the start of the Relation. */
  outgoingRelations: RelationConnection;
  /** The Template of this Interface. */
  template: InterfaceTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceIncomingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceIntraComponentDependencyParticipantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IntraComponentDependencyParticipantOrder>;
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceOutgoingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * An interface which is part of a specific ComponentVersion.
 *     Its semantics depend on the InterfaceSpecification it is specified by, e.g. an Interface can represent a REST API.
 *     Can be used in Relations and affected by Issues.
 *     READ is granted if READ is granted on `interfaceDefinition`.
 *
 */
export type InterfaceTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for Interface. */
export type InterfaceConnection = {
  __typename?: 'InterfaceConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfaceEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Interface>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinition = ExtensibleNode & MutableTemplatedNode & Node & TemplatedNode & {
  __typename?: 'InterfaceDefinition';
  /** The ComponentVersion using the InterfaceSpecificationVersion */
  componentVersion: ComponentVersion;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The InterfaceSpecificationVersion present on the ComponentVersion */
  interfaceSpecificationVersion: InterfaceSpecificationVersion;
  /** Relations because of which `interfaceSpecificationVersion` is invisible derived on `componentVersion` */
  invisibleDerivedBy: RelationConnection;
  /** If true, `interfaceSpecificationVersion`is self-defined invisible on the `componentVersion` */
  invisibleSelfDefined: Scalars['Boolean'];
  /** The Template of this InterfaceDefinition. */
  template: InterfaceDefinitionTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** Relations because of which `interfaceSpecificationVersion` is visible derived on `componentVersion` */
  visibleDerivedBy: RelationConnection;
  /** If visible, the created Interface */
  visibleInterface?: Maybe<Interface>;
  /** If true, `interfaceSpecificationVersion`is self-defined visible on the `componentVersion` */
  visibleSelfDefined: Scalars['Boolean'];
};


/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinitionExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinitionExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinitionInvisibleDerivedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinitionTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinitionTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};


/**
 * InterfaceDefinition on a ComponentVersion
 *     Specifies if it is visible/invisible self-defined.
 *     Specifies if it is visible/invisible derived (and by which Relations)
 *     READ is granted if READ is granted on `componentVersion`
 *
 */
export type InterfaceDefinitionVisibleDerivedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};

/** The connection type for InterfaceDefinition. */
export type InterfaceDefinitionConnection = {
  __typename?: 'InterfaceDefinitionConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfaceDefinitionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<InterfaceDefinition>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type InterfaceDefinitionEdge = {
  __typename?: 'InterfaceDefinitionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: InterfaceDefinition;
};

/** Filter used to filter InterfaceDefinition */
export type InterfaceDefinitionFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceDefinitionFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  componentVersion?: InputMaybe<ComponentVersionFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  interfaceSpecificationVersion?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  /** Filter by invisibleDerivedBy */
  invisibleDerivedBy?: InputMaybe<RelationListFilterInput>;
  /** Filter by invisibleSelfDefined */
  invisibleSelfDefined?: InputMaybe<BooleanFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceDefinitionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceDefinitionFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<InterfaceDefinitionTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by visibleDerivedBy */
  visibleDerivedBy?: InputMaybe<RelationListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  visibleInterface?: InputMaybe<InterfaceFilterInput>;
  /** Filter by visibleSelfDefined */
  visibleSelfDefined?: InputMaybe<BooleanFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceDefinitionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<InterfaceDefinitionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<InterfaceDefinitionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<InterfaceDefinitionFilterInput>;
};

/** Defines the order of a InterfaceDefinition list */
export type InterfaceDefinitionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfaceDefinitionOrderField>;
};

/** Fields a list of InterfaceDefinition can be sorted by */
export enum InterfaceDefinitionOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by invisibleSelfDefined */
  InvisibleSelfDefined = 'INVISIBLE_SELF_DEFINED',
  /** Order by visibleSelfDefined */
  VisibleSelfDefined = 'VISIBLE_SELF_DEFINED'
}

/**
 * SubTemplate for InterfaceDefinition.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceDefinitionTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'InterfaceDefinitionTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: InterfaceSpecificationTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: InterfaceDefinitionConnection;
};


/**
 * SubTemplate for InterfaceDefinition.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceDefinitionTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for InterfaceDefinition.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceDefinitionTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for InterfaceDefinition.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceDefinitionTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for InterfaceDefinition.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceDefinitionTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceDefinitionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceDefinitionOrder>;
};

/** Filter used to filter InterfaceDefinitionTemplate */
export type InterfaceDefinitionTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceDefinitionTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceDefinitionTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceDefinitionTemplateFilterInput>>;
};

/** An edge in a connection. */
export type InterfaceEdge = {
  __typename?: 'InterfaceEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Interface;
};

/** Filter used to filter Interface */
export type InterfaceFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by incomingRelations */
  incomingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  interfaceDefinition?: InputMaybe<InterfaceDefinitionFilterInput>;
  /** Filter by intraComponentDependencyParticipants */
  intraComponentDependencyParticipants?: InputMaybe<IntraComponentDependencyParticipantListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceFilterInput>>;
  /** Filter by outgoingRelations */
  outgoingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<InterfaceTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
};

/** Defines the order of a Interface list */
export type InterfaceOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfaceOrderField>;
};

/** Fields a list of Interface can be sorted by */
export enum InterfaceOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePart = AffectedByIssue & ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & TemplatedNode & {
  __typename?: 'InterfacePart';
  /** InterfaceSpecificationVersions where this InterfacePart is active. */
  activeOn: InterfaceSpecificationVersionConnection;
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** InterfaceSpecification which defines this InterfacePart */
  definedOn: InterfaceSpecification;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Relations which include this InterfacePart at the end of the Relation */
  includingIncomingRelations: RelationConnection;
  /** Participants of IntraComponentDependencySpecifications where this is used as included part. */
  includingIntraComponentDependencyParticipants: IntraComponentDependencyParticipantConnection;
  /** Relations which include this InterfacePart at the start of the Relation */
  includingOutgoingRelations: RelationConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template of this InterfacePart */
  template: InterfacePartTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartActiveOnArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationVersionOrder>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartIncludingIncomingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartIncludingIntraComponentDependencyParticipantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IntraComponentDependencyParticipantOrder>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartIncludingOutgoingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Part of an Interface(Specification).
 *     Its semantics depend on the InterfaceSpecification, e.g. for a REST API interface,
 *     this could represent a single endpoint of the API.
 *     Relations can specify for both start and end included InterfaceParts.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     READ is granted if READ is granted on `definedOn`.
 *
 */
export type InterfacePartTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for InterfacePart. */
export type InterfacePartConnection = {
  __typename?: 'InterfacePartConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfacePartEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<InterfacePart>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type InterfacePartEdge = {
  __typename?: 'InterfacePartEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: InterfacePart;
};

/** Filter used to filter InterfacePart */
export type InterfacePartFilterInput = {
  /** Filter by activeOn */
  activeOn?: InputMaybe<InterfaceSpecificationVersionListFilterInput>;
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfacePartFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  definedOn?: InputMaybe<InterfaceSpecificationFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by includingIncomingRelations */
  includingIncomingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filter by includingIntraComponentDependencyParticipants */
  includingIntraComponentDependencyParticipants?: InputMaybe<IntraComponentDependencyParticipantListFilterInput>;
  /** Filter by includingOutgoingRelations */
  includingOutgoingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfacePartFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfacePartFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<InterfacePartTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfacePartListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<InterfacePartFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<InterfacePartFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<InterfacePartFilterInput>;
};

/** Defines the order of a InterfacePart list */
export type InterfacePartOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfacePartOrderField>;
};

/** Fields a list of InterfacePart can be sorted by */
export enum InterfacePartOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * SubTemplate for InterfacePart.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfacePartTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'InterfacePartTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: InterfaceSpecificationTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: InterfacePartConnection;
};


/**
 * SubTemplate for InterfacePart.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfacePartTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for InterfacePart.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfacePartTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for InterfacePart.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfacePartTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for InterfacePart.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfacePartTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfacePartFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfacePartOrder>;
};

/** Filter used to filter InterfacePartTemplate */
export type InterfacePartTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfacePartTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfacePartTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfacePartTemplateFilterInput>>;
};

/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecification = AffectedByIssue & ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & TemplatedNode & {
  __typename?: 'InterfaceSpecification';
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** The Component this InterfaceSpecificaton is part of. */
  component: Component;
  /**
   * InterfaceParts defined by this InterfaceSpecification.
   *         Note that active parts depend on the InterfaceSpecificationVersion
   *
   */
  definedParts: InterfacePartConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template of this InterfaceSpecification. */
  template: InterfaceSpecificationTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** Versions of this InterfaceSpecification. */
  versions: InterfaceSpecificationVersionConnection;
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationDefinedPartsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfacePartFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfacePartOrder>;
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};


/**
 * Specification of an Interface.
 *     Defined on a Component, but can be visible and invisible on different ComponentVersions.
 *     Can be affected by Issues, and be used as start / end of ServiceEffectSpecifications.
 *     Defines InterfaceParts, but active parts depend on the InterfaceSpecificationVersion.
 *     READ is granted if READ is granted on `component`, or any InterfaceSpecificationVersion in `versions`.
 *
 */
export type InterfaceSpecificationVersionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationVersionOrder>;
};

/** The connection type for InterfaceSpecification. */
export type InterfaceSpecificationConnection = {
  __typename?: 'InterfaceSpecificationConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfaceSpecificationEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<InterfaceSpecification>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/**
 * Defines which InterfaceSpecifications are derived under which conditions by a Relation.
 *     Part of a RelationCondition, which is part of RelationTemplates.
 *     READ is always granted.
 *
 */
export type InterfaceSpecificationDerivationCondition = ExtensibleNode & Node & {
  __typename?: 'InterfaceSpecificationDerivationCondition';
  /** Templates of InterfaceSpecifications which are derived. */
  derivableInterfaceSpecifications: InterfaceSpecificationTemplateConnection;
  /** If true, invisible derived InterfaceSpecifications are derived */
  derivesInvisibleDerived: Scalars['Boolean'];
  /** If true, invisible self-defined InterfaceSpecifications are derived */
  derivesInvisibleSelfDefined: Scalars['Boolean'];
  /** If true, visible derived InterfaceSpecifications are derived */
  derivesVisibleDerived: Scalars['Boolean'];
  /** If true, visible self-defined InterfaceSpecifications are derived */
  derivesVisibleSelfDefined: Scalars['Boolean'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true InterfaceSpecifications are invisible derived */
  isInvisibleDerived: Scalars['Boolean'];
  /** If true InterfaceSpecifications are visible derived */
  isVisibleDerived: Scalars['Boolean'];
  /** The RelationCondition this is part of. */
  partOf: RelationCondition;
};


/**
 * Defines which InterfaceSpecifications are derived under which conditions by a Relation.
 *     Part of a RelationCondition, which is part of RelationTemplates.
 *     READ is always granted.
 *
 */
export type InterfaceSpecificationDerivationConditionDerivableInterfaceSpecificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationTemplateOrder>;
};


/**
 * Defines which InterfaceSpecifications are derived under which conditions by a Relation.
 *     Part of a RelationCondition, which is part of RelationTemplates.
 *     READ is always granted.
 *
 */
export type InterfaceSpecificationDerivationConditionExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Defines which InterfaceSpecifications are derived under which conditions by a Relation.
 *     Part of a RelationCondition, which is part of RelationTemplates.
 *     READ is always granted.
 *
 */
export type InterfaceSpecificationDerivationConditionExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for InterfaceSpecificationDerivationCondition. */
export type InterfaceSpecificationDerivationConditionConnection = {
  __typename?: 'InterfaceSpecificationDerivationConditionConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfaceSpecificationDerivationConditionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<InterfaceSpecificationDerivationCondition>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type InterfaceSpecificationDerivationConditionEdge = {
  __typename?: 'InterfaceSpecificationDerivationConditionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: InterfaceSpecificationDerivationCondition;
};

/** Filter used to filter InterfaceSpecificationDerivationCondition */
export type InterfaceSpecificationDerivationConditionFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceSpecificationDerivationConditionFilterInput>>;
  /** Filter by derivableInterfaceSpecifications */
  derivableInterfaceSpecifications?: InputMaybe<InterfaceSpecificationTemplateListFilterInput>;
  /** Filter by derivesInvisibleDerived */
  derivesInvisibleDerived?: InputMaybe<BooleanFilterInput>;
  /** Filter by derivesInvisibleSelfDefined */
  derivesInvisibleSelfDefined?: InputMaybe<BooleanFilterInput>;
  /** Filter by derivesVisibleDerived */
  derivesVisibleDerived?: InputMaybe<BooleanFilterInput>;
  /** Filter by derivesVisibleSelfDefined */
  derivesVisibleSelfDefined?: InputMaybe<BooleanFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isInvisibleDerived */
  isInvisibleDerived?: InputMaybe<BooleanFilterInput>;
  /** Filter by isVisibleDerived */
  isVisibleDerived?: InputMaybe<BooleanFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceSpecificationDerivationConditionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceSpecificationDerivationConditionFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  partOf?: InputMaybe<RelationConditionFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationDerivationConditionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<InterfaceSpecificationDerivationConditionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<InterfaceSpecificationDerivationConditionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<InterfaceSpecificationDerivationConditionFilterInput>;
};

/** Defines the order of a InterfaceSpecificationDerivationCondition list */
export type InterfaceSpecificationDerivationConditionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfaceSpecificationDerivationConditionOrderField>;
};

/** Fields a list of InterfaceSpecificationDerivationCondition can be sorted by */
export enum InterfaceSpecificationDerivationConditionOrderField {
  /** Order by id */
  Id = 'ID'
}

/** An edge in a connection. */
export type InterfaceSpecificationEdge = {
  __typename?: 'InterfaceSpecificationEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: InterfaceSpecification;
};

/** Filter used to filter InterfaceSpecification */
export type InterfaceSpecificationFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceSpecificationFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  component?: InputMaybe<ComponentFilterInput>;
  /** Filter by definedParts */
  definedParts?: InputMaybe<InterfacePartListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceSpecificationFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceSpecificationFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by versions */
  versions?: InputMaybe<InterfaceSpecificationVersionListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<InterfaceSpecificationFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<InterfaceSpecificationFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<InterfaceSpecificationFilterInput>;
};

/** Defines the order of a InterfaceSpecification list */
export type InterfaceSpecificationOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfaceSpecificationOrderField>;
};

/** Fields a list of InterfaceSpecification can be sorted by */
export enum InterfaceSpecificationOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & RelationPartnerTemplate & Template & {
  __typename?: 'InterfaceSpecificationTemplate';
  /** Templates of Components InterfaceSpecifications with this template can be invisible on. */
  canBeInvisibleOnComponents: ComponentTemplateConnection;
  /** Templates of Components InterfaceSpecifications with this template can be visible on. */
  canBeVisibleOnComponents: ComponentTemplateConnection;
  /**
   * InterfaceSpecificationDerivationConditions which allow to derive InterfaceSpecification with this template.
   *
   */
  derivableBy: InterfaceSpecificationDerivationConditionConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Templates that extend this template. */
  extendedBy: InterfaceSpecificationTemplateConnection;
  /** Template this template extends. */
  extends: InterfaceSpecificationTemplateConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /**
   * SubTemplate applied to all InterfaceDefinitions of InterfaceSpecifications with this Template.
   *
   */
  interfaceDefinitionTemplate: InterfaceDefinitionTemplate;
  /**
   * SubTemplate applied to all InterfaceParts of InterfaceSpecifications with this Template.
   *
   */
  interfacePartTemplate: InterfacePartTemplate;
  /**
   * SubTemplate applied to all InterfaceSpecificationVersions of InterfaceSpecifications with this Template.
   *
   */
  interfaceSpecificationVersionTemplate: InterfaceSpecificationVersionTemplate;
  /**
   * SubTemplate applied to all Interfaces of InterfaceSpecifications with this Template.
   *
   */
  interfaceTemplate: InterfaceTemplate;
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** RelationConditions which allow this template for the end of the relation. */
  possibleEndOfRelations: RelationConditionConnection;
  /** RelationConditions which allow this template for the start of the relation. */
  possibleStartOfRelations: RelationConditionConnection;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: InterfaceSpecificationConnection;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateCanBeInvisibleOnComponentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentTemplateOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateCanBeVisibleOnComponentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentTemplateOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateDerivableByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationDerivationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationDerivationConditionOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateExtendedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationTemplateOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateExtendsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationTemplateOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplatePossibleEndOfRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplatePossibleStartOfRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for InterfaceSpecifications.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines on which Components InterfaceSpecifications with this Template can be (in)visible on.
 *     Defines SubTemplates for Interfaces and InterfaceSpecificationVersions.
 *
 */
export type InterfaceSpecificationTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationOrder>;
};

/** The connection type for InterfaceSpecificationTemplate. */
export type InterfaceSpecificationTemplateConnection = {
  __typename?: 'InterfaceSpecificationTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfaceSpecificationTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<InterfaceSpecificationTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type InterfaceSpecificationTemplateEdge = {
  __typename?: 'InterfaceSpecificationTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: InterfaceSpecificationTemplate;
};

/** Filter used to filter InterfaceSpecificationTemplate */
export type InterfaceSpecificationTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceSpecificationTemplateFilterInput>>;
  /** Filter by canBeInvisibleOnComponents */
  canBeInvisibleOnComponents?: InputMaybe<ComponentTemplateListFilterInput>;
  /** Filter by canBeVisibleOnComponents */
  canBeVisibleOnComponents?: InputMaybe<ComponentTemplateListFilterInput>;
  /** Filter by derivableBy */
  derivableBy?: InputMaybe<InterfaceSpecificationDerivationConditionListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by extendedBy */
  extendedBy?: InputMaybe<InterfaceSpecificationTemplateListFilterInput>;
  /** Filter by extends */
  extends?: InputMaybe<InterfaceSpecificationTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceSpecificationTemplateFilterInput>>;
  /** Filter by possibleEndOfRelations */
  possibleEndOfRelations?: InputMaybe<RelationConditionListFilterInput>;
  /** Filter by possibleStartOfRelations */
  possibleStartOfRelations?: InputMaybe<RelationConditionListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
};

/** Defines the order of a InterfaceSpecificationTemplate list */
export type InterfaceSpecificationTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfaceSpecificationTemplateOrderField>;
};

/** Fields a list of InterfaceSpecificationTemplate can be sorted by */
export enum InterfaceSpecificationTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersion = AffectedByIssue & ExtensibleNode & MutableTemplatedNode & Named & NamedNode & Node & TemplatedNode & Versioned & {
  __typename?: 'InterfaceSpecificationVersion';
  /**
   * InterfaceParts which are active on this InterfaceSpecificationVersion
   *         Semantically, only the active parts on an InterfaceSpecificationVersion exist on the Interfaces
   *         defined by the InterfaceSpecificationVersion.
   *
   */
  activeParts: InterfacePartConnection;
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Defines on which ComponentVersions this InterfaceSpecificationVersion is used */
  interfaceDefinitions: InterfaceDefinitionConnection;
  /** The InterfaceSpecification this is part of. */
  interfaceSpecification: InterfaceSpecification;
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template of this InterfaceSpecificationVersion */
  template: InterfaceSpecificationVersionTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** The version of this InterfaceSpecificationVersion. */
  version: Scalars['String'];
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionActivePartsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfacePartFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfacePartOrder>;
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionInterfaceDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceDefinitionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceDefinitionOrder>;
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * A specific version of an InterfaceSpecification.
 *     Defines which InterfaceParts are active.
 *     Can be both visible (generates an Interface) and invisible (does not generate an Interface)
 *     on different Components.
 *     Can be derived by Relations, and affected by Issues.
 *     READ is granted if READ is granted on `interfaceSpecification`,
 *     or any InterfaceDefinition in `definitions`
 *
 */
export type InterfaceSpecificationVersionTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** The connection type for InterfaceSpecificationVersion. */
export type InterfaceSpecificationVersionConnection = {
  __typename?: 'InterfaceSpecificationVersionConnection';
  /** A list of all edges of the current page. */
  edges: Array<InterfaceSpecificationVersionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<InterfaceSpecificationVersion>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type InterfaceSpecificationVersionEdge = {
  __typename?: 'InterfaceSpecificationVersionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: InterfaceSpecificationVersion;
};

/** Filter used to filter InterfaceSpecificationVersion */
export type InterfaceSpecificationVersionFilterInput = {
  /** Filter by activeParts */
  activeParts?: InputMaybe<InterfacePartListFilterInput>;
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceSpecificationVersionFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by interfaceDefinitions */
  interfaceDefinitions?: InputMaybe<InterfaceDefinitionListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  interfaceSpecification?: InputMaybe<InterfaceSpecificationFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceSpecificationVersionFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<InterfaceSpecificationVersionTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by version */
  version?: InputMaybe<StringFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationVersionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
};

/** Defines the order of a InterfaceSpecificationVersion list */
export type InterfaceSpecificationVersionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<InterfaceSpecificationVersionOrderField>;
};

/** Fields a list of InterfaceSpecificationVersion can be sorted by */
export enum InterfaceSpecificationVersionOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME',
  /** Order by version */
  Version = 'VERSION'
}

/**
 * SubTemplate for InterfaceSpecificationVersion.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfaceSpecificationVersionTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'InterfaceSpecificationVersionTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: InterfaceSpecificationTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: InterfaceSpecificationVersionConnection;
};


/**
 * SubTemplate for InterfaceSpecificationVersion.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfaceSpecificationVersionTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for InterfaceSpecificationVersion.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfaceSpecificationVersionTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for InterfaceSpecificationVersion.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfaceSpecificationVersionTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for InterfaceSpecificationVersion.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type InterfaceSpecificationVersionTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationVersionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationVersionOrder>;
};

/** Filter used to filter InterfaceSpecificationVersionTemplate */
export type InterfaceSpecificationVersionTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceSpecificationVersionTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceSpecificationVersionTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceSpecificationVersionTemplateFilterInput>>;
};

/**
 * SubTemplate for Interface.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & SubTemplate & {
  __typename?: 'InterfaceTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** The Template this SubTemplate is part of */
  partOf: InterfaceSpecificationTemplate;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: InterfaceConnection;
};


/**
 * SubTemplate for Interface.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * SubTemplate for Interface.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for Interface.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * SubTemplate for Interface.
 *     Part of a InterfaceSpecificationTemplate.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     All templatedFieldSpecifications must allow `null` as value.
 *
 */
export type InterfaceTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceOrder>;
};

/** Filter used to filter InterfaceTemplate */
export type InterfaceTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<InterfaceTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<InterfaceTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<InterfaceTemplateFilterInput>>;
};

/**
 * Participant of a a IntraComponentDependencySpecification
 *     Consists of an Interface it refers to, and optionally a subset of its active InterfaceParts.
 *     READ is granted if READ is granted on the associated ComponentVersion
 *
 */
export type IntraComponentDependencyParticipant = ExtensibleNode & Node & {
  __typename?: 'IntraComponentDependencyParticipant';
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /**
   * If not empty, the InterfaceParts this IntraComponentDependencyParticipant refers to
   *         Otherwise, it refers to the referenced `interface` in general.
   *         Must all be active on `interface`.
   *
   */
  includedParts: InterfacePartConnection;
  /** The Interface this IntraComponentDependencyParticipant refers to */
  interface: Interface;
  /** If this is used as incoming, the IntraComponentDependencySpecification where it is used */
  usedAsIncomingAt?: Maybe<IntraComponentDependencySpecification>;
  /** If this is used as outgoing, the IntraComponentDependencySpecification where it is used */
  usedAsOutgoingAt?: Maybe<IntraComponentDependencySpecification>;
};


/**
 * Participant of a a IntraComponentDependencySpecification
 *     Consists of an Interface it refers to, and optionally a subset of its active InterfaceParts.
 *     READ is granted if READ is granted on the associated ComponentVersion
 *
 */
export type IntraComponentDependencyParticipantExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Participant of a a IntraComponentDependencySpecification
 *     Consists of an Interface it refers to, and optionally a subset of its active InterfaceParts.
 *     READ is granted if READ is granted on the associated ComponentVersion
 *
 */
export type IntraComponentDependencyParticipantExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Participant of a a IntraComponentDependencySpecification
 *     Consists of an Interface it refers to, and optionally a subset of its active InterfaceParts.
 *     READ is granted if READ is granted on the associated ComponentVersion
 *
 */
export type IntraComponentDependencyParticipantIncludedPartsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfacePartFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfacePartOrder>;
};

/** The connection type for IntraComponentDependencyParticipant. */
export type IntraComponentDependencyParticipantConnection = {
  __typename?: 'IntraComponentDependencyParticipantConnection';
  /** A list of all edges of the current page. */
  edges: Array<IntraComponentDependencyParticipantEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IntraComponentDependencyParticipant>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IntraComponentDependencyParticipantEdge = {
  __typename?: 'IntraComponentDependencyParticipantEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IntraComponentDependencyParticipant;
};

/** Filter used to filter IntraComponentDependencyParticipant */
export type IntraComponentDependencyParticipantFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IntraComponentDependencyParticipantFilterInput>>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by includedParts */
  includedParts?: InputMaybe<InterfacePartListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  interface?: InputMaybe<InterfaceFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IntraComponentDependencyParticipantFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  usedAsIncomingAt?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
  /** Filters for nodes where the related node match this filter */
  usedAsOutgoingAt?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IntraComponentDependencyParticipantListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
};

/** Defines the order of a IntraComponentDependencyParticipant list */
export type IntraComponentDependencyParticipantOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IntraComponentDependencyParticipantOrderField>;
};

/** Fields a list of IntraComponentDependencyParticipant can be sorted by */
export enum IntraComponentDependencyParticipantOrderField {
  /** Order by id */
  Id = 'ID'
}

/**
 * Describes a dependency between Interfaces of a Component.
 *     Both ends can optionally affected InterfaceParts.
 *     Semantically, any InterfaceSpecification(Version) in `outgoing` depends on any InterfaceSpecification(Version) in
 *     `incoming`.
 *     This can result in a propagation of Issues, if any location in `in` is in some regard affected by an Issue,
 *     all locations in `out` are affected by this Issue, too.
 *
 */
export type IntraComponentDependencySpecification = ExtensibleNode & Named & NamedNode & Node & {
  __typename?: 'IntraComponentDependencySpecification';
  /** The ComponentVersion this is part of */
  componentVersion: ComponentVersion;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The incoming Interfaces of this ServiceEffectSpecification. */
  incomingParticipants: IntraComponentDependencyParticipantConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** The outgoing Interfaces of this ServiceEffectSpecification. */
  outgoingParticipants: IntraComponentDependencyParticipantConnection;
};


/**
 * Describes a dependency between Interfaces of a Component.
 *     Both ends can optionally affected InterfaceParts.
 *     Semantically, any InterfaceSpecification(Version) in `outgoing` depends on any InterfaceSpecification(Version) in
 *     `incoming`.
 *     This can result in a propagation of Issues, if any location in `in` is in some regard affected by an Issue,
 *     all locations in `out` are affected by this Issue, too.
 *
 */
export type IntraComponentDependencySpecificationExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Describes a dependency between Interfaces of a Component.
 *     Both ends can optionally affected InterfaceParts.
 *     Semantically, any InterfaceSpecification(Version) in `outgoing` depends on any InterfaceSpecification(Version) in
 *     `incoming`.
 *     This can result in a propagation of Issues, if any location in `in` is in some regard affected by an Issue,
 *     all locations in `out` are affected by this Issue, too.
 *
 */
export type IntraComponentDependencySpecificationExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Describes a dependency between Interfaces of a Component.
 *     Both ends can optionally affected InterfaceParts.
 *     Semantically, any InterfaceSpecification(Version) in `outgoing` depends on any InterfaceSpecification(Version) in
 *     `incoming`.
 *     This can result in a propagation of Issues, if any location in `in` is in some regard affected by an Issue,
 *     all locations in `out` are affected by this Issue, too.
 *
 */
export type IntraComponentDependencySpecificationIncomingParticipantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IntraComponentDependencyParticipantOrder>;
};


/**
 * Describes a dependency between Interfaces of a Component.
 *     Both ends can optionally affected InterfaceParts.
 *     Semantically, any InterfaceSpecification(Version) in `outgoing` depends on any InterfaceSpecification(Version) in
 *     `incoming`.
 *     This can result in a propagation of Issues, if any location in `in` is in some regard affected by an Issue,
 *     all locations in `out` are affected by this Issue, too.
 *
 */
export type IntraComponentDependencySpecificationOutgoingParticipantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IntraComponentDependencyParticipantFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IntraComponentDependencyParticipantOrder>;
};

/** The connection type for IntraComponentDependencySpecification. */
export type IntraComponentDependencySpecificationConnection = {
  __typename?: 'IntraComponentDependencySpecificationConnection';
  /** A list of all edges of the current page. */
  edges: Array<IntraComponentDependencySpecificationEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IntraComponentDependencySpecification>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IntraComponentDependencySpecificationEdge = {
  __typename?: 'IntraComponentDependencySpecificationEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IntraComponentDependencySpecification;
};

/** Filter used to filter IntraComponentDependencySpecification */
export type IntraComponentDependencySpecificationFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IntraComponentDependencySpecificationFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  componentVersion?: InputMaybe<ComponentVersionFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by incomingParticipants */
  incomingParticipants?: InputMaybe<IntraComponentDependencyParticipantListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IntraComponentDependencySpecificationFilterInput>>;
  /** Filter by outgoingParticipants */
  outgoingParticipants?: InputMaybe<IntraComponentDependencyParticipantListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IntraComponentDependencySpecificationListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IntraComponentDependencySpecificationFilterInput>;
};

/** Defines the order of a IntraComponentDependencySpecification list */
export type IntraComponentDependencySpecificationOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IntraComponentDependencySpecificationOrderField>;
};

/** Fields a list of IntraComponentDependencySpecification can be sorted by */
export enum IntraComponentDependencySpecificationOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type Issue = AuditedNode & ExtensibleNode & MutableTemplatedNode & Node & TemplatedNode & {
  __typename?: 'Issue';
  /** Entities which are in some regard affected by this Issue. */
  affects: AffectedByIssueConnection;
  /** Artefacts currently assigned to the Issue. For the history, see timelineItems. */
  artefacts: ArtefactConnection;
  /** Current Assignments to this Issue. For the history, see timelineItems. */
  assignments: AssignmentConnection;
  /** The Body of the Issue, a Comment directly associated with the Issue. */
  body: Body;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** DateTime when working on this Issue should be finished. */
  dueDate?: Maybe<Scalars['DateTime']>;
  /** Estimated amount of time necessary for this Issue. */
  estimatedTime?: Maybe<Scalars['Duration']>;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /**
   * Descriptions of each IMSProject this issue is synced to containing information specified by the sync
   *
   */
  imsIssues: ImsIssueConnection;
  /** Current IssueRelations which have this Issue as end point. */
  incomingRelations: IssueRelationConnection;
  /** If true, this Issue is currently open, otherwise it is closed */
  isOpen: Scalars['Boolean'];
  /** Comments on the Issue, subset of the timeline. */
  issueComments: IssueCommentConnection;
  /** Labels currently assigned to the Issue. For the history, see timelineItems. */
  labels: LabelConnection;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The DateTime when the Issue was last updated, this includes a changed timeline. */
  lastUpdatedAt: Scalars['DateTime'];
  /** Current IssueRelations which have this Issue as start point. */
  outgoingRelations: IssueRelationConnection;
  /**
   * IMSProjects with which this Issue is currently partially synced,
   *         meaning that a sync is in progress, but not completed yet.
   *
   */
  partiallySyncedWith: ImsProjectConnection;
  /** Users who participated on the Issue, e.g. commented, added Labels, ... */
  participants: UserConnection;
  /** Trackables this Issue is currently pinned on. For the history, see timelineItems. */
  pinnedOn: TrackableConnection;
  /** The priority of the Issue, e.g. HIGH. Allowed IssuePriorities are defined by the template. */
  priority?: Maybe<IssuePriority>;
  /** Time spent working on this Issue. */
  spentTime?: Maybe<Scalars['Duration']>;
  /** DateTime when working on this Issue started / will start. */
  startDate?: Maybe<Scalars['DateTime']>;
  /** The Template of this Issue. */
  template: IssueTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
  /** Timeline of the Issue, shows how the Issue changed over time. */
  timelineItems: TimelineItemConnection;
  /** Title of the Issue, usually a short description of the Issue. */
  title: Scalars['String'];
  /** Trackables this Issue is part of. */
  trackables: TrackableConnection;
  /** The type of the Issue, e.g. BUG. Allowed IssueTypes are defined by the template. */
  type: IssueType;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueAffectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AffectedByIssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffectedByIssueOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueArtefactsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueAssignmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AssignmentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssignmentOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueImsIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsIssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsIssueOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueIncomingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueRelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueRelationOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueIssueCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueCommentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueCommentOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueLabelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<LabelFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LabelOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueOutgoingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueRelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueRelationOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssuePartiallySyncedWithArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsProjectOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueParticipantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssuePinnedOnArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<TrackableFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TrackableOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueTimelineItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<TimelineItemFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TimelineItemOrder>;
};


/**
 * An Issue in the Gropius system.
 *     Issues can be used to report bugs, request features, ask questions, ...
 *     Issues are synced to all IMSProjects of Trackables they are part of.
 *     All changes to the Issue are reflected by the timeline.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type IssueTrackablesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<TrackableFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TrackableOrder>;
};

/**
 * Comment on an Issue.
 *     Can reference Artefacts.
 *     Can be deleted, if deleted, the body is set to an empty String and the referencedComments are cleared.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type IssueComment = AuditedNode & Comment & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'IssueComment';
  /** IssueComments which answer this Comment. */
  answeredBy: IssueCommentConnection;
  /** The Comment this IssueComment is an answers to. */
  answers?: Maybe<Comment>;
  /**
   * The text of the Comment.
   *         Supports GFM (GitHub Flavored Markdown).
   *         Updates to the body cause lastEditedAt and lastEditedBy to change, while updates to referencedArtefacts
   *         do not.
   *         Empty String if IssueComment is deleted.
   *
   */
  body: Scalars['String'];
  /**
   * Keep track when the body of the Comment was last updated.
   *         If not updated yet, the DateTime of creation.
   *
   */
  bodyLastEditedAt: Scalars['DateTime'];
  /**
   * The User who last edited the body of this Comment.
   *         If not edited yet, the creator of the Comment.
   *
   */
  bodyLastEditedBy: User;
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, the IssueComment was deleted and the body is no longer visible. */
  isDeleted: Scalars['Boolean'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** Referenced Artefacts. Changes to not cause lastEditedAt/lastEditedBy to change. */
  referencedArtefacts: ArtefactConnection;
};


/**
 * Comment on an Issue.
 *     Can reference Artefacts.
 *     Can be deleted, if deleted, the body is set to an empty String and the referencedComments are cleared.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type IssueCommentAnsweredByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueCommentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueCommentOrder>;
};


/**
 * Comment on an Issue.
 *     Can reference Artefacts.
 *     Can be deleted, if deleted, the body is set to an empty String and the referencedComments are cleared.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type IssueCommentExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Comment on an Issue.
 *     Can reference Artefacts.
 *     Can be deleted, if deleted, the body is set to an empty String and the referencedComments are cleared.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type IssueCommentExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Comment on an Issue.
 *     Can reference Artefacts.
 *     Can be deleted, if deleted, the body is set to an empty String and the referencedComments are cleared.
 *     Keeps track when it was last edited and by who, but does not keep track of the change history.
 *
 */
export type IssueCommentReferencedArtefactsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactOrder>;
};

/** The connection type for IssueComment. */
export type IssueCommentConnection = {
  __typename?: 'IssueCommentConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssueCommentEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IssueComment>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssueCommentEdge = {
  __typename?: 'IssueCommentEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IssueComment;
};

/** Filter used to filter IssueComment */
export type IssueCommentFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssueCommentFilterInput>>;
  /** Filter by answeredBy */
  answeredBy?: InputMaybe<IssueCommentListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  answers?: InputMaybe<CommentFilterInput>;
  /** Filter by body */
  body?: InputMaybe<StringFilterInput>;
  /** Filter by bodyLastEditedAt */
  bodyLastEditedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  bodyLastEditedBy?: InputMaybe<UserFilterInput>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isCommentDeleted */
  isCommentDeleted?: InputMaybe<BooleanFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssueCommentFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssueCommentFilterInput>>;
  /** Filter by referencedArtefacts */
  referencedArtefacts?: InputMaybe<ArtefactListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueCommentListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssueCommentFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssueCommentFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssueCommentFilterInput>;
};

/** Defines the order of a IssueComment list */
export type IssueCommentOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssueCommentOrderField>;
};

/** Fields a list of IssueComment can be sorted by */
export enum IssueCommentOrderField {
  /** Order by bodyLastEditedAt */
  BodyLastEditedAt = 'BODY_LAST_EDITED_AT',
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT'
}

/** The connection type for Issue. */
export type IssueConnection = {
  __typename?: 'IssueConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssueEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Issue>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssueEdge = {
  __typename?: 'IssueEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Issue;
};

/** Filter used to filter Issue */
export type IssueFilterInput = {
  /** Filter by affects */
  affects?: InputMaybe<AffectedByIssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssueFilterInput>>;
  /** Filter by artefacts */
  artefacts?: InputMaybe<ArtefactListFilterInput>;
  /** Filter by assignments */
  assignments?: InputMaybe<AssignmentListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  body?: InputMaybe<BodyFilterInput>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by dueDate */
  dueDate?: InputMaybe<NullableDateTimeFilterInput>;
  /** Filter by estimatedTime */
  estimatedTime?: InputMaybe<NullableDurationFilterInputFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by imsIssues */
  imsIssues?: InputMaybe<ImsIssueListFilterInput>;
  /** Filter by incomingRelations */
  incomingRelations?: InputMaybe<IssueRelationListFilterInput>;
  /** Filter by isOpen */
  isOpen?: InputMaybe<BooleanFilterInput>;
  /** Filter by issueComments */
  issueComments?: InputMaybe<IssueCommentListFilterInput>;
  /** Filter by labels */
  labels?: InputMaybe<LabelListFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Filter by lastUpdatedAt */
  lastUpdatedAt?: InputMaybe<DateTimeFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssueFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssueFilterInput>>;
  /** Filter by outgoingRelations */
  outgoingRelations?: InputMaybe<IssueRelationListFilterInput>;
  /** Filter by partiallySyncedWith */
  partiallySyncedWith?: InputMaybe<ImsProjectListFilterInput>;
  /** Filter by participants */
  participants?: InputMaybe<UserListFilterInput>;
  /** Filter by pinnedOn */
  pinnedOn?: InputMaybe<TrackableListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  priority?: InputMaybe<IssuePriorityFilterInput>;
  /** Filter by spentTime */
  spentTime?: InputMaybe<NullableDurationFilterInputFilterInput>;
  /** Filter by startDate */
  startDate?: InputMaybe<NullableDateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<IssueTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
  /** Filter by timelineItems */
  timelineItems?: InputMaybe<TimelineItemListFilterInput>;
  /** Filter by title */
  title?: InputMaybe<StringFilterInput>;
  /** Filter by trackables */
  trackables?: InputMaybe<TrackableListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  type?: InputMaybe<IssueTypeFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssueFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssueFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssueFilterInput>;
};

/** Defines the order of a Issue list */
export type IssueOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssueOrderField>;
};

/** Fields a list of Issue can be sorted by */
export enum IssueOrderField {
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by dueDate */
  DueDate = 'DUE_DATE',
  /** Order by estimatedTime */
  EstimatedTime = 'ESTIMATED_TIME',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT',
  /** Order by lastUpdatedAt */
  LastUpdatedAt = 'LAST_UPDATED_AT',
  /** Order by spentTime */
  SpentTime = 'SPENT_TIME',
  /** Order by startDate */
  StartDate = 'START_DATE',
  /** Order by title */
  Title = 'TITLE'
}

/**
 * Priority of an Issue like HIGH or LOW. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssuePriority = ExtensibleNode & Named & NamedNode & Node & {
  __typename?: 'IssuePriority';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  partOf: IssueTemplateConnection;
  prioritizedIssues: IssueConnection;
  /** The value of the IssuePriority, used to compare/order different IssuePriorities. */
  value: Scalars['Float'];
};


/**
 * Priority of an Issue like HIGH or LOW. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssuePriorityExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Priority of an Issue like HIGH or LOW. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssuePriorityExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Priority of an Issue like HIGH or LOW. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssuePriorityPartOfArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};


/**
 * Priority of an Issue like HIGH or LOW. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssuePriorityPrioritizedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};

/** The connection type for IssuePriority. */
export type IssuePriorityConnection = {
  __typename?: 'IssuePriorityConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssuePriorityEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IssuePriority>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssuePriorityEdge = {
  __typename?: 'IssuePriorityEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IssuePriority;
};

/** Filter used to filter IssuePriority */
export type IssuePriorityFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssuePriorityFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssuePriorityFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssuePriorityFilterInput>>;
  /** Filter by partOf */
  partOf?: InputMaybe<IssueTemplateListFilterInput>;
  /** Filter by prioritizedIssues */
  prioritizedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filter by value */
  value?: InputMaybe<FloatFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssuePriorityListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssuePriorityFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssuePriorityFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssuePriorityFilterInput>;
};

/** Defines the order of a IssuePriority list */
export type IssuePriorityOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssuePriorityOrderField>;
};

/** Fields a list of IssuePriority can be sorted by */
export enum IssuePriorityOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME',
  /** Order by value */
  Value = 'VALUE'
}

/**
 * Event representing that a relation between two Issues has been created.
 *     An IssueRelation is only active if it is still in `outgoingRelations` on the `issue`,
 *     respectively in incomingRelations on the `relatedIssue`.
 *     Caution: This is **not** a subtype of Relation.
 *
 */
export type IssueRelation = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'IssueRelation';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The end of the relation. */
  relatedIssue?: Maybe<Issue>;
  /** The type of the relation, e.g. DUPLICATES. Allowed types are defined by the IssueTemplate. */
  type?: Maybe<IssueRelationType>;
};


/**
 * Event representing that a relation between two Issues has been created.
 *     An IssueRelation is only active if it is still in `outgoingRelations` on the `issue`,
 *     respectively in incomingRelations on the `relatedIssue`.
 *     Caution: This is **not** a subtype of Relation.
 *
 */
export type IssueRelationExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Event representing that a relation between two Issues has been created.
 *     An IssueRelation is only active if it is still in `outgoingRelations` on the `issue`,
 *     respectively in incomingRelations on the `relatedIssue`.
 *     Caution: This is **not** a subtype of Relation.
 *
 */
export type IssueRelationExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for IssueRelation. */
export type IssueRelationConnection = {
  __typename?: 'IssueRelationConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssueRelationEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IssueRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssueRelationEdge = {
  __typename?: 'IssueRelationEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IssueRelation;
};

/** Filter used to filter IssueRelation */
export type IssueRelationFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssueRelationFilterInput>>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssueRelationFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssueRelationFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  relatedIssue?: InputMaybe<IssueFilterInput>;
  /** Filters for nodes where the related node match this filter */
  type?: InputMaybe<IssueRelationTypeFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueRelationListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssueRelationFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssueRelationFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssueRelationFilterInput>;
};

/** Defines the order of a IssueRelation list */
export type IssueRelationOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssueRelationOrderField>;
};

/** Fields a list of IssueRelation can be sorted by */
export enum IssueRelationOrderField {
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT'
}

/**
 * Type for an IssueRelation, like DUPLICATES or DEPENDS_ON. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueRelationType = ExtensibleNode & Named & NamedNode & Node & {
  __typename?: 'IssueRelationType';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** IssueTemplates this is part of. */
  partOf: IssueTemplateConnection;
  /** Relations which use this type. */
  relationsWithType: IssueRelationConnection;
};


/**
 * Type for an IssueRelation, like DUPLICATES or DEPENDS_ON. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueRelationTypeExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Type for an IssueRelation, like DUPLICATES or DEPENDS_ON. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueRelationTypeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Type for an IssueRelation, like DUPLICATES or DEPENDS_ON. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueRelationTypePartOfArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};


/**
 * Type for an IssueRelation, like DUPLICATES or DEPENDS_ON. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueRelationTypeRelationsWithTypeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueRelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueRelationOrder>;
};

/** The connection type for IssueRelationType. */
export type IssueRelationTypeConnection = {
  __typename?: 'IssueRelationTypeConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssueRelationTypeEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IssueRelationType>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssueRelationTypeEdge = {
  __typename?: 'IssueRelationTypeEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IssueRelationType;
};

/** Filter used to filter IssueRelationType */
export type IssueRelationTypeFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssueRelationTypeFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssueRelationTypeFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssueRelationTypeFilterInput>>;
  /** Filter by partOf */
  partOf?: InputMaybe<IssueTemplateListFilterInput>;
  /** Filter by relationsWithType */
  relationsWithType?: InputMaybe<IssueRelationListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueRelationTypeListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssueRelationTypeFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssueRelationTypeFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssueRelationTypeFilterInput>;
};

/** Defines the order of a IssueRelationType list */
export type IssueRelationTypeOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssueRelationTypeOrderField>;
};

/** Fields a list of IssueRelationType can be sorted by */
export enum IssueRelationTypeOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & Template & {
  __typename?: 'IssueTemplate';
  /** Set of all types Assignments to Issues with this Template can have. */
  assignmentTypes: AssignmentTypeConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Templates that extend this template. */
  extendedBy: IssueTemplateConnection;
  /** Template this template extends. */
  extends: IssueTemplateConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** Set of all priorities Issues with this Template can have. */
  issuePriorities: IssuePriorityConnection;
  /** Set of all types Issues with this Template can have. */
  issueTypes: IssueTypeConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Set of all types outgoing IssueRelations of Issues with this Template can have */
  relationTypes: IssueRelationTypeConnection;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: IssueConnection;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateAssignmentTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AssignmentTypeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssignmentTypeOrder>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateExtendedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateExtendsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateIssuePrioritiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssuePriorityFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssuePriorityOrder>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateIssueTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTypeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTypeOrder>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateRelationTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueRelationTypeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueRelationTypeOrder>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Issues.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines possible IssueTypes and IssuePriorities for Issues with this Template,
 *     possible AssignmentTypes for Assignments to Issues with this template, and possible
 *     RelationTypes for outgoing IssueRelations for Issues with this template.
 *     All those are derived, if this Template extends another IssueTemplate.
 *
 */
export type IssueTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};

/** The connection type for IssueTemplate. */
export type IssueTemplateConnection = {
  __typename?: 'IssueTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssueTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IssueTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssueTemplateEdge = {
  __typename?: 'IssueTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IssueTemplate;
};

/** Filter used to filter IssueTemplate */
export type IssueTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssueTemplateFilterInput>>;
  /** Filter by assignmentTypes */
  assignmentTypes?: InputMaybe<AssignmentTypeListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by extendedBy */
  extendedBy?: InputMaybe<IssueTemplateListFilterInput>;
  /** Filter by extends */
  extends?: InputMaybe<IssueTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by issuePriorities */
  issuePriorities?: InputMaybe<IssuePriorityListFilterInput>;
  /** Filter by issueTypes */
  issueTypes?: InputMaybe<IssueTypeListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssueTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssueTemplateFilterInput>>;
  /** Filter by relationTypes */
  relationTypes?: InputMaybe<IssueRelationTypeListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssueTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssueTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssueTemplateFilterInput>;
};

/** Defines the order of a IssueTemplate list */
export type IssueTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssueTemplateOrderField>;
};

/** Fields a list of IssueTemplate can be sorted by */
export enum IssueTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Type of an Issue like BUG or FEATURE_REQUEST. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueType = ExtensibleNode & Named & NamedNode & Node & {
  __typename?: 'IssueType';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Issues with this type. */
  issuesWithType: IssueConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** IssueTemplates this is a part of. */
  partOf: IssueTemplateConnection;
};


/**
 * Type of an Issue like BUG or FEATURE_REQUEST. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueTypeExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Type of an Issue like BUG or FEATURE_REQUEST. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueTypeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Type of an Issue like BUG or FEATURE_REQUEST. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueTypeIssuesWithTypeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Type of an Issue like BUG or FEATURE_REQUEST. Part of an IssueTemplate.
 *     READ is always granted.
 *
 */
export type IssueTypePartOfArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};

/** The connection type for IssueType. */
export type IssueTypeConnection = {
  __typename?: 'IssueTypeConnection';
  /** A list of all edges of the current page. */
  edges: Array<IssueTypeEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<IssueType>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type IssueTypeEdge = {
  __typename?: 'IssueTypeEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: IssueType;
};

/** Filter used to filter IssueType */
export type IssueTypeFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<IssueTypeFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by issuesWithType */
  issuesWithType?: InputMaybe<IssueListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<IssueTypeFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<IssueTypeFilterInput>>;
  /** Filter by partOf */
  partOf?: InputMaybe<IssueTemplateListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueTypeListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<IssueTypeFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<IssueTypeFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<IssueTypeFilterInput>;
};

/** Defines the order of a IssueType list */
export type IssueTypeOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<IssueTypeOrderField>;
};

/** Fields a list of IssueType can be sorted by */
export enum IssueTypeOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/** A JSON extension field, consisting of a name and a value. */
export type JsonField = {
  __typename?: 'JSONField';
  /** The name of the field, used as unique identifier. */
  name: Scalars['String'];
  /** The value of the JSON field, might be null. */
  value?: Maybe<Scalars['JSON']>;
};

/** Input set update the value of a JSON field, like an extension field or a templated field. */
export type JsonFieldInput = {
  /** The name of the field */
  name: Scalars['String'];
  /** The new value of the field */
  value?: InputMaybe<Scalars['JSON']>;
};

/**
 * Label used to mark Issues with.
 *     A Label consists of a name, a description and a color.
 *     Issues may be synced to all IMSProjects of Trackables they are part of.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type Label = AuditedNode & ExtensibleNode & Named & NamedAuditedNode & Node & {
  __typename?: 'Label';
  /** The color of the Label, used to display the Label. */
  color: Scalars['String'];
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Issues which currently have this Label. */
  issues: IssueConnection;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Trackables this Label is part of. */
  trackables: TrackableConnection;
};


/**
 * Label used to mark Issues with.
 *     A Label consists of a name, a description and a color.
 *     Issues may be synced to all IMSProjects of Trackables they are part of.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type LabelExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Label used to mark Issues with.
 *     A Label consists of a name, a description and a color.
 *     Issues may be synced to all IMSProjects of Trackables they are part of.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type LabelExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Label used to mark Issues with.
 *     A Label consists of a name, a description and a color.
 *     Issues may be synced to all IMSProjects of Trackables they are part of.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type LabelIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * Label used to mark Issues with.
 *     A Label consists of a name, a description and a color.
 *     Issues may be synced to all IMSProjects of Trackables they are part of.
 *     READ is granted if READ is granted on any Trackable in `trackables`.
 *
 */
export type LabelTrackablesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<TrackableFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TrackableOrder>;
};

/** The connection type for Label. */
export type LabelConnection = {
  __typename?: 'LabelConnection';
  /** A list of all edges of the current page. */
  edges: Array<LabelEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Label>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type LabelEdge = {
  __typename?: 'LabelEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Label;
};

/** Filter used to filter Label */
export type LabelFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<LabelFilterInput>>;
  /** Filter by color */
  color?: InputMaybe<StringFilterInput>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by issues */
  issues?: InputMaybe<IssueListFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<LabelFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<LabelFilterInput>>;
  /** Filter by trackables */
  trackables?: InputMaybe<TrackableListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type LabelListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<LabelFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<LabelFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<LabelFilterInput>;
};

/** Defines the order of a Label list */
export type LabelOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<LabelOrderField>;
};

/** Fields a list of Label can be sorted by */
export enum LabelOrderField {
  /** Order by color */
  Color = 'COLOR',
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT',
  /** Order by name */
  Name = 'NAME'
}

/** Interface for all types which support templates describing user writeable fields. */
export type MutableTemplatedNode = {
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/** Interface for all types which support templates describing user writeable fields. */
export type MutableTemplatedNodeTemplatedFieldArgs = {
  name: Scalars['String'];
};


/** Interface for all types which support templates describing user writeable fields. */
export type MutableTemplatedNodeTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a GropiusUser */
  createGropiusUser?: Maybe<CreateGropiusUserPayload>;
  /** Creates an IMSUser */
  createIMSUser?: Maybe<CreateImsUserPayload>;
  /** Updates an IMSUser */
  updateIMSUser?: Maybe<UpdateImsUserPayload>;
};


export type MutationCreateGropiusUserArgs = {
  input: CreateGropiusUserInput;
};


export type MutationCreateImsUserArgs = {
  input: CreateImsUserInput;
};


export type MutationUpdateImsUserArgs = {
  input: UpdateImsUserInput;
};

/** Entity with a name and a description. */
export type Named = {
  /** The description of this entity. */
  description: Scalars['String'];
  /** The name of this entity. */
  name: Scalars['String'];
};

/** AuditedNode with a name and description */
export type NamedAuditedNode = {
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The name of this entity. */
  name: Scalars['String'];
};


/** AuditedNode with a name and description */
export type NamedAuditedNodeExtensionFieldArgs = {
  name: Scalars['String'];
};


/** AuditedNode with a name and description */
export type NamedAuditedNodeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** ExtensibleNode with a name and description */
export type NamedNode = {
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
};


/** ExtensibleNode with a name and description */
export type NamedNodeExtensionFieldArgs = {
  name: Scalars['String'];
};


/** ExtensibleNode with a name and description */
export type NamedNodeExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Base class of all nodes */
export type Node = {
  /** The unique id of this node */
  id: Scalars['ID'];
};

export type NodePermission = {
  /** If, the permission is granted to all users. Use with caution. */
  allUsers: Scalars['Boolean'];
  /** The description of this entity. */
  description: Scalars['String'];
  entries: Array<Scalars['String']>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** GropiusUsers granted this Permission */
  users: GropiusUserConnection;
};


export type NodePermissionUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GropiusUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GropiusUserOrder>;
};

/** Filter which can be used to filter for Nodes with a specific DateTime field */
export type NullableDateTimeFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  /** If true, matches only null values, if false, matches only non-null values */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['DateTime']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['DateTime']>;
};

/** Filter which can be used to filter for Nodes with a specific Duration field */
export type NullableDurationFilterInputFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['Duration']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['Duration']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['Duration']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['Duration']>>;
  /** If true, matches only null values, if false, matches only non-null values */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['Duration']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['Duration']>;
};

/** Filter which can be used to filter for Nodes with a specific Int field */
export type NullableIntFilterInput = {
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['Int']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['Int']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['Int']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['Int']>>;
  /** If true, matches only null values, if false, matches only non-null values */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['Int']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['Int']>;
};

/** Filter which can be used to filter for Nodes with a specific String field */
export type NullableStringFilterInput = {
  /** Matches Strings which contain the provided value */
  contains?: InputMaybe<Scalars['String']>;
  /** Matches Strings which end with the provided value */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['String']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['String']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['String']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** If true, matches only null values, if false, matches only non-null values */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['String']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['String']>;
  /** Matches Strings using the provided RegEx */
  matches?: InputMaybe<Scalars['String']>;
  /** Matches Strings which start with the provided value */
  startsWith?: InputMaybe<Scalars['String']>;
};

/** Possible direction in which a list of nodes can be ordered */
export enum OrderDirection {
  /** Ascending */
  Asc = 'ASC',
  /** Descending */
  Desc = 'DESC'
}

/** Information about the current page in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating backwards, the cursor to continue */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating forwards, the cursor to continue */
  startCursor?: Maybe<Scalars['String']>;
};

/** Permission entry enum type. */
export enum PermissionEntry {
  /** Allows to create new Components. */
  CanCreateComponents = 'CAN_CREATE_COMPONENTS',
  /** Allows to create new IMSs. */
  CanCreateImss = 'CAN_CREATE_IMSS',
  /** Allows to create new Projects. */
  CanCreateProjects = 'CAN_CREATE_PROJECTS',
  /** Allows to create new Templates. */
  CanCreateTemplates = 'CAN_CREATE_TEMPLATES'
}

/** Event representing that the priority of an Issue changed. */
export type PriorityChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'PriorityChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new priority. */
  newPriority?: Maybe<IssuePriority>;
  /** The old priority. */
  oldPriority?: Maybe<IssuePriority>;
};


/** Event representing that the priority of an Issue changed. */
export type PriorityChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the priority of an Issue changed. */
export type PriorityChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type Project = AffectedByIssue & ExtensibleNode & Named & NamedNode & Node & Trackable & {
  __typename?: 'Project';
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** Artefacts of this trackable, typically some kind of file. */
  artefacts: ArtefactConnection;
  /** The ComponentVersions this consists of. */
  components: ComponentVersionConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /**
   * The set of Issues which are part of this Trackable.
   *         An Issue has to be part of a Trackable to use the Labels and Artefacts defined by the Trackable.
   *
   */
  issues: IssueConnection;
  /** The set of Labels which can be added to issues of this trackable. */
  labels: LabelConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Permissions for this Project. */
  permissions: ProjectPermissionConnection;
  /** Issues which are pinned to this trackable, subset of `issues`. */
  pinnedIssues: IssueConnection;
  /** If existing, the URL of the repository (e.g. a GitHub repository). */
  repositoryURL?: Maybe<Scalars['URL']>;
  /** IMSProjects this Trackable is synced to and from. */
  syncsTo: ImsProjectConnection;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectArtefactsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectComponentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentVersionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentVersionOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectLabelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<LabelFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LabelOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectPermissionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProjectPermissionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectPermissionOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectPinnedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * A project of the Gropius system.
 *     Consists of a set of ComponentVersions, which form a graph with the Relations between them.
 *     Can be affected by issues.
 *     Can have issues, labels and artefacts as this is a Trackable.
 *     READ is granted via an associated ProjectPermission.
 *
 */
export type ProjectSyncsToArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsProjectOrder>;
};

/** The connection type for Project. */
export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  /** A list of all edges of the current page. */
  edges: Array<ProjectEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Project>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ProjectEdge = {
  __typename?: 'ProjectEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Project;
};

/** Filter used to filter Project */
export type ProjectFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ProjectFilterInput>>;
  /** Filter by artefacts */
  artefacts?: InputMaybe<ArtefactListFilterInput>;
  /** Filter by components */
  components?: InputMaybe<ComponentVersionListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by issues */
  issues?: InputMaybe<IssueListFilterInput>;
  /** Filter by labels */
  labels?: InputMaybe<LabelListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ProjectFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ProjectFilterInput>>;
  /** Filter by permissions */
  permissions?: InputMaybe<ProjectPermissionListFilterInput>;
  /** Filter by pinnedIssues */
  pinnedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filter by repositoryURL */
  repositoryURL?: InputMaybe<NullableStringFilterInput>;
  /** Filter by syncsTo */
  syncsTo?: InputMaybe<ImsProjectListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ProjectListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ProjectFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ProjectFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ProjectFilterInput>;
};

/** Defines the order of a Project list */
export type ProjectOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ProjectOrderField>;
};

/** Fields a list of Project can be sorted by */
export enum ProjectOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/** NodePermission to grant specific permissions to a set of Projects. */
export type ProjectPermission = Named & Node & {
  __typename?: 'ProjectPermission';
  /** If, the permission is granted to all users. Use with caution. */
  allUsers: Scalars['Boolean'];
  /** The description of this entity. */
  description: Scalars['String'];
  /** All permissions this Permission grants */
  entries: Array<ProjectPermissionEntry>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** Nodes on which the Permission is granted. */
  nodesWithPermission: ProjectConnection;
  /** GropiusUsers granted this Permission */
  users: GropiusUserConnection;
};


/** NodePermission to grant specific permissions to a set of Projects. */
export type ProjectPermissionNodesWithPermissionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectOrder>;
};


/** NodePermission to grant specific permissions to a set of Projects. */
export type ProjectPermissionUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GropiusUserFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GropiusUserOrder>;
};

/** The connection type for ProjectPermission. */
export type ProjectPermissionConnection = {
  __typename?: 'ProjectPermissionConnection';
  /** A list of all edges of the current page. */
  edges: Array<ProjectPermissionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<ProjectPermission>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ProjectPermissionEdge = {
  __typename?: 'ProjectPermissionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ProjectPermission;
};

/** ProjectPermission entry enum type. */
export enum ProjectPermissionEntry {
  /** Grants all other permissions on the Node except READ. */
  Admin = 'ADMIN',
  /**
   * Allows to create Comments on Issues on this Trackable.
   * Also allows editing of your own Comments.
   */
  Comment = 'COMMENT',
  /**
   * Allows to create new Issues on the Trackable.
   * This includes adding Issues from other Trackables.
   */
  CreateIssues = 'CREATE_ISSUES',
  /** Allows adding Issues on this Trackable to other Trackables. */
  ExportIssues = 'EXPORT_ISSUES',
  /** Allows adding Labels on this Trackable to other Trackables. */
  ExportLabels = 'EXPORT_LABELS',
  /** Allows to link **from** Issues on this Trackable to other Issues (on this or other Trackables). */
  LinkFromIssues = 'LINK_FROM_ISSUES',
  /** Allows to link Issues (on this or other Trackables) **to** Issues on this Trackable.  */
  LinkToIssues = 'LINK_TO_ISSUES',
  /** Allows to add, remove, and update Artefacts on this Trackable. */
  ManageArtefacts = 'MANAGE_ARTEFACTS',
  /** Allows to add / remove ComponentVersions to / from this Project. */
  ManageComponents = 'MANAGE_COMPONENTS',
  /**
   * Allows to add, remove, and update IMSProjects on this Trackable.
   * Note: for adding, `IMSPermissionEntry.SYNC_TRACKABLES` is required additionally
   */
  ManageIms = 'MANAGE_IMS',
  /**
   * Allows to manage issues.
   * This includes `CREATE_ISSUES` and `COMMENT`.
   * This does NOT include `LINK_TO_ISSUES` and `LINK_FROM_ISSUES`.
   * Additionaly includes
   *   - change the Template
   *   - add / remove Labels
   *   - add / remove Artefacts
   *   - change any field on the Issue (title, startDate, dueDate, ...)
   *   - change templated fields
   * In contrast to `MODERATOR`, this does not allow editing / removing Comments of other users
   */
  ManageIssues = 'MANAGE_ISSUES',
  /**
   * Allows to add, remove, and update Labels on this Trackable.
   * Also allows to delete a Label, but only if it is allowed on all Trackable the Label is on.
   */
  ManageLabels = 'MANAGE_LABELS',
  /**
   * Allows to moderate Issues on this Trackable.
   * This allows everything `MANAGE_ISSUES` allows.
   * Additionally, it allows editing and deleting Comments of other Users
   */
  Moderator = 'MODERATOR',
  /**
   * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
   * See documentation for specific Node for the specific conditions.
   */
  Read = 'READ'
}

/** Filter used to filter ProjectPermission */
export type ProjectPermissionFilterInput = {
  /** Filter by allUsers */
  allUsers?: InputMaybe<BooleanFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<ProjectPermissionFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Filter by nodesWithPermission */
  nodesWithPermission?: InputMaybe<ProjectListFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<ProjectPermissionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<ProjectPermissionFilterInput>>;
  /** Filter by users */
  users?: InputMaybe<GropiusUserListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ProjectPermissionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<ProjectPermissionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<ProjectPermissionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<ProjectPermissionFilterInput>;
};

/** Defines the order of a ProjectPermission list */
export type ProjectPermissionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<ProjectPermissionOrderField>;
};

/** Fields a list of ProjectPermission can be sorted by */
export enum ProjectPermissionOrderField {
  /** Order by allUsers */
  AllUsers = 'ALL_USERS',
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

export type Query = {
  __typename?: 'Query';
  /** Query for nodes of type ArtefactTemplate */
  artefactTemplates: ArtefactTemplateConnection;
  /** Query for nodes of type ComponentTemplate */
  componentTemplates: ComponentTemplateConnection;
  /** Query for nodes of type Component */
  components: ComponentConnection;
  /** Get a GropiusUser by username */
  gropiusUser: GropiusUser;
  /** Query for nodes of type IMSTemplate */
  imsTemplates: ImsTemplateConnection;
  /** Query for nodes of type IMS */
  imss: ImsConnection;
  /** Query for nodes of type InterfaceSpecificationTemplate */
  interfaceSpecificationTemplates: InterfaceSpecificationTemplateConnection;
  /** Query for nodes of type IssueTemplate */
  issueTemplates: IssueTemplateConnection;
  /** Get a Node by id */
  node?: Maybe<Node>;
  /** Query for nodes of type Project */
  projects: ProjectConnection;
  /** Query for nodes of type RelationTemplate */
  relationTemplates: RelationTemplateConnection;
};


export type QueryArtefactTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactTemplateOrder>;
};


export type QueryComponentTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentTemplateOrder>;
};


export type QueryComponentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ComponentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ComponentOrder>;
};


export type QueryGropiusUserArgs = {
  username: Scalars['String'];
};


export type QueryImsTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsTemplateOrder>;
};


export type QueryImssArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsOrder>;
};


export type QueryInterfaceSpecificationTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationTemplateOrder>;
};


export type QueryIssueTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueTemplateOrder>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectOrder>;
};


export type QueryRelationTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationTemplateOrder>;
};

/**
 * Event representing that the Issue was used in an IssueRelation as related issue.
 *     The IssueRelation may not be active any more.
 *
 */
export type RelatedByIssueEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RelatedByIssueEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The IssueRelation the Issue is related at. */
  relation?: Maybe<IssueRelation>;
};


/**
 * Event representing that the Issue was used in an IssueRelation as related issue.
 *     The IssueRelation may not be active any more.
 *
 */
export type RelatedByIssueEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Event representing that the Issue was used in an IssueRelation as related issue.
 *     The IssueRelation may not be active any more.
 *
 */
export type RelatedByIssueEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type Relation = ExtensibleNode & MutableTemplatedNode & Node & TemplatedNode & {
  __typename?: 'Relation';
  /** InterfaceDefinition this Relation derives invisible */
  derivesInvisible: InterfaceDefinitionConnection;
  /** InterfaceDefinition this Relation derives visible */
  derivesVisible: InterfaceDefinitionConnection;
  /** The end of this Relation. */
  end?: Maybe<RelationPartner>;
  /** If the end is an Interface, the parts of that Interface this Relation includes. */
  endParts: InterfacePartConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The start of this Relation. */
  start?: Maybe<RelationPartner>;
  /** If the start is an Interface, the parts of that Interface this Relation includes. */
  startParts: InterfacePartConnection;
  /** The Template of this Relation. */
  template: RelationTemplate;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationDerivesInvisibleArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceDefinitionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceDefinitionOrder>;
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationDerivesVisibleArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceDefinitionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceDefinitionOrder>;
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationEndPartsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfacePartFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfacePartOrder>;
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationStartPartsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfacePartFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfacePartOrder>;
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationTemplatedFieldArgs = {
  name: Scalars['String'];
};


/**
 * A relation between RelationPartners (ComponentVersions and Interfaces).
 *     Relations are always directional.
 *     The template defines which RelationPartners are possible as start / end.
 *     For both start and end, if it is an Interface, it is possible to define the InterfaceParts this includes.
 *     Caution: This is **not** a supertype of IssueRelation.
 *     READ is granted if READ is granted on `start` or `end`.
 *
 */
export type RelationTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationCondition = ExtensibleNode & Node & {
  __typename?: 'RelationCondition';
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** Templates of allowed start RelationPartners */
  from: RelationPartnerTemplateConnection;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Defines which InterfaceSpecifications are derived via the Relation. */
  interfaceSpecificationDerivationConditions: InterfaceSpecificationDerivationConditionConnection;
  /** The RelationTemplates this is part of. */
  partOf: RelationTemplateConnection;
  /** Templates of allowed end RelationPartners */
  to: RelationPartnerTemplateConnection;
};


/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationConditionExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationConditionExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationConditionFromArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationPartnerTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationPartnerTemplateOrder>;
};


/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationConditionInterfaceSpecificationDerivationConditionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<InterfaceSpecificationDerivationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterfaceSpecificationDerivationConditionOrder>;
};


/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationConditionPartOfArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationTemplateOrder>;
};


/**
 * Condition which defines if a Relation can use a RelationTemplate.
 *     A relation can only use the Template, if the start of the Relation has a template in from,
 *     and the end of the Relation has a template in to.
 *     Also defines which InterfaceSpecifications are derived via the Relation.
 *     Part of a RelationTemplate.
 *     READ is always granted.
 *
 */
export type RelationConditionToArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationPartnerTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationPartnerTemplateOrder>;
};

/** The connection type for RelationCondition. */
export type RelationConditionConnection = {
  __typename?: 'RelationConditionConnection';
  /** A list of all edges of the current page. */
  edges: Array<RelationConditionEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<RelationCondition>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type RelationConditionEdge = {
  __typename?: 'RelationConditionEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: RelationCondition;
};

/** Filter used to filter RelationCondition */
export type RelationConditionFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<RelationConditionFilterInput>>;
  /** Filter by from */
  from?: InputMaybe<RelationPartnerTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by interfaceSpecificationDerivationConditions */
  interfaceSpecificationDerivationConditions?: InputMaybe<InterfaceSpecificationDerivationConditionListFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<RelationConditionFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<RelationConditionFilterInput>>;
  /** Filter by partOf */
  partOf?: InputMaybe<RelationTemplateListFilterInput>;
  /** Filter by to */
  to?: InputMaybe<RelationPartnerTemplateListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationConditionListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<RelationConditionFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<RelationConditionFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<RelationConditionFilterInput>;
};

/** Defines the order of a RelationCondition list */
export type RelationConditionOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<RelationConditionOrderField>;
};

/** Fields a list of RelationCondition can be sorted by */
export enum RelationConditionOrderField {
  /** Order by id */
  Id = 'ID'
}

/** The connection type for Relation. */
export type RelationConnection = {
  __typename?: 'RelationConnection';
  /** A list of all edges of the current page. */
  edges: Array<RelationEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Relation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type RelationEdge = {
  __typename?: 'RelationEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Relation;
};

/** Filter used to filter Relation */
export type RelationFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<RelationFilterInput>>;
  /** Filter by derivesInvisible */
  derivesInvisible?: InputMaybe<InterfaceDefinitionListFilterInput>;
  /** Filter by derivesVisible */
  derivesVisible?: InputMaybe<InterfaceDefinitionListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  end?: InputMaybe<RelationPartnerFilterInput>;
  /** Filter by endParts */
  endParts?: InputMaybe<InterfacePartListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<RelationFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<RelationFilterInput>>;
  /** Filters for nodes where the related node match this filter */
  start?: InputMaybe<RelationPartnerFilterInput>;
  /** Filter by startParts */
  startParts?: InputMaybe<InterfacePartListFilterInput>;
  /** Filters for nodes where the related node match this filter */
  template?: InputMaybe<RelationTemplateFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<RelationFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<RelationFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<RelationFilterInput>;
};

/** Defines the order of a Relation list */
export type RelationOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<RelationOrderField>;
};

/** Fields a list of Relation can be sorted by */
export enum RelationOrderField {
  /** Order by id */
  Id = 'ID'
}

/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartner = {
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Relations which use this as the end of the Relation. */
  incomingRelations: RelationConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Relations which use this as the start of the Relation. */
  outgoingRelations: RelationConnection;
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerIncomingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerOutgoingRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerTemplatedFieldArgs = {
  name: Scalars['String'];
};


/** Entity which can be used as start / end of Relations. Can be affected by Issues. */
export type RelationPartnerTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/** Filter used to filter RelationPartner */
export type RelationPartnerFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<RelationPartnerFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by incomingRelations */
  incomingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<RelationPartnerFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<RelationPartnerFilterInput>>;
  /** Filter by outgoingRelations */
  outgoingRelations?: InputMaybe<RelationListFilterInput>;
  /** Filter for templated fields with matching key and values. Entries are joined by AND */
  templatedFields?: InputMaybe<Array<InputMaybe<JsonFieldInput>>>;
};

/** Template for RelationPartners. */
export type RelationPartnerTemplate = {
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** RelationConditions which allow this template for the end of the relation. */
  possibleEndOfRelations: RelationConditionConnection;
  /** RelationConditions which allow this template for the start of the relation. */
  possibleStartOfRelations: RelationConditionConnection;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
};


/** Template for RelationPartners. */
export type RelationPartnerTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Template for RelationPartners. */
export type RelationPartnerTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/** Template for RelationPartners. */
export type RelationPartnerTemplatePossibleEndOfRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/** Template for RelationPartners. */
export type RelationPartnerTemplatePossibleStartOfRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/** Template for RelationPartners. */
export type RelationPartnerTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for RelationPartnerTemplate. */
export type RelationPartnerTemplateConnection = {
  __typename?: 'RelationPartnerTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<RelationPartnerTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<RelationPartnerTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type RelationPartnerTemplateEdge = {
  __typename?: 'RelationPartnerTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: RelationPartnerTemplate;
};

/** Filter used to filter RelationPartnerTemplate */
export type RelationPartnerTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<RelationPartnerTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<RelationPartnerTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<RelationPartnerTemplateFilterInput>>;
  /** Filter by possibleEndOfRelations */
  possibleEndOfRelations?: InputMaybe<RelationConditionListFilterInput>;
  /** Filter by possibleStartOfRelations */
  possibleStartOfRelations?: InputMaybe<RelationConditionListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationPartnerTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<RelationPartnerTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<RelationPartnerTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<RelationPartnerTemplateFilterInput>;
};

/** Defines the order of a RelationPartnerTemplate list */
export type RelationPartnerTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<RelationPartnerTemplateOrderField>;
};

/** Fields a list of RelationPartnerTemplate can be sorted by */
export enum RelationPartnerTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplate = BaseTemplate & ExtensibleNode & Named & NamedNode & Node & Template & {
  __typename?: 'RelationTemplate';
  /** The description of this entity. */
  description: Scalars['String'];
  /** Templates that extend this template. */
  extendedBy: RelationTemplateConnection;
  /** Template this template extends. */
  extends: RelationTemplateConnection;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** Defines which Relations can use this template, at least one RelationCondition has to match */
  relationConditions: RelationConditionConnection;
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
  /** Entities which use this template. */
  usedIn: RelationConnection;
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateExtendedByArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationTemplateOrder>;
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateExtendsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationTemplateFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationTemplateOrder>;
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateRelationConditionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationConditionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationConditionOrder>;
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * Template for Relations.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Defines which Relations can use this Template.
 *     At least one RelationCondition has to match.
 *
 */
export type RelationTemplateUsedInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelationFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RelationOrder>;
};

/** The connection type for RelationTemplate. */
export type RelationTemplateConnection = {
  __typename?: 'RelationTemplateConnection';
  /** A list of all edges of the current page. */
  edges: Array<RelationTemplateEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<RelationTemplate>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type RelationTemplateEdge = {
  __typename?: 'RelationTemplateEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: RelationTemplate;
};

/** Filter used to filter RelationTemplate */
export type RelationTemplateFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<RelationTemplateFilterInput>>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by extendedBy */
  extendedBy?: InputMaybe<RelationTemplateListFilterInput>;
  /** Filter by extends */
  extends?: InputMaybe<RelationTemplateListFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by isDeprecated */
  isDeprecated?: InputMaybe<BooleanFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<RelationTemplateFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<RelationTemplateFilterInput>>;
  /** Filter by relationConditions */
  relationConditions?: InputMaybe<RelationConditionListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationTemplateListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<RelationTemplateFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<RelationTemplateFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<RelationTemplateFilterInput>;
};

/** Defines the order of a RelationTemplate list */
export type RelationTemplateOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<RelationTemplateOrderField>;
};

/** Fields a list of RelationTemplate can be sorted by */
export enum RelationTemplateOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

/** Event representing that an entity is no longer affected by an Issue. */
export type RemovedAffectedEntityEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedAffectedEntityEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The entity which is no longer affected by the Issue. */
  removedAffectedEntity?: Maybe<AffectedByIssue>;
};


/** Event representing that an entity is no longer affected by an Issue. */
export type RemovedAffectedEntityEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an entity is no longer affected by an Issue. */
export type RemovedAffectedEntityEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an Artefact was removed from an Issue. */
export type RemovedArtefactEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedArtefactEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The Artefact which was removed from the Issue. */
  removedArtefact?: Maybe<Artefact>;
};


/** Event representing that an Artefact was removed from an Issue. */
export type RemovedArtefactEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Artefact was removed from an Issue. */
export type RemovedArtefactEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * Event representing that a User was unassigned from an Issue,
 *     meaning an Assignment was removed from an Issue.
 *
 */
export type RemovedAssignmentEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedAssignmentEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The removed Assignment. */
  removedAssignment: Assignment;
};


/**
 * Event representing that a User was unassigned from an Issue,
 *     meaning an Assignment was removed from an Issue.
 *
 */
export type RemovedAssignmentEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Event representing that a User was unassigned from an Issue,
 *     meaning an Assignment was removed from an Issue.
 *
 */
export type RemovedAssignmentEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an Issue was unpinned on a Trackable. */
export type RemovedFromPinnedIssuesEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedFromPinnedIssuesEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The Trackable the Issue is no longer pinned on. */
  unpinnedOn?: Maybe<Trackable>;
};


/** Event representing that an Issue was unpinned on a Trackable. */
export type RemovedFromPinnedIssuesEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Issue was unpinned on a Trackable. */
export type RemovedFromPinnedIssuesEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an Issue was removed from a Trackable. */
export type RemovedFromTrackableEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedFromTrackableEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The Trackable the Issue was removed from. */
  removedFromTrackable?: Maybe<Trackable>;
};


/** Event representing that an Issue was removed from a Trackable. */
export type RemovedFromTrackableEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Issue was removed from a Trackable. */
export type RemovedFromTrackableEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an incoming IssueRelation was removed. */
export type RemovedIncomingRelationEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedIncomingRelationEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The IssueRelation removed from `incomingRelations`. */
  removedRelation?: Maybe<IssueRelation>;
};


/** Event representing that an incoming IssueRelation was removed. */
export type RemovedIncomingRelationEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an incoming IssueRelation was removed. */
export type RemovedIncomingRelationEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that a Label was removed from an Issue. */
export type RemovedLabelEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedLabelEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The Label removed from the Issue. */
  removedLabel?: Maybe<Label>;
};


/** Event representing that a Label was removed from an Issue. */
export type RemovedLabelEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that a Label was removed from an Issue. */
export type RemovedLabelEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an outgoing IssueRelation was removed. */
export type RemovedOutgoingRelationEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'RemovedOutgoingRelationEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The IssueRelation removed from `outgoingRelations`. */
  removedRelation: IssueRelation;
};


/** Event representing that an outgoing IssueRelation was removed. */
export type RemovedOutgoingRelationEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an outgoing IssueRelation was removed. */
export type RemovedOutgoingRelationEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that an Issue was reopened. */
export type ReopenedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'ReopenedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/** Event representing that an Issue was reopened. */
export type ReopenedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that an Issue was reopened. */
export type ReopenedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that the spent time of an Issue changed. */
export type SpentTimeChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'SpentTimeChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The mew spent time. */
  newSpentTime?: Maybe<Scalars['Duration']>;
  /** The old spent time. */
  oldSpentTime?: Maybe<Scalars['Duration']>;
};


/** Event representing that the spent time of an Issue changed. */
export type SpentTimeChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the spent time of an Issue changed. */
export type SpentTimeChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that the start date of an Issue changed. */
export type StartDateChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'StartDateChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new start date. */
  newStartDate?: Maybe<Scalars['DateTime']>;
  /** The old start date. */
  oldStartDate?: Maybe<Scalars['DateTime']>;
};


/** Event representing that the start date of an Issue changed. */
export type StartDateChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the start date of an Issue changed. */
export type StartDateChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Filter which can be used to filter for Nodes with a specific String field */
export type StringFilterInput = {
  /** Matches Strings which contain the provided value */
  contains?: InputMaybe<Scalars['String']>;
  /** Matches Strings which end with the provided value */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Matches values which are equal to the provided value */
  eq?: InputMaybe<Scalars['String']>;
  /** Matches values which are greater than the provided value */
  gt?: InputMaybe<Scalars['String']>;
  /** Matches values which are greater than or equal to the provided value */
  gte?: InputMaybe<Scalars['String']>;
  /** Matches values which are equal to any of the provided values */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Matches values which are lesser than the provided value */
  lt?: InputMaybe<Scalars['String']>;
  /** Matches values which are lesser than or equal to the provided value */
  lte?: InputMaybe<Scalars['String']>;
  /** Matches Strings using the provided RegEx */
  matches?: InputMaybe<Scalars['String']>;
  /** Matches Strings which start with the provided value */
  startsWith?: InputMaybe<Scalars['String']>;
};

/**
 * BaseTemplate which is part of a Template.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Does not provide any composition features, as composition is handled by the Template it is part of.
 *
 */
export type SubTemplate = {
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
};


/**
 * BaseTemplate which is part of a Template.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Does not provide any composition features, as composition is handled by the Template it is part of.
 *
 */
export type SubTemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * BaseTemplate which is part of a Template.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Does not provide any composition features, as composition is handled by the Template it is part of.
 *
 */
export type SubTemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * BaseTemplate which is part of a Template.
 *     Defines templated fields with specific types (defined using JSON schema).
 *     Does not provide any composition features, as composition is handled by the Template it is part of.
 *
 */
export type SubTemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * BaseTemplate with composition features.
 *     Can have SubTemplates.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type Template = {
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** If true, this template is deprecated and cannot be used for new entities any more. */
  isDeprecated: Scalars['Boolean'];
  /** The name of this entity. */
  name: Scalars['String'];
  /** All template field specifications, if a `namePrefix` is provided, only those matching it */
  templateFieldSpecifications: Array<JsonField>;
};


/**
 * BaseTemplate with composition features.
 *     Can have SubTemplates.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type TemplateExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * BaseTemplate with composition features.
 *     Can have SubTemplates.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type TemplateExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * BaseTemplate with composition features.
 *     Can have SubTemplates.
 *     Defines templated fields with specific types (defined using JSON schema).
 *
 */
export type TemplateTemplateFieldSpecificationsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Event representing that the value of a templated field changed. */
export type TemplateFieldChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'TemplateFieldChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The name of the templated field. */
  fieldName: Scalars['String'];
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new value of the templated field. */
  newValue?: Maybe<Scalars['JSON']>;
  /** The old value of the templated field. */
  oldValue?: Maybe<Scalars['JSON']>;
};


/** Event representing that the value of a templated field changed. */
export type TemplateFieldChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the value of a templated field changed. */
export type TemplateFieldChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Interface for all types which support templates. */
export type TemplatedNode = {
  /** Value of a field defined by the template. Error if such a field is not defined. */
  templatedField?: Maybe<Scalars['JSON']>;
  /**
   * All templatedFields
   *         If `names` is provided, only those matching the name. If `prefixMatching` is true, matching is done by
   *         prefix, otherwise by full name.
   *
   */
  templatedFields: Array<JsonField>;
};


/** Interface for all types which support templates. */
export type TemplatedNodeTemplatedFieldArgs = {
  name: Scalars['String'];
};


/** Interface for all types which support templates. */
export type TemplatedNodeTemplatedFieldsArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
  prefixMatching?: InputMaybe<Scalars['Boolean']>;
};

/**
 * Supertype of all timeline items. Always part of an Issue
 *     READ is granted if READ is granted on `issue`.
 *
 */
export type TimelineItem = {
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
};


/**
 * Supertype of all timeline items. Always part of an Issue
 *     READ is granted if READ is granted on `issue`.
 *
 */
export type TimelineItemExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * Supertype of all timeline items. Always part of an Issue
 *     READ is granted if READ is granted on `issue`.
 *
 */
export type TimelineItemExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** The connection type for TimelineItem. */
export type TimelineItemConnection = {
  __typename?: 'TimelineItemConnection';
  /** A list of all edges of the current page. */
  edges: Array<TimelineItemEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<TimelineItem>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type TimelineItemEdge = {
  __typename?: 'TimelineItemEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: TimelineItem;
};

/** Filter used to filter TimelineItem */
export type TimelineItemFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<TimelineItemFilterInput>>;
  /** Filter by createdAt */
  createdAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  createdBy?: InputMaybe<UserFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filters for nodes where the related node match this filter */
  issue?: InputMaybe<IssueFilterInput>;
  /** Filter by lastModifiedAt */
  lastModifiedAt?: InputMaybe<DateTimeFilterInput>;
  /** Filters for nodes where the related node match this filter */
  lastModifiedBy?: InputMaybe<UserFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<TimelineItemFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<TimelineItemFilterInput>>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type TimelineItemListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<TimelineItemFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<TimelineItemFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<TimelineItemFilterInput>;
};

/** Defines the order of a TimelineItem list */
export type TimelineItemOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<TimelineItemOrderField>;
};

/** Fields a list of TimelineItem can be sorted by */
export enum TimelineItemOrderField {
  /** Order by createdAt */
  CreatedAt = 'CREATED_AT',
  /** Order by id */
  Id = 'ID',
  /** Order by lastModifiedAt */
  LastModifiedAt = 'LAST_MODIFIED_AT'
}

/** Event representing that the title of an Issue changed. */
export type TitleChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'TitleChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new title. */
  newTitle: Scalars['String'];
  /** The old title. */
  oldTitle: Scalars['String'];
};


/** Event representing that the title of an Issue changed. */
export type TitleChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the title of an Issue changed. */
export type TitleChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type Trackable = {
  /** The issues which affect this entity */
  affectingIssues: IssueConnection;
  /** Artefacts of this trackable, typically some kind of file. */
  artefacts: ArtefactConnection;
  /** The description of this entity. */
  description: Scalars['String'];
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /**
   * The set of Issues which are part of this Trackable.
   *         An Issue has to be part of a Trackable to use the Labels and Artefacts defined by the Trackable.
   *
   */
  issues: IssueConnection;
  /** The set of Labels which can be added to issues of this trackable. */
  labels: LabelConnection;
  /** The name of this entity. */
  name: Scalars['String'];
  /** Issues which are pinned to this trackable, subset of `issues`. */
  pinnedIssues: IssueConnection;
  /** If existing, the URL of the repository (e.g. a GitHub repository). */
  repositoryURL?: Maybe<Scalars['URL']>;
  /** IMSProjects this Trackable is synced to and from. */
  syncsTo: ImsProjectConnection;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableAffectingIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableArtefactsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ArtefactFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ArtefactOrder>;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableLabelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<LabelFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LabelOrder>;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackablePinnedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};


/**
 * An entity which can have Issues, Labels and Artefacts.
 *     Has pinned issues.
 *     Can be synced to an IMS by creating an IMSProject.
 *     Can be affected by Issues.
 *
 */
export type TrackableSyncsToArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ImsProjectFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImsProjectOrder>;
};

/** The connection type for Trackable. */
export type TrackableConnection = {
  __typename?: 'TrackableConnection';
  /** A list of all edges of the current page. */
  edges: Array<TrackableEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<Trackable>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type TrackableEdge = {
  __typename?: 'TrackableEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Trackable;
};

/** Filter used to filter Trackable */
export type TrackableFilterInput = {
  /** Filter by affectingIssues */
  affectingIssues?: InputMaybe<IssueListFilterInput>;
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<TrackableFilterInput>>;
  /** Filter by artefacts */
  artefacts?: InputMaybe<ArtefactListFilterInput>;
  /** Filter by description */
  description?: InputMaybe<StringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Filter by issues */
  issues?: InputMaybe<IssueListFilterInput>;
  /** Filter by labels */
  labels?: InputMaybe<LabelListFilterInput>;
  /** Filter by name */
  name?: InputMaybe<StringFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<TrackableFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<TrackableFilterInput>>;
  /** Filter by pinnedIssues */
  pinnedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filter by repositoryURL */
  repositoryURL?: InputMaybe<NullableStringFilterInput>;
  /** Filter by syncsTo */
  syncsTo?: InputMaybe<ImsProjectListFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type TrackableListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<TrackableFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<TrackableFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<TrackableFilterInput>;
};

/** Defines the order of a Trackable list */
export type TrackableOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<TrackableOrderField>;
};

/** Fields a list of Trackable can be sorted by */
export enum TrackableOrderField {
  /** Order by id */
  Id = 'ID',
  /** Order by name */
  Name = 'NAME'
}

export type TrackablePermission = ComponentPermission | ProjectPermission;

/** Event representing that the type of an Issue changed. */
export type TypeChangedEvent = AuditedNode & ExtensibleNode & Node & TimelineItem & {
  __typename?: 'TypeChangedEvent';
  /** The DateTime this entity was created at. */
  createdAt: Scalars['DateTime'];
  /** The User who created this entity. */
  createdBy: User;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** The Issue this TimelineItem is part of. */
  issue: Issue;
  /** The DateTime this entity was last modified at. */
  lastModifiedAt: Scalars['DateTime'];
  /** The User who last modified this entity. */
  lastModifiedBy: User;
  /** The new type. */
  newType: IssueType;
  /** The old type. */
  oldType: IssueType;
};


/** Event representing that the type of an Issue changed. */
export type TypeChangedEventExtensionFieldArgs = {
  name: Scalars['String'];
};


/** Event representing that the type of an Issue changed. */
export type TypeChangedEventExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};

/** Input for the updateIMSUser mutation */
export type UpdateImsUserInput = {
  /** The new displayName of the User to update */
  displayName?: InputMaybe<Scalars['String']>;
  /** The new email of the User to update */
  email?: InputMaybe<Scalars['String']>;
  /** Extension fields to update. To remove, provide no value */
  extensionFields?: InputMaybe<Array<JsonFieldInput>>;
  /**
   * The id of the GropiusUser the updated IMSUser is associated with, replaces existing association
   *         or removes it if null is provided.
   *
   */
  gropiusUser?: InputMaybe<Scalars['ID']>;
  /** The id of the node to update */
  id: Scalars['ID'];
  /** Values for templatedFields to update */
  templatedFields?: InputMaybe<Array<JsonFieldInput>>;
  /** The new username of the updated IMSUser */
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateImsUserPayload = {
  __typename?: 'UpdateIMSUserPayload';
  /** The updated IMSUser */
  imsuser?: Maybe<ImsUser>;
};

/**
 * A user known to the Gropius System.
 *     This might be a user that registered directly, or a user the systems know via a sync adapter.
 *     A user can create AuditedNodes, participate in Issues and be assigned to Issues.
 *     READ is always granted.
 *
 */
export type User = {
  /** Assignments the user is part of, this includes assignments which aren't active. */
  assignments: AssignmentConnection;
  /** AuditedNodes the user created. */
  createdNodes: AuditedNodeConnection;
  /** The name which should be displayed for the user. */
  displayName: Scalars['String'];
  /** The email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** Value of an extension field by name of the extension field. Null if the field does not exist. */
  extensionField?: Maybe<Scalars['JSON']>;
  /** All extension fields, if a `namePrefix` is provided, only those matching it */
  extensionFields: Array<JsonField>;
  /** The unique id of this node */
  id: Scalars['ID'];
  /** Issues the user participated in. */
  participatedIssues: IssueConnection;
  /**
   * The identifier of the user.
   *         This is only unique for GropiusUsers, for IMSUsers, no constrains are guaranteed.
   *
   */
  username?: Maybe<Scalars['String']>;
};


/**
 * A user known to the Gropius System.
 *     This might be a user that registered directly, or a user the systems know via a sync adapter.
 *     A user can create AuditedNodes, participate in Issues and be assigned to Issues.
 *     READ is always granted.
 *
 */
export type UserAssignmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AssignmentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssignmentOrder>;
};


/**
 * A user known to the Gropius System.
 *     This might be a user that registered directly, or a user the systems know via a sync adapter.
 *     A user can create AuditedNodes, participate in Issues and be assigned to Issues.
 *     READ is always granted.
 *
 */
export type UserCreatedNodesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AuditedNodeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AuditedNodeOrder>;
};


/**
 * A user known to the Gropius System.
 *     This might be a user that registered directly, or a user the systems know via a sync adapter.
 *     A user can create AuditedNodes, participate in Issues and be assigned to Issues.
 *     READ is always granted.
 *
 */
export type UserExtensionFieldArgs = {
  name: Scalars['String'];
};


/**
 * A user known to the Gropius System.
 *     This might be a user that registered directly, or a user the systems know via a sync adapter.
 *     A user can create AuditedNodes, participate in Issues and be assigned to Issues.
 *     READ is always granted.
 *
 */
export type UserExtensionFieldsArgs = {
  namePrefix?: InputMaybe<Scalars['String']>;
};


/**
 * A user known to the Gropius System.
 *     This might be a user that registered directly, or a user the systems know via a sync adapter.
 *     A user can create AuditedNodes, participate in Issues and be assigned to Issues.
 *     READ is always granted.
 *
 */
export type UserParticipatedIssuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IssueOrder>;
};

/** The connection type for User. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** A list of all edges of the current page. */
  edges: Array<UserEdge>;
  /** A list of all nodes of the current page. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** A cursor used in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

/** Filter used to filter User */
export type UserFilterInput = {
  /** Connects all subformulas via and */
  and?: InputMaybe<Array<UserFilterInput>>;
  /** Filter by assignments */
  assignments?: InputMaybe<AssignmentListFilterInput>;
  /** Filter by createdNodes */
  createdNodes?: InputMaybe<AuditedNodeListFilterInput>;
  /** Filter by displayName */
  displayName?: InputMaybe<StringFilterInput>;
  /** Filter by email */
  email?: InputMaybe<NullableStringFilterInput>;
  /** Filter by id */
  id?: InputMaybe<IdFilterInput>;
  /** Negates the subformula */
  not?: InputMaybe<UserFilterInput>;
  /** Connects all subformulas via or */
  or?: InputMaybe<Array<UserFilterInput>>;
  /** Filter by participatedIssues */
  participatedIssues?: InputMaybe<IssueListFilterInput>;
  /** Filter by username */
  username?: InputMaybe<NullableStringFilterInput>;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type UserListFilterInput = {
  /** Filters for nodes where all of the related nodes match this filter */
  all?: InputMaybe<UserFilterInput>;
  /** Filters for nodes where any of the related nodes match this filter */
  any?: InputMaybe<UserFilterInput>;
  /** Filters for nodes where none of the related nodes match this filter */
  none?: InputMaybe<UserFilterInput>;
};

/** Defines the order of a User list */
export type UserOrder = {
  /** The direction to order by, defaults to ASC */
  direction?: InputMaybe<OrderDirection>;
  /** The field to order by, defaults to ID */
  field?: InputMaybe<UserOrderField>;
};

/** Fields a list of User can be sorted by */
export enum UserOrderField {
  /** Order by displayName */
  DisplayName = 'DISPLAY_NAME',
  /** Order by email */
  Email = 'EMAIL',
  /** Order by id */
  Id = 'ID'
}

/** Entity with a version */
export type Versioned = {
  /** The version of this entity */
  version: Scalars['String'];
};

export type ImsUserWithDetailFragment = { __typename?: 'IMSUser', id: string, username?: string | null, displayName: string, email?: string | null, templatedFields: Array<{ __typename?: 'JSONField', name: string, value?: any | null }>, ims: { __typename?: 'IMS', id: string, name: string, description: string, templatedFields: Array<{ __typename?: 'JSONField', name: string, value?: any | null }> } };

export type GetImsUserDetailsQueryVariables = Exact<{
  imsUserId: Scalars['ID'];
}>;


export type GetImsUserDetailsQuery = { __typename?: 'Query', node?: { __typename?: 'AddedAffectedEntityEvent' } | { __typename?: 'AddedArtefactEvent' } | { __typename?: 'AddedLabelEvent' } | { __typename?: 'AddedToPinnedIssuesEvent' } | { __typename?: 'AddedToTrackableEvent' } | { __typename?: 'Artefact' } | { __typename?: 'ArtefactTemplate' } | { __typename?: 'Assignment' } | { __typename?: 'AssignmentType' } | { __typename?: 'Body' } | { __typename?: 'ClosedEvent' } | { __typename?: 'Component' } | { __typename?: 'ComponentPermission' } | { __typename?: 'ComponentTemplate' } | { __typename?: 'ComponentVersion' } | { __typename?: 'ComponentVersionTemplate' } | { __typename?: 'DueDateChangedEvent' } | { __typename?: 'EstimatedTimeChangedEvent' } | { __typename?: 'GlobalPermission' } | { __typename?: 'GropiusUser' } | { __typename?: 'IMS' } | { __typename?: 'IMSIssue' } | { __typename?: 'IMSIssueTemplate' } | { __typename?: 'IMSPermission' } | { __typename?: 'IMSProject' } | { __typename?: 'IMSProjectTemplate' } | { __typename?: 'IMSTemplate' } | { __typename?: 'IMSUser', id: string, username?: string | null, displayName: string, email?: string | null, templatedFields: Array<{ __typename?: 'JSONField', name: string, value?: any | null }>, ims: { __typename?: 'IMS', id: string, name: string, description: string, templatedFields: Array<{ __typename?: 'JSONField', name: string, value?: any | null }> } } | { __typename?: 'IMSUserTemplate' } | { __typename?: 'Interface' } | { __typename?: 'InterfaceDefinition' } | { __typename?: 'InterfaceDefinitionTemplate' } | { __typename?: 'InterfacePart' } | { __typename?: 'InterfacePartTemplate' } | { __typename?: 'InterfaceSpecification' } | { __typename?: 'InterfaceSpecificationDerivationCondition' } | { __typename?: 'InterfaceSpecificationTemplate' } | { __typename?: 'InterfaceSpecificationVersion' } | { __typename?: 'InterfaceSpecificationVersionTemplate' } | { __typename?: 'InterfaceTemplate' } | { __typename?: 'IntraComponentDependencyParticipant' } | { __typename?: 'IntraComponentDependencySpecification' } | { __typename?: 'Issue' } | { __typename?: 'IssueComment' } | { __typename?: 'IssuePriority' } | { __typename?: 'IssueRelation' } | { __typename?: 'IssueRelationType' } | { __typename?: 'IssueTemplate' } | { __typename?: 'IssueType' } | { __typename?: 'Label' } | { __typename?: 'PriorityChangedEvent' } | { __typename?: 'Project' } | { __typename?: 'ProjectPermission' } | { __typename?: 'RelatedByIssueEvent' } | { __typename?: 'Relation' } | { __typename?: 'RelationCondition' } | { __typename?: 'RelationTemplate' } | { __typename?: 'RemovedAffectedEntityEvent' } | { __typename?: 'RemovedArtefactEvent' } | { __typename?: 'RemovedAssignmentEvent' } | { __typename?: 'RemovedFromPinnedIssuesEvent' } | { __typename?: 'RemovedFromTrackableEvent' } | { __typename?: 'RemovedIncomingRelationEvent' } | { __typename?: 'RemovedLabelEvent' } | { __typename?: 'RemovedOutgoingRelationEvent' } | { __typename?: 'ReopenedEvent' } | { __typename?: 'SpentTimeChangedEvent' } | { __typename?: 'StartDateChangedEvent' } | { __typename?: 'TemplateFieldChangedEvent' } | { __typename?: 'TitleChangedEvent' } | { __typename?: 'TypeChangedEvent' } | null };

export type GetImsUsersByTemplatedFieldValuesQueryVariables = Exact<{
  imsFilterInput: ImsFilterInput;
  userFilterInput: ImsUserFilterInput;
}>;


export type GetImsUsersByTemplatedFieldValuesQuery = { __typename?: 'Query', imss: { __typename?: 'IMSConnection', nodes: Array<{ __typename?: 'IMS', id: string, users: { __typename?: 'IMSUserConnection', nodes: Array<{ __typename?: 'IMSUser', id: string }> } }> } };

export type CreateNewImsUserInImsMutationVariables = Exact<{
  input: CreateImsUserInput;
}>;


export type CreateNewImsUserInImsMutation = { __typename?: 'Mutation', createIMSUser?: { __typename?: 'CreateIMSUserPayload', imsuser?: { __typename?: 'IMSUser', id: string } | null } | null };

export type GetBasicGropiusUserDataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetBasicGropiusUserDataQuery = { __typename?: 'Query', node?: { __typename?: 'AddedAffectedEntityEvent' } | { __typename?: 'AddedArtefactEvent' } | { __typename?: 'AddedLabelEvent' } | { __typename?: 'AddedToPinnedIssuesEvent' } | { __typename?: 'AddedToTrackableEvent' } | { __typename?: 'Artefact' } | { __typename?: 'ArtefactTemplate' } | { __typename?: 'Assignment' } | { __typename?: 'AssignmentType' } | { __typename?: 'Body' } | { __typename?: 'ClosedEvent' } | { __typename?: 'Component' } | { __typename?: 'ComponentPermission' } | { __typename?: 'ComponentTemplate' } | { __typename?: 'ComponentVersion' } | { __typename?: 'ComponentVersionTemplate' } | { __typename?: 'DueDateChangedEvent' } | { __typename?: 'EstimatedTimeChangedEvent' } | { __typename?: 'GlobalPermission' } | { __typename?: 'GropiusUser', id: string, username: string, displayName: string, email?: string | null } | { __typename?: 'IMS' } | { __typename?: 'IMSIssue' } | { __typename?: 'IMSIssueTemplate' } | { __typename?: 'IMSPermission' } | { __typename?: 'IMSProject' } | { __typename?: 'IMSProjectTemplate' } | { __typename?: 'IMSTemplate' } | { __typename?: 'IMSUser' } | { __typename?: 'IMSUserTemplate' } | { __typename?: 'Interface' } | { __typename?: 'InterfaceDefinition' } | { __typename?: 'InterfaceDefinitionTemplate' } | { __typename?: 'InterfacePart' } | { __typename?: 'InterfacePartTemplate' } | { __typename?: 'InterfaceSpecification' } | { __typename?: 'InterfaceSpecificationDerivationCondition' } | { __typename?: 'InterfaceSpecificationTemplate' } | { __typename?: 'InterfaceSpecificationVersion' } | { __typename?: 'InterfaceSpecificationVersionTemplate' } | { __typename?: 'InterfaceTemplate' } | { __typename?: 'IntraComponentDependencyParticipant' } | { __typename?: 'IntraComponentDependencySpecification' } | { __typename?: 'Issue' } | { __typename?: 'IssueComment' } | { __typename?: 'IssuePriority' } | { __typename?: 'IssueRelation' } | { __typename?: 'IssueRelationType' } | { __typename?: 'IssueTemplate' } | { __typename?: 'IssueType' } | { __typename?: 'Label' } | { __typename?: 'PriorityChangedEvent' } | { __typename?: 'Project' } | { __typename?: 'ProjectPermission' } | { __typename?: 'RelatedByIssueEvent' } | { __typename?: 'Relation' } | { __typename?: 'RelationCondition' } | { __typename?: 'RelationTemplate' } | { __typename?: 'RemovedAffectedEntityEvent' } | { __typename?: 'RemovedArtefactEvent' } | { __typename?: 'RemovedAssignmentEvent' } | { __typename?: 'RemovedFromPinnedIssuesEvent' } | { __typename?: 'RemovedFromTrackableEvent' } | { __typename?: 'RemovedIncomingRelationEvent' } | { __typename?: 'RemovedLabelEvent' } | { __typename?: 'RemovedOutgoingRelationEvent' } | { __typename?: 'ReopenedEvent' } | { __typename?: 'SpentTimeChangedEvent' } | { __typename?: 'StartDateChangedEvent' } | { __typename?: 'TemplateFieldChangedEvent' } | { __typename?: 'TitleChangedEvent' } | { __typename?: 'TypeChangedEvent' } | null };

export type GetUserByNameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserByNameQuery = { __typename?: 'Query', gropiusUser: { __typename?: 'GropiusUser', id: string, username: string, displayName: string, email?: string | null } };

export type CheckUserIsAdminQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CheckUserIsAdminQuery = { __typename?: 'Query', node?: { __typename?: 'AddedAffectedEntityEvent' } | { __typename?: 'AddedArtefactEvent' } | { __typename?: 'AddedLabelEvent' } | { __typename?: 'AddedToPinnedIssuesEvent' } | { __typename?: 'AddedToTrackableEvent' } | { __typename?: 'Artefact' } | { __typename?: 'ArtefactTemplate' } | { __typename?: 'Assignment' } | { __typename?: 'AssignmentType' } | { __typename?: 'Body' } | { __typename?: 'ClosedEvent' } | { __typename?: 'Component' } | { __typename?: 'ComponentPermission' } | { __typename?: 'ComponentTemplate' } | { __typename?: 'ComponentVersion' } | { __typename?: 'ComponentVersionTemplate' } | { __typename?: 'DueDateChangedEvent' } | { __typename?: 'EstimatedTimeChangedEvent' } | { __typename?: 'GlobalPermission' } | { __typename?: 'GropiusUser', id: string, isAdmin: boolean } | { __typename?: 'IMS' } | { __typename?: 'IMSIssue' } | { __typename?: 'IMSIssueTemplate' } | { __typename?: 'IMSPermission' } | { __typename?: 'IMSProject' } | { __typename?: 'IMSProjectTemplate' } | { __typename?: 'IMSTemplate' } | { __typename?: 'IMSUser' } | { __typename?: 'IMSUserTemplate' } | { __typename?: 'Interface' } | { __typename?: 'InterfaceDefinition' } | { __typename?: 'InterfaceDefinitionTemplate' } | { __typename?: 'InterfacePart' } | { __typename?: 'InterfacePartTemplate' } | { __typename?: 'InterfaceSpecification' } | { __typename?: 'InterfaceSpecificationDerivationCondition' } | { __typename?: 'InterfaceSpecificationTemplate' } | { __typename?: 'InterfaceSpecificationVersion' } | { __typename?: 'InterfaceSpecificationVersionTemplate' } | { __typename?: 'InterfaceTemplate' } | { __typename?: 'IntraComponentDependencyParticipant' } | { __typename?: 'IntraComponentDependencySpecification' } | { __typename?: 'Issue' } | { __typename?: 'IssueComment' } | { __typename?: 'IssuePriority' } | { __typename?: 'IssueRelation' } | { __typename?: 'IssueRelationType' } | { __typename?: 'IssueTemplate' } | { __typename?: 'IssueType' } | { __typename?: 'Label' } | { __typename?: 'PriorityChangedEvent' } | { __typename?: 'Project' } | { __typename?: 'ProjectPermission' } | { __typename?: 'RelatedByIssueEvent' } | { __typename?: 'Relation' } | { __typename?: 'RelationCondition' } | { __typename?: 'RelationTemplate' } | { __typename?: 'RemovedAffectedEntityEvent' } | { __typename?: 'RemovedArtefactEvent' } | { __typename?: 'RemovedAssignmentEvent' } | { __typename?: 'RemovedFromPinnedIssuesEvent' } | { __typename?: 'RemovedFromTrackableEvent' } | { __typename?: 'RemovedIncomingRelationEvent' } | { __typename?: 'RemovedLabelEvent' } | { __typename?: 'RemovedOutgoingRelationEvent' } | { __typename?: 'ReopenedEvent' } | { __typename?: 'SpentTimeChangedEvent' } | { __typename?: 'StartDateChangedEvent' } | { __typename?: 'TemplateFieldChangedEvent' } | { __typename?: 'TitleChangedEvent' } | { __typename?: 'TypeChangedEvent' } | null };

export type CreateNewUserMutationVariables = Exact<{
  input: CreateGropiusUserInput;
}>;


export type CreateNewUserMutation = { __typename?: 'Mutation', createGropiusUser?: { __typename?: 'CreateGropiusUserPayload', gropiusUser?: { __typename?: 'GropiusUser', id: string, username: string, displayName: string, email?: string | null } | null } | null };

export type SetImsUserLinkMutationVariables = Exact<{
  gropiusUserId: Scalars['ID'];
  imsUserId: Scalars['ID'];
}>;


export type SetImsUserLinkMutation = { __typename?: 'Mutation', updateIMSUser?: { __typename?: 'UpdateIMSUserPayload', imsuser?: { __typename?: 'IMSUser', id: string } | null } | null };

type OnlyId_AddedAffectedEntityEvent_Fragment = { __typename?: 'AddedAffectedEntityEvent', id: string };

type OnlyId_AddedArtefactEvent_Fragment = { __typename?: 'AddedArtefactEvent', id: string };

type OnlyId_AddedLabelEvent_Fragment = { __typename?: 'AddedLabelEvent', id: string };

type OnlyId_AddedToPinnedIssuesEvent_Fragment = { __typename?: 'AddedToPinnedIssuesEvent', id: string };

type OnlyId_AddedToTrackableEvent_Fragment = { __typename?: 'AddedToTrackableEvent', id: string };

type OnlyId_Artefact_Fragment = { __typename?: 'Artefact', id: string };

type OnlyId_ArtefactTemplate_Fragment = { __typename?: 'ArtefactTemplate', id: string };

type OnlyId_Assignment_Fragment = { __typename?: 'Assignment', id: string };

type OnlyId_AssignmentType_Fragment = { __typename?: 'AssignmentType', id: string };

type OnlyId_Body_Fragment = { __typename?: 'Body', id: string };

type OnlyId_ClosedEvent_Fragment = { __typename?: 'ClosedEvent', id: string };

type OnlyId_Component_Fragment = { __typename?: 'Component', id: string };

type OnlyId_ComponentPermission_Fragment = { __typename?: 'ComponentPermission', id: string };

type OnlyId_ComponentTemplate_Fragment = { __typename?: 'ComponentTemplate', id: string };

type OnlyId_ComponentVersion_Fragment = { __typename?: 'ComponentVersion', id: string };

type OnlyId_ComponentVersionTemplate_Fragment = { __typename?: 'ComponentVersionTemplate', id: string };

type OnlyId_DueDateChangedEvent_Fragment = { __typename?: 'DueDateChangedEvent', id: string };

type OnlyId_EstimatedTimeChangedEvent_Fragment = { __typename?: 'EstimatedTimeChangedEvent', id: string };

type OnlyId_GlobalPermission_Fragment = { __typename?: 'GlobalPermission', id: string };

type OnlyId_GropiusUser_Fragment = { __typename?: 'GropiusUser', id: string };

type OnlyId_Ims_Fragment = { __typename?: 'IMS', id: string };

type OnlyId_ImsIssue_Fragment = { __typename?: 'IMSIssue', id: string };

type OnlyId_ImsIssueTemplate_Fragment = { __typename?: 'IMSIssueTemplate', id: string };

type OnlyId_ImsPermission_Fragment = { __typename?: 'IMSPermission', id: string };

type OnlyId_ImsProject_Fragment = { __typename?: 'IMSProject', id: string };

type OnlyId_ImsProjectTemplate_Fragment = { __typename?: 'IMSProjectTemplate', id: string };

type OnlyId_ImsTemplate_Fragment = { __typename?: 'IMSTemplate', id: string };

type OnlyId_ImsUser_Fragment = { __typename?: 'IMSUser', id: string };

type OnlyId_ImsUserTemplate_Fragment = { __typename?: 'IMSUserTemplate', id: string };

type OnlyId_Interface_Fragment = { __typename?: 'Interface', id: string };

type OnlyId_InterfaceDefinition_Fragment = { __typename?: 'InterfaceDefinition', id: string };

type OnlyId_InterfaceDefinitionTemplate_Fragment = { __typename?: 'InterfaceDefinitionTemplate', id: string };

type OnlyId_InterfacePart_Fragment = { __typename?: 'InterfacePart', id: string };

type OnlyId_InterfacePartTemplate_Fragment = { __typename?: 'InterfacePartTemplate', id: string };

type OnlyId_InterfaceSpecification_Fragment = { __typename?: 'InterfaceSpecification', id: string };

type OnlyId_InterfaceSpecificationDerivationCondition_Fragment = { __typename?: 'InterfaceSpecificationDerivationCondition', id: string };

type OnlyId_InterfaceSpecificationTemplate_Fragment = { __typename?: 'InterfaceSpecificationTemplate', id: string };

type OnlyId_InterfaceSpecificationVersion_Fragment = { __typename?: 'InterfaceSpecificationVersion', id: string };

type OnlyId_InterfaceSpecificationVersionTemplate_Fragment = { __typename?: 'InterfaceSpecificationVersionTemplate', id: string };

type OnlyId_InterfaceTemplate_Fragment = { __typename?: 'InterfaceTemplate', id: string };

type OnlyId_IntraComponentDependencyParticipant_Fragment = { __typename?: 'IntraComponentDependencyParticipant', id: string };

type OnlyId_IntraComponentDependencySpecification_Fragment = { __typename?: 'IntraComponentDependencySpecification', id: string };

type OnlyId_Issue_Fragment = { __typename?: 'Issue', id: string };

type OnlyId_IssueComment_Fragment = { __typename?: 'IssueComment', id: string };

type OnlyId_IssuePriority_Fragment = { __typename?: 'IssuePriority', id: string };

type OnlyId_IssueRelation_Fragment = { __typename?: 'IssueRelation', id: string };

type OnlyId_IssueRelationType_Fragment = { __typename?: 'IssueRelationType', id: string };

type OnlyId_IssueTemplate_Fragment = { __typename?: 'IssueTemplate', id: string };

type OnlyId_IssueType_Fragment = { __typename?: 'IssueType', id: string };

type OnlyId_Label_Fragment = { __typename?: 'Label', id: string };

type OnlyId_PriorityChangedEvent_Fragment = { __typename?: 'PriorityChangedEvent', id: string };

type OnlyId_Project_Fragment = { __typename?: 'Project', id: string };

type OnlyId_ProjectPermission_Fragment = { __typename?: 'ProjectPermission', id: string };

type OnlyId_RelatedByIssueEvent_Fragment = { __typename?: 'RelatedByIssueEvent', id: string };

type OnlyId_Relation_Fragment = { __typename?: 'Relation', id: string };

type OnlyId_RelationCondition_Fragment = { __typename?: 'RelationCondition', id: string };

type OnlyId_RelationTemplate_Fragment = { __typename?: 'RelationTemplate', id: string };

type OnlyId_RemovedAffectedEntityEvent_Fragment = { __typename?: 'RemovedAffectedEntityEvent', id: string };

type OnlyId_RemovedArtefactEvent_Fragment = { __typename?: 'RemovedArtefactEvent', id: string };

type OnlyId_RemovedAssignmentEvent_Fragment = { __typename?: 'RemovedAssignmentEvent', id: string };

type OnlyId_RemovedFromPinnedIssuesEvent_Fragment = { __typename?: 'RemovedFromPinnedIssuesEvent', id: string };

type OnlyId_RemovedFromTrackableEvent_Fragment = { __typename?: 'RemovedFromTrackableEvent', id: string };

type OnlyId_RemovedIncomingRelationEvent_Fragment = { __typename?: 'RemovedIncomingRelationEvent', id: string };

type OnlyId_RemovedLabelEvent_Fragment = { __typename?: 'RemovedLabelEvent', id: string };

type OnlyId_RemovedOutgoingRelationEvent_Fragment = { __typename?: 'RemovedOutgoingRelationEvent', id: string };

type OnlyId_ReopenedEvent_Fragment = { __typename?: 'ReopenedEvent', id: string };

type OnlyId_SpentTimeChangedEvent_Fragment = { __typename?: 'SpentTimeChangedEvent', id: string };

type OnlyId_StartDateChangedEvent_Fragment = { __typename?: 'StartDateChangedEvent', id: string };

type OnlyId_TemplateFieldChangedEvent_Fragment = { __typename?: 'TemplateFieldChangedEvent', id: string };

type OnlyId_TitleChangedEvent_Fragment = { __typename?: 'TitleChangedEvent', id: string };

type OnlyId_TypeChangedEvent_Fragment = { __typename?: 'TypeChangedEvent', id: string };

export type OnlyIdFragment = OnlyId_AddedAffectedEntityEvent_Fragment | OnlyId_AddedArtefactEvent_Fragment | OnlyId_AddedLabelEvent_Fragment | OnlyId_AddedToPinnedIssuesEvent_Fragment | OnlyId_AddedToTrackableEvent_Fragment | OnlyId_Artefact_Fragment | OnlyId_ArtefactTemplate_Fragment | OnlyId_Assignment_Fragment | OnlyId_AssignmentType_Fragment | OnlyId_Body_Fragment | OnlyId_ClosedEvent_Fragment | OnlyId_Component_Fragment | OnlyId_ComponentPermission_Fragment | OnlyId_ComponentTemplate_Fragment | OnlyId_ComponentVersion_Fragment | OnlyId_ComponentVersionTemplate_Fragment | OnlyId_DueDateChangedEvent_Fragment | OnlyId_EstimatedTimeChangedEvent_Fragment | OnlyId_GlobalPermission_Fragment | OnlyId_GropiusUser_Fragment | OnlyId_Ims_Fragment | OnlyId_ImsIssue_Fragment | OnlyId_ImsIssueTemplate_Fragment | OnlyId_ImsPermission_Fragment | OnlyId_ImsProject_Fragment | OnlyId_ImsProjectTemplate_Fragment | OnlyId_ImsTemplate_Fragment | OnlyId_ImsUser_Fragment | OnlyId_ImsUserTemplate_Fragment | OnlyId_Interface_Fragment | OnlyId_InterfaceDefinition_Fragment | OnlyId_InterfaceDefinitionTemplate_Fragment | OnlyId_InterfacePart_Fragment | OnlyId_InterfacePartTemplate_Fragment | OnlyId_InterfaceSpecification_Fragment | OnlyId_InterfaceSpecificationDerivationCondition_Fragment | OnlyId_InterfaceSpecificationTemplate_Fragment | OnlyId_InterfaceSpecificationVersion_Fragment | OnlyId_InterfaceSpecificationVersionTemplate_Fragment | OnlyId_InterfaceTemplate_Fragment | OnlyId_IntraComponentDependencyParticipant_Fragment | OnlyId_IntraComponentDependencySpecification_Fragment | OnlyId_Issue_Fragment | OnlyId_IssueComment_Fragment | OnlyId_IssuePriority_Fragment | OnlyId_IssueRelation_Fragment | OnlyId_IssueRelationType_Fragment | OnlyId_IssueTemplate_Fragment | OnlyId_IssueType_Fragment | OnlyId_Label_Fragment | OnlyId_PriorityChangedEvent_Fragment | OnlyId_Project_Fragment | OnlyId_ProjectPermission_Fragment | OnlyId_RelatedByIssueEvent_Fragment | OnlyId_Relation_Fragment | OnlyId_RelationCondition_Fragment | OnlyId_RelationTemplate_Fragment | OnlyId_RemovedAffectedEntityEvent_Fragment | OnlyId_RemovedArtefactEvent_Fragment | OnlyId_RemovedAssignmentEvent_Fragment | OnlyId_RemovedFromPinnedIssuesEvent_Fragment | OnlyId_RemovedFromTrackableEvent_Fragment | OnlyId_RemovedIncomingRelationEvent_Fragment | OnlyId_RemovedLabelEvent_Fragment | OnlyId_RemovedOutgoingRelationEvent_Fragment | OnlyId_ReopenedEvent_Fragment | OnlyId_SpentTimeChangedEvent_Fragment | OnlyId_StartDateChangedEvent_Fragment | OnlyId_TemplateFieldChangedEvent_Fragment | OnlyId_TitleChangedEvent_Fragment | OnlyId_TypeChangedEvent_Fragment;

export type UserDataFragment = { __typename?: 'GropiusUser', id: string, username: string, displayName: string, email?: string | null };

export const ImsUserWithDetailFragmentDoc = gql`
    fragment ImsUserWithDetail on IMSUser {
  id
  username
  displayName
  email
  templatedFields {
    name
    value
  }
  ims {
    id
    name
    description
    templatedFields {
      name
      value
    }
  }
}
    `;
export const OnlyIdFragmentDoc = gql`
    fragment OnlyId on Node {
  id
}
    `;
export const UserDataFragmentDoc = gql`
    fragment UserData on GropiusUser {
  id
  username
  displayName
  email
}
    `;
export const GetImsUserDetailsDocument = gql`
    query getImsUserDetails($imsUserId: ID!) {
  node(id: $imsUserId) {
    ...ImsUserWithDetail
  }
}
    ${ImsUserWithDetailFragmentDoc}`;
export const GetImsUsersByTemplatedFieldValuesDocument = gql`
    query getImsUsersByTemplatedFieldValues($imsFilterInput: IMSFilterInput!, $userFilterInput: IMSUserFilterInput!) {
  imss(filter: $imsFilterInput) {
    nodes {
      id
      users(filter: $userFilterInput) {
        nodes {
          id
        }
      }
    }
  }
}
    `;
export const CreateNewImsUserInImsDocument = gql`
    mutation createNewImsUserInIms($input: CreateIMSUserInput!) {
  createIMSUser(input: $input) {
    imsuser {
      id
    }
  }
}
    `;
export const GetBasicGropiusUserDataDocument = gql`
    query getBasicGropiusUserData($id: ID!) {
  node(id: $id) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export const GetUserByNameDocument = gql`
    query getUserByName($username: String!) {
  gropiusUser(username: $username) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export const CheckUserIsAdminDocument = gql`
    query checkUserIsAdmin($id: ID!) {
  node(id: "") {
    ... on GropiusUser {
      id
      isAdmin
    }
  }
}
    `;
export const CreateNewUserDocument = gql`
    mutation createNewUser($input: CreateGropiusUserInput!) {
  createGropiusUser(input: $input) {
    gropiusUser {
      ...UserData
    }
  }
}
    ${UserDataFragmentDoc}`;
export const SetImsUserLinkDocument = gql`
    mutation setImsUserLink($gropiusUserId: ID!, $imsUserId: ID!) {
  updateIMSUser(input: {id: $imsUserId, gropiusUser: $gropiusUserId}) {
    imsuser {
      id
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getImsUserDetails(variables: GetImsUserDetailsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetImsUserDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetImsUserDetailsQuery>(GetImsUserDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getImsUserDetails', 'query');
    },
    getImsUsersByTemplatedFieldValues(variables: GetImsUsersByTemplatedFieldValuesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetImsUsersByTemplatedFieldValuesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetImsUsersByTemplatedFieldValuesQuery>(GetImsUsersByTemplatedFieldValuesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getImsUsersByTemplatedFieldValues', 'query');
    },
    createNewImsUserInIms(variables: CreateNewImsUserInImsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateNewImsUserInImsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateNewImsUserInImsMutation>(CreateNewImsUserInImsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createNewImsUserInIms', 'mutation');
    },
    getBasicGropiusUserData(variables: GetBasicGropiusUserDataQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBasicGropiusUserDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBasicGropiusUserDataQuery>(GetBasicGropiusUserDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBasicGropiusUserData', 'query');
    },
    getUserByName(variables: GetUserByNameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserByNameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserByNameQuery>(GetUserByNameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserByName', 'query');
    },
    checkUserIsAdmin(variables: CheckUserIsAdminQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CheckUserIsAdminQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckUserIsAdminQuery>(CheckUserIsAdminDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'checkUserIsAdmin', 'query');
    },
    createNewUser(variables: CreateNewUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateNewUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateNewUserMutation>(CreateNewUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createNewUser', 'mutation');
    },
    setImsUserLink(variables: SetImsUserLinkMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetImsUserLinkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetImsUserLinkMutation>(SetImsUserLinkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setImsUserLink', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "AffectedByIssue": [
      "Component",
      "ComponentVersion",
      "Interface",
      "InterfacePart",
      "InterfaceSpecification",
      "InterfaceSpecificationVersion",
      "Project"
    ],
    "AuditedNode": [
      "AddedAffectedEntityEvent",
      "AddedArtefactEvent",
      "AddedLabelEvent",
      "AddedToPinnedIssuesEvent",
      "AddedToTrackableEvent",
      "Artefact",
      "Assignment",
      "Body",
      "ClosedEvent",
      "DueDateChangedEvent",
      "EstimatedTimeChangedEvent",
      "Issue",
      "IssueComment",
      "IssueRelation",
      "Label",
      "PriorityChangedEvent",
      "RelatedByIssueEvent",
      "RemovedAffectedEntityEvent",
      "RemovedArtefactEvent",
      "RemovedAssignmentEvent",
      "RemovedFromPinnedIssuesEvent",
      "RemovedFromTrackableEvent",
      "RemovedIncomingRelationEvent",
      "RemovedLabelEvent",
      "RemovedOutgoingRelationEvent",
      "ReopenedEvent",
      "SpentTimeChangedEvent",
      "StartDateChangedEvent",
      "TemplateFieldChangedEvent",
      "TitleChangedEvent",
      "TypeChangedEvent"
    ],
    "BasePermission": [],
    "BaseTemplate": [
      "ArtefactTemplate",
      "ComponentTemplate",
      "ComponentVersionTemplate",
      "IMSIssueTemplate",
      "IMSProjectTemplate",
      "IMSTemplate",
      "IMSUserTemplate",
      "InterfaceDefinitionTemplate",
      "InterfacePartTemplate",
      "InterfaceSpecificationTemplate",
      "InterfaceSpecificationVersionTemplate",
      "InterfaceTemplate",
      "IssueTemplate",
      "RelationTemplate"
    ],
    "Comment": [
      "Body",
      "IssueComment"
    ],
    "ExtensibleNode": [
      "AddedAffectedEntityEvent",
      "AddedArtefactEvent",
      "AddedLabelEvent",
      "AddedToPinnedIssuesEvent",
      "AddedToTrackableEvent",
      "Artefact",
      "ArtefactTemplate",
      "Assignment",
      "AssignmentType",
      "Body",
      "ClosedEvent",
      "Component",
      "ComponentTemplate",
      "ComponentVersion",
      "ComponentVersionTemplate",
      "DueDateChangedEvent",
      "EstimatedTimeChangedEvent",
      "GropiusUser",
      "IMS",
      "IMSIssue",
      "IMSIssueTemplate",
      "IMSProject",
      "IMSProjectTemplate",
      "IMSTemplate",
      "IMSUser",
      "IMSUserTemplate",
      "Interface",
      "InterfaceDefinition",
      "InterfaceDefinitionTemplate",
      "InterfacePart",
      "InterfacePartTemplate",
      "InterfaceSpecification",
      "InterfaceSpecificationDerivationCondition",
      "InterfaceSpecificationTemplate",
      "InterfaceSpecificationVersion",
      "InterfaceSpecificationVersionTemplate",
      "InterfaceTemplate",
      "IntraComponentDependencyParticipant",
      "IntraComponentDependencySpecification",
      "Issue",
      "IssueComment",
      "IssuePriority",
      "IssueRelation",
      "IssueRelationType",
      "IssueTemplate",
      "IssueType",
      "Label",
      "PriorityChangedEvent",
      "Project",
      "RelatedByIssueEvent",
      "Relation",
      "RelationCondition",
      "RelationTemplate",
      "RemovedAffectedEntityEvent",
      "RemovedArtefactEvent",
      "RemovedAssignmentEvent",
      "RemovedFromPinnedIssuesEvent",
      "RemovedFromTrackableEvent",
      "RemovedIncomingRelationEvent",
      "RemovedLabelEvent",
      "RemovedOutgoingRelationEvent",
      "ReopenedEvent",
      "SpentTimeChangedEvent",
      "StartDateChangedEvent",
      "TemplateFieldChangedEvent",
      "TitleChangedEvent",
      "TypeChangedEvent"
    ],
    "MutableTemplatedNode": [
      "Artefact",
      "Component",
      "ComponentVersion",
      "IMS",
      "IMSProject",
      "Interface",
      "InterfaceDefinition",
      "InterfacePart",
      "InterfaceSpecification",
      "InterfaceSpecificationVersion",
      "Issue",
      "Relation"
    ],
    "Named": [
      "ArtefactTemplate",
      "AssignmentType",
      "Component",
      "ComponentPermission",
      "ComponentTemplate",
      "ComponentVersion",
      "ComponentVersionTemplate",
      "GlobalPermission",
      "IMS",
      "IMSIssueTemplate",
      "IMSPermission",
      "IMSProjectTemplate",
      "IMSTemplate",
      "IMSUserTemplate",
      "Interface",
      "InterfaceDefinitionTemplate",
      "InterfacePart",
      "InterfacePartTemplate",
      "InterfaceSpecification",
      "InterfaceSpecificationTemplate",
      "InterfaceSpecificationVersion",
      "InterfaceSpecificationVersionTemplate",
      "InterfaceTemplate",
      "IntraComponentDependencySpecification",
      "IssuePriority",
      "IssueRelationType",
      "IssueTemplate",
      "IssueType",
      "Label",
      "Project",
      "ProjectPermission",
      "RelationTemplate"
    ],
    "NamedAuditedNode": [
      "Label"
    ],
    "NamedNode": [
      "ArtefactTemplate",
      "AssignmentType",
      "Component",
      "ComponentTemplate",
      "ComponentVersion",
      "ComponentVersionTemplate",
      "IMS",
      "IMSIssueTemplate",
      "IMSProjectTemplate",
      "IMSTemplate",
      "IMSUserTemplate",
      "Interface",
      "InterfaceDefinitionTemplate",
      "InterfacePart",
      "InterfacePartTemplate",
      "InterfaceSpecification",
      "InterfaceSpecificationTemplate",
      "InterfaceSpecificationVersion",
      "InterfaceSpecificationVersionTemplate",
      "InterfaceTemplate",
      "IntraComponentDependencySpecification",
      "IssuePriority",
      "IssueRelationType",
      "IssueTemplate",
      "IssueType",
      "Project",
      "RelationTemplate"
    ],
    "Node": [
      "AddedAffectedEntityEvent",
      "AddedArtefactEvent",
      "AddedLabelEvent",
      "AddedToPinnedIssuesEvent",
      "AddedToTrackableEvent",
      "Artefact",
      "ArtefactTemplate",
      "Assignment",
      "AssignmentType",
      "Body",
      "ClosedEvent",
      "Component",
      "ComponentPermission",
      "ComponentTemplate",
      "ComponentVersion",
      "ComponentVersionTemplate",
      "DueDateChangedEvent",
      "EstimatedTimeChangedEvent",
      "GlobalPermission",
      "GropiusUser",
      "IMS",
      "IMSIssue",
      "IMSIssueTemplate",
      "IMSPermission",
      "IMSProject",
      "IMSProjectTemplate",
      "IMSTemplate",
      "IMSUser",
      "IMSUserTemplate",
      "Interface",
      "InterfaceDefinition",
      "InterfaceDefinitionTemplate",
      "InterfacePart",
      "InterfacePartTemplate",
      "InterfaceSpecification",
      "InterfaceSpecificationDerivationCondition",
      "InterfaceSpecificationTemplate",
      "InterfaceSpecificationVersion",
      "InterfaceSpecificationVersionTemplate",
      "InterfaceTemplate",
      "IntraComponentDependencyParticipant",
      "IntraComponentDependencySpecification",
      "Issue",
      "IssueComment",
      "IssuePriority",
      "IssueRelation",
      "IssueRelationType",
      "IssueTemplate",
      "IssueType",
      "Label",
      "PriorityChangedEvent",
      "Project",
      "ProjectPermission",
      "RelatedByIssueEvent",
      "Relation",
      "RelationCondition",
      "RelationTemplate",
      "RemovedAffectedEntityEvent",
      "RemovedArtefactEvent",
      "RemovedAssignmentEvent",
      "RemovedFromPinnedIssuesEvent",
      "RemovedFromTrackableEvent",
      "RemovedIncomingRelationEvent",
      "RemovedLabelEvent",
      "RemovedOutgoingRelationEvent",
      "ReopenedEvent",
      "SpentTimeChangedEvent",
      "StartDateChangedEvent",
      "TemplateFieldChangedEvent",
      "TitleChangedEvent",
      "TypeChangedEvent"
    ],
    "NodePermission": [],
    "RelationPartner": [
      "ComponentVersion",
      "Interface"
    ],
    "RelationPartnerTemplate": [
      "ComponentTemplate",
      "InterfaceSpecificationTemplate"
    ],
    "SubTemplate": [
      "ComponentVersionTemplate",
      "IMSIssueTemplate",
      "IMSProjectTemplate",
      "IMSUserTemplate",
      "InterfaceDefinitionTemplate",
      "InterfacePartTemplate",
      "InterfaceSpecificationVersionTemplate",
      "InterfaceTemplate"
    ],
    "Template": [
      "ArtefactTemplate",
      "ComponentTemplate",
      "IMSTemplate",
      "InterfaceSpecificationTemplate",
      "IssueTemplate",
      "RelationTemplate"
    ],
    "TemplatedNode": [
      "Artefact",
      "Component",
      "ComponentVersion",
      "IMS",
      "IMSIssue",
      "IMSProject",
      "IMSUser",
      "Interface",
      "InterfaceDefinition",
      "InterfacePart",
      "InterfaceSpecification",
      "InterfaceSpecificationVersion",
      "Issue",
      "Relation"
    ],
    "TimelineItem": [
      "AddedAffectedEntityEvent",
      "AddedArtefactEvent",
      "AddedLabelEvent",
      "AddedToPinnedIssuesEvent",
      "AddedToTrackableEvent",
      "Assignment",
      "Body",
      "ClosedEvent",
      "DueDateChangedEvent",
      "EstimatedTimeChangedEvent",
      "IssueComment",
      "IssueRelation",
      "PriorityChangedEvent",
      "RelatedByIssueEvent",
      "RemovedAffectedEntityEvent",
      "RemovedArtefactEvent",
      "RemovedAssignmentEvent",
      "RemovedFromPinnedIssuesEvent",
      "RemovedFromTrackableEvent",
      "RemovedIncomingRelationEvent",
      "RemovedLabelEvent",
      "RemovedOutgoingRelationEvent",
      "ReopenedEvent",
      "SpentTimeChangedEvent",
      "StartDateChangedEvent",
      "TemplateFieldChangedEvent",
      "TitleChangedEvent",
      "TypeChangedEvent"
    ],
    "Trackable": [
      "Component",
      "Project"
    ],
    "TrackablePermission": [
      "ComponentPermission",
      "ProjectPermission"
    ],
    "User": [
      "GropiusUser",
      "IMSUser"
    ],
    "Versioned": [
      "ComponentVersion",
      "InterfaceSpecificationVersion"
    ]
  }
};
      export default result;
    