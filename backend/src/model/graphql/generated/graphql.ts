/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
/** Filter used to filter AbstractTypeChangedEvent */
export type AbstractTypeChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AbstractTypeChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type AssignmentTypeChangedEvent */
    isAssignmentTypeChangedEventAnd?: AssignmentTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type IncomingRelationTypeChangedEvent */
    isIncomingRelationTypeChangedEventAnd?: IncomingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type OutgoingRelationTypeChangedEvent */
    isOutgoingRelationTypeChangedEventAnd?: OutgoingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type RelationTypeChangedEvent */
    isRelationTypeChangedEventAnd?: RelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TypeChangedEvent */
    isTypeChangedEventAnd?: TypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AbstractTypeChangedEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AbstractTypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AddedAffectedEntityEvent */
export type AddedAffectedEntityEventFilterInput = {
    /** Filters for nodes where the related node match this filter */
    addedAffectedEntity?: AffectedByIssueFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<AddedAffectedEntityEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AddedAffectedEntityEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AddedAffectedEntityEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AddedArtefactEvent */
export type AddedArtefactEventFilterInput = {
    /** Filters for nodes where the related node match this filter */
    addedArtefact?: ArtefactFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<AddedArtefactEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AddedArtefactEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AddedArtefactEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AddedLabelEvent */
export type AddedLabelEventFilterInput = {
    /** Filters for nodes where the related node match this filter */
    addedLabel?: LabelFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<AddedLabelEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AddedLabelEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AddedLabelEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AddedToPinnedIssuesEvent */
export type AddedToPinnedIssuesEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AddedToPinnedIssuesEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AddedToPinnedIssuesEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AddedToPinnedIssuesEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    pinnedOn?: TrackableFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AddedToTrackableEvent */
export type AddedToTrackableEventFilterInput = {
    /** Filters for nodes where the related node match this filter */
    addedToTrackable?: TrackableFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<AddedToTrackableEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AddedToTrackableEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AddedToTrackableEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AffectedByIssue */
export type AffectedByIssueFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<AffectedByIssueFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type Component */
    isComponentAnd?: ComponentFilterInput | null | undefined;
    /** Filter for nodes of type ComponentVersion */
    isComponentVersionAnd?: ComponentVersionFilterInput | null | undefined;
    /** Filter for nodes of type Interface */
    isInterfaceAnd?: InterfaceFilterInput | null | undefined;
    /** Filter for nodes of type InterfacePart */
    isInterfacePartAnd?: InterfacePartFilterInput | null | undefined;
    /** Filter for nodes of type InterfaceSpecification */
    isInterfaceSpecificationAnd?: InterfaceSpecificationFilterInput | null | undefined;
    /** Filter for nodes of type InterfaceSpecificationVersion */
    isInterfaceSpecificationVersionAnd?: InterfaceSpecificationVersionFilterInput | null | undefined;
    /** Filter for nodes of type NamedAffectedByIssue */
    isNamedAffectedByIssueAnd?: NamedAffectedByIssueFilterInput | null | undefined;
    /** Filter for nodes of type Project */
    isProjectAnd?: ProjectFilterInput | null | undefined;
    /** Filter for nodes of type RelationPartner */
    isRelationPartnerAnd?: RelationPartnerFilterInput | null | undefined;
    /** Filter for nodes of type Trackable */
    isTrackableAnd?: TrackableFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AffectedByIssueFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AffectedByIssueFilterInput> | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AffectedByIssueListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: AffectedByIssueFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: AffectedByIssueFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: AffectedByIssueFilterInput | null | undefined;
};

/** Filter used to filter AggregatedIssue */
export type AggregatedIssueFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AggregatedIssueFilterInput> | null | undefined;
    /** Filter by count */
    count?: IntFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by incomingRelations */
    incomingRelations?: AggregatedIssueRelationListFilterInput | null | undefined;
    /** Filter by isOpen */
    isOpen?: BooleanFilterInput | null | undefined;
    /** Filter by issues */
    issues?: IssueListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AggregatedIssueFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AggregatedIssueFilterInput> | null | undefined;
    /** Filter by outgoingRelations */
    outgoingRelations?: AggregatedIssueRelationListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    relationPartner?: RelationPartnerFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    type?: IssueTypeFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AggregatedIssueListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: AggregatedIssueFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: AggregatedIssueFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: AggregatedIssueFilterInput | null | undefined;
};

/** Filter used to filter AggregatedIssueRelation */
export type AggregatedIssueRelationFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AggregatedIssueRelationFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    end?: AggregatedIssueFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by issueRelations */
    issueRelations?: IssueRelationListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AggregatedIssueRelationFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AggregatedIssueRelationFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    start?: AggregatedIssueFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    type?: IssueRelationTypeFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AggregatedIssueRelationListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: AggregatedIssueRelationFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: AggregatedIssueRelationFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: AggregatedIssueRelationFilterInput | null | undefined;
};

/** Non global permission entries */
export type AllPermissionEntry =
    /**
     * Allows to add the Component to Projects
     * Note: this should be handled very carefully, as adding a Component to a Project gives
     * all users with READ access to the Project READ access to the Component
     */
    | "ADD_TO_PROJECTS"
    /** Grants all other permissions on the Node except READ. */
    | "ADMIN"
    /**
     * Allows affecting entities part of this Trackable with any Issues.
     * Affectable entitites include
     *   - the Trackable itself
     *   - in case the Trackable is a Component
     *     - InterfaceSpecifications, their InterfaceSpecificationVersions and their InterfaceParts of the Component (not inherited ones)
     *     - Interfaces on the Component
     *     - ComponentVersions of the Component
     */
    | "AFFECT_ENTITIES_WITH_ISSUES"
    /**
     * Allows to create Comments on Issues on this Trackable.
     * Also allows editing of your own Comments.
     */
    | "COMMENT"
    /**
     * Allows to create new Issues on the Trackable.
     * This includes adding Issues from other Trackables.
     */
    | "CREATE_ISSUES"
    /** Allows adding Issues on this Trackable to other Trackables. */
    | "EXPORT_ISSUES"
    /** Allows adding Labels on this Trackable to other Trackables. */
    | "EXPORT_LABELS"
    /** Allows to add, remove, and update Artefacts on this Trackable. */
    | "MANAGE_ARTEFACTS"
    /** Allows to add / remove ComponentVersions to / from this Project. */
    | "MANAGE_COMPONENTS"
    /**
     * Allows to add, remove, and update IMSProjects on this Trackable.
     * Note: for adding, `IMSPermissionEntry.SYNC_TRACKABLES` is required additionally
     */
    | "MANAGE_IMS"
    /**
     * Allows to manage issues.
     * This includes `CREATE_ISSUES` and `COMMENT`.
     * This does NOT include `LINK_TO_ISSUES` and `LINK_FROM_ISSUES`.
     * Additionaly includes
     *   - change the Template
     *   - add / remove Labels
     *   - add / remove Artefacts
     *   - change any field on the Issue (title, ...)
     *   - change templated fields
     * In contrast to `MODERATOR`, this does not allow editing / removing Comments of other users
     */
    | "MANAGE_ISSUES"
    /**
     * Allows to add, remove, and update Labels on this Trackable.
     * Also allows to delete a Label, but only if it is allowed on all Trackable the Label is on.
     */
    | "MANAGE_LABELS"
    /** Allows to manage the views of this Project. */
    | "MANAGE_VIEWS"
    /**
     * Allows to moderate Issues on this Trackable.
     * This allows everything `MANAGE_ISSUES` allows.
     * Additionally, it allows editing and deleting Comments of other Users
     */
    | "MODERATOR"
    /**
     * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
     * See documentation for specific Node for the specific conditions.
     */
    | "READ"
    /**
     * Allows to create Relations with a version of this Component or an Interface of this Component
     * as start.
     * Note: as these Relations cannot cause new Interfaces on this Component, this can be granted
     * more permissively compared to `RELATE_TO_COMPONENT`.
     */
    | "RELATE_FROM_COMPONENT"
    /** Allows to create IMSProjects with this IMS. */
    | "SYNC_TRACKABLES";

/** Filter used to filter Artefact */
export type ArtefactFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ArtefactFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by file */
    file?: StringFilterInput | null | undefined;
    /** Filter by from */
    from?: NullableIntFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by issues */
    issues?: IssueListFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ArtefactFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ArtefactFilterInput> | null | undefined;
    /** Filter by referencingComments */
    referencingComments?: IssueCommentListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ArtefactTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by to */
    to?: NullableIntFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    trackable?: TrackableFilterInput | null | undefined;
    /** Filter by version */
    version?: NullableStringFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ArtefactListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ArtefactFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ArtefactFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ArtefactFilterInput | null | undefined;
};

/** Filter used to filter ArtefactTemplate */
export type ArtefactTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ArtefactTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by extendedBy */
    extendedBy?: ArtefactTemplateListFilterInput | null | undefined;
    /** Filter by extends */
    extends?: ArtefactTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ArtefactTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ArtefactTemplateFilterInput> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ArtefactTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ArtefactTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ArtefactTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ArtefactTemplateFilterInput | null | undefined;
};

/** Filter used to filter Assignment */
export type AssignmentFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AssignmentFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    initialType?: AssignmentTypeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AssignmentFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AssignmentFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    type?: AssignmentTypeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    user?: UserFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AssignmentListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: AssignmentFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: AssignmentFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: AssignmentFilterInput | null | undefined;
};

/** Filter used to filter AssignmentTypeChangedEvent */
export type AssignmentTypeChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AssignmentTypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    assignment?: AssignmentFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newType?: AssignmentTypeFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AssignmentTypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldType?: AssignmentTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AssignmentTypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter AssignmentType */
export type AssignmentTypeFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AssignmentTypeFilterInput> | null | undefined;
    /** Filter by assignmentsWithType */
    assignmentsWithType?: AssignmentListFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AssignmentTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AssignmentTypeFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: IssueTemplateListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AssignmentTypeListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: AssignmentTypeFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: AssignmentTypeFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: AssignmentTypeFilterInput | null | undefined;
};

/** Filter used to filter AuditedNode */
export type AuditedNodeFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<AuditedNodeFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type AbstractTypeChangedEvent */
    isAbstractTypeChangedEventAnd?: AbstractTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedAffectedEntityEvent */
    isAddedAffectedEntityEventAnd?: AddedAffectedEntityEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedArtefactEvent */
    isAddedArtefactEventAnd?: AddedArtefactEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedLabelEvent */
    isAddedLabelEventAnd?: AddedLabelEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedToPinnedIssuesEvent */
    isAddedToPinnedIssuesEventAnd?: AddedToPinnedIssuesEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedToTrackableEvent */
    isAddedToTrackableEventAnd?: AddedToTrackableEventFilterInput | null | undefined;
    /** Filter for nodes of type Artefact */
    isArtefactAnd?: ArtefactFilterInput | null | undefined;
    /** Filter for nodes of type Assignment */
    isAssignmentAnd?: AssignmentFilterInput | null | undefined;
    /** Filter for nodes of type AssignmentTypeChangedEvent */
    isAssignmentTypeChangedEventAnd?: AssignmentTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type Body */
    isBodyAnd?: BodyFilterInput | null | undefined;
    /** Filter for nodes of type Comment */
    isCommentAnd?: CommentFilterInput | null | undefined;
    /** Filter for nodes of type IncomingRelationTypeChangedEvent */
    isIncomingRelationTypeChangedEventAnd?: IncomingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type Issue */
    isIssueAnd?: IssueFilterInput | null | undefined;
    /** Filter for nodes of type IssueComment */
    isIssueCommentAnd?: IssueCommentFilterInput | null | undefined;
    /** Filter for nodes of type IssueRelation */
    isIssueRelationAnd?: IssueRelationFilterInput | null | undefined;
    /** Filter for nodes of type Label */
    isLabelAnd?: LabelFilterInput | null | undefined;
    /** Filter for nodes of type NamedAuditedNode */
    isNamedAuditedNodeAnd?: NamedAuditedNodeFilterInput | null | undefined;
    /** Filter for nodes of type OutgoingRelationTypeChangedEvent */
    isOutgoingRelationTypeChangedEventAnd?: OutgoingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type ParentTimelineItem */
    isParentTimelineItemAnd?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for nodes of type PriorityChangedEvent */
    isPriorityChangedEventAnd?: PriorityChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type PublicTimelineItem */
    isPublicTimelineItemAnd?: PublicTimelineItemFilterInput | null | undefined;
    /** Filter for nodes of type RelatedByIssueEvent */
    isRelatedByIssueEventAnd?: RelatedByIssueEventFilterInput | null | undefined;
    /** Filter for nodes of type RelationTypeChangedEvent */
    isRelationTypeChangedEventAnd?: RelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedAffectedEntityEvent */
    isRemovedAffectedEntityEventAnd?: RemovedAffectedEntityEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedArtefactEvent */
    isRemovedArtefactEventAnd?: RemovedArtefactEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedAssignmentEvent */
    isRemovedAssignmentEventAnd?: RemovedAssignmentEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedFromPinnedIssuesEvent */
    isRemovedFromPinnedIssuesEventAnd?: RemovedFromPinnedIssuesEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedFromTrackableEvent */
    isRemovedFromTrackableEventAnd?: RemovedFromTrackableEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedIncomingRelationEvent */
    isRemovedIncomingRelationEventAnd?: RemovedIncomingRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedLabelEvent */
    isRemovedLabelEventAnd?: RemovedLabelEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedOutgoingRelationEvent */
    isRemovedOutgoingRelationEventAnd?: RemovedOutgoingRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedRelationEvent */
    isRemovedRelationEventAnd?: RemovedRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedTemplatedFieldEvent */
    isRemovedTemplatedFieldEventAnd?: RemovedTemplatedFieldEventFilterInput | null | undefined;
    /** Filter for nodes of type StateChangedEvent */
    isStateChangedEventAnd?: StateChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TemplateChangedEvent */
    isTemplateChangedEventAnd?: TemplateChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TemplatedFieldChangedEvent */
    isTemplatedFieldChangedEventAnd?: TemplatedFieldChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TimelineItem */
    isTimelineItemAnd?: TimelineItemFilterInput | null | undefined;
    /** Filter for nodes of type TitleChangedEvent */
    isTitleChangedEventAnd?: TitleChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TypeChangedEvent */
    isTypeChangedEventAnd?: TypeChangedEventFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: AuditedNodeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<AuditedNodeFilterInput> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type AuditedNodeListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: AuditedNodeFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: AuditedNodeFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: AuditedNodeFilterInput | null | undefined;
};

/** Filter used to filter BasePermission */
export type BasePermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<BasePermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type ComponentPermission */
    isComponentPermissionAnd?: ComponentPermissionFilterInput | null | undefined;
    /** Filter for nodes of type GlobalPermission */
    isGlobalPermissionAnd?: GlobalPermissionFilterInput | null | undefined;
    /** Filter for nodes of type IMSPermission */
    isIMSPermissionAnd?: ImsPermissionFilterInput | null | undefined;
    /** Filter for nodes of type NodePermission */
    isNodePermissionAnd?: NodePermissionFilterInput | null | undefined;
    /** Filter for nodes of type ProjectPermission */
    isProjectPermissionAnd?: ProjectPermissionFilterInput | null | undefined;
    /** Filter for nodes of type TrackablePermission */
    isTrackablePermissionAnd?: TrackablePermissionFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: BasePermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<BasePermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type BasePermissionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: BasePermissionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: BasePermissionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: BasePermissionFilterInput | null | undefined;
};

/** Filter used to filter Body */
export type BodyFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<BodyFilterInput> | null | undefined;
    /** Filter by answeredBy */
    answeredBy?: IssueCommentListFilterInput | null | undefined;
    /** Filter by bodyLastEditedAt */
    bodyLastEditedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    bodyLastEditedBy?: UserFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: BodyFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<BodyFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific Boolean field */
export type BooleanFilterInput = {
    /** Matches values which are equal to the provided value */
    eq?: boolean | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<boolean> | null | undefined;
};

/** Filter used to filter Comment */
export type CommentFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<CommentFilterInput> | null | undefined;
    /** Filter by answeredBy */
    answeredBy?: IssueCommentListFilterInput | null | undefined;
    /** Filter by bodyLastEditedAt */
    bodyLastEditedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    bodyLastEditedBy?: UserFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type Body */
    isBodyAnd?: BodyFilterInput | null | undefined;
    /** Filter for nodes of type IssueComment */
    isIssueCommentAnd?: IssueCommentFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: CommentFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<CommentFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter Component */
export type ComponentFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<ComponentFilterInput> | null | undefined;
    /** Filter by artefacts */
    artefacts?: ArtefactListFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by interfaceSpecifications */
    interfaceSpecifications?: InterfaceSpecificationListFilterInput | null | undefined;
    /** Filter by issues */
    issues?: IssueListFilterInput | null | undefined;
    /** Filter by labels */
    labels?: LabelListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ComponentFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ComponentFilterInput> | null | undefined;
    /** Filter by permissions */
    permissions?: ComponentPermissionListFilterInput | null | undefined;
    /** Filter by pinnedIssues */
    pinnedIssues?: IssueListFilterInput | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filter by repositoryURL */
    repositoryURL?: NullableStringFilterInput | null | undefined;
    /** Filter by syncsTo */
    syncsTo?: ImsProjectListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ComponentTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by versions */
    versions?: ComponentVersionListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ComponentFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ComponentFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ComponentFilterInput | null | undefined;
};

/** Filter used to filter ComponentPermission */
export type ComponentPermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<ComponentPermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Filter by nodesWithPermission */
    nodesWithPermission?: ComponentListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ComponentPermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ComponentPermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentPermissionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ComponentPermissionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ComponentPermissionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ComponentPermissionFilterInput | null | undefined;
};

/** Filter used to filter ComponentTemplate */
export type ComponentTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ComponentTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by extendedBy */
    extendedBy?: ComponentTemplateListFilterInput | null | undefined;
    /** Filter by extends */
    extends?: ComponentTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by intraComponentDependencySpecificationTypes */
    intraComponentDependencySpecificationTypes?:
        IntraComponentDependencySpecificationTypeListFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ComponentTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ComponentTemplateFilterInput> | null | undefined;
    /** Filter by possibleEndOfRelations */
    possibleEndOfRelations?: RelationConditionListFilterInput | null | undefined;
    /** Filter by possibleInvisibleInterfaceSpecifications */
    possibleInvisibleInterfaceSpecifications?: InterfaceSpecificationTemplateListFilterInput | null | undefined;
    /** Filter by possibleStartOfRelations */
    possibleStartOfRelations?: RelationConditionListFilterInput | null | undefined;
    /** Filter by possibleVisibleInterfaceSpecifications */
    possibleVisibleInterfaceSpecifications?: InterfaceSpecificationTemplateListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ComponentTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ComponentTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ComponentTemplateFilterInput | null | undefined;
};

/** Filter used to filter ComponentVersion */
export type ComponentVersionFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Filter by aggregatedIssues */
    aggregatedIssues?: AggregatedIssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<ComponentVersionFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    component?: ComponentFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by includingProjects */
    includingProjects?: ProjectListFilterInput | null | undefined;
    /** Filter by incomingRelations */
    incomingRelations?: RelationListFilterInput | null | undefined;
    /** Filter by interfaceDefinitions */
    interfaceDefinitions?: InterfaceDefinitionListFilterInput | null | undefined;
    /** Filter by intraComponentDependencySpecifications */
    intraComponentDependencySpecifications?: IntraComponentDependencySpecificationListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ComponentVersionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ComponentVersionFilterInput> | null | undefined;
    /** Filter by outgoingRelations */
    outgoingRelations?: RelationListFilterInput | null | undefined;
    /** Filters for RelationPartners which are part of a Project's component graph */
    partOfProject?: string | number | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ComponentVersionTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by version */
    version?: StringFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ComponentVersionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ComponentVersionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ComponentVersionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ComponentVersionFilterInput | null | undefined;
};

/** Filter used to filter ComponentVersionTemplate */
export type ComponentVersionTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ComponentVersionTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ComponentVersionTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ComponentVersionTemplateFilterInput> | null | undefined;
};

/** Input for the createGropiusUser mutation */
export type CreateGropiusUserInput = {
    /** The avatar of the created GropiusUser */
    avatar?: any;
    /** The displayName of the created User */
    displayName: string;
    /** The email of the created User if present */
    email?: string | null | undefined;
    /** If true, the created GropiusUser is a global admin */
    isAdmin: boolean;
    /** The username of the created GropiusUser, must be unique, must match /^[a-zA-Z0-9_-]+$/ */
    username: string;
};

/** Input for the createIMSUser mutation */
export type CreateImsUserInput = {
    /** The displayName of the created User */
    displayName: string;
    /** The email of the created User if present */
    email?: string | null | undefined;
    /** If present, the id of the GropiusUser the created IMSUser is associated with */
    gropiusUser?: string | number | null | undefined;
    /** The id of the IMS the created IMSUser is part of */
    ims: string | number;
    /** Initial values for all templatedFields */
    templatedFields: Array<JsonFieldInput>;
    /** The username of the created IMSUser, must be unique */
    username?: string | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific DateTime field */
export type DateTimeFilterInput = {
    /** Matches values which are equal to the provided value */
    eq?: any;
    /** Matches values which are greater than the provided value */
    gt?: any;
    /** Matches values which are greater than or equal to the provided value */
    gte?: any;
    /** Matches values which are equal to any of the provided values */
    in?: Array<any> | null | undefined;
    /** Matches values which are lesser than the provided value */
    lt?: any;
    /** Matches values which are lesser than or equal to the provided value */
    lte?: any;
};

/** Filter which can be used to filter for Nodes with a specific Float field */
export type FloatFilterInput = {
    /** Matches values which are equal to the provided value */
    eq?: number | null | undefined;
    /** Matches values which are greater than the provided value */
    gt?: number | null | undefined;
    /** Matches values which are greater than or equal to the provided value */
    gte?: number | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<number> | null | undefined;
    /** Matches values which are lesser than the provided value */
    lt?: number | null | undefined;
    /** Matches values which are lesser than or equal to the provided value */
    lte?: number | null | undefined;
};

/** Filter used to filter GlobalPermission */
export type GlobalPermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<GlobalPermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: GlobalPermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<GlobalPermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Filter used to filter GropiusUser */
export type GropiusUserFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<GropiusUserFilterInput> | null | undefined;
    /** Filter by assignments */
    assignments?: AssignmentListFilterInput | null | undefined;
    /** Filter by canSyncOthers */
    canSyncOthers?: SyncPermissionTargetListFilterInput | null | undefined;
    /** Filter by canSyncSelf */
    canSyncSelf?: SyncPermissionTargetListFilterInput | null | undefined;
    /** Filter by createdNodes */
    createdNodes?: AuditedNodeListFilterInput | null | undefined;
    /** Filter by displayName */
    displayName?: StringFilterInput | null | undefined;
    /** Filter by email */
    email?: NullableStringFilterInput | null | undefined;
    /** Filter for users with a specific permission on a node */
    hasNodePermission?: NodePermissionFilterEntry | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by imsUsers */
    imsUsers?: ImsUserListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: GropiusUserFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<GropiusUserFilterInput> | null | undefined;
    /** Filter by participatedIssues */
    participatedIssues?: IssueListFilterInput | null | undefined;
    /** Filter by permissions */
    permissions?: BasePermissionListFilterInput | null | undefined;
    /** Filter by username */
    username?: NullableStringFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type GropiusUserListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: GropiusUserFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: GropiusUserFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: GropiusUserFilterInput | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific ID field */
export type IdFilterInput = {
    /** Matches values which are equal to the provided value */
    eq?: string | number | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<string | number> | null | undefined;
};

/** Filter used to filter IMS */
export type ImsFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsFilterInput> | null | undefined;
    /** Filter by permissions */
    permissions?: ImsPermissionListFilterInput | null | undefined;
    /** Filter by projects */
    projects?: ImsProjectListFilterInput | null | undefined;
    /** Filter by syncOthersAllowedBy */
    syncOthersAllowedBy?: GropiusUserListFilterInput | null | undefined;
    /** Filter by syncSelfAllowedBy */
    syncSelfAllowedBy?: GropiusUserListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ImsTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by users */
    users?: ImsUserListFilterInput | null | undefined;
};

/** Filter used to filter IMSIssue */
export type ImsIssueFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsIssueFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    imsProject?: ImsProjectFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsIssueFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsIssueFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ImsIssueTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsIssueListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ImsIssueFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ImsIssueFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ImsIssueFilterInput | null | undefined;
};

/** Filter used to filter IMSIssueTemplate */
export type ImsIssueTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsIssueTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsIssueTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsIssueTemplateFilterInput> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ImsFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ImsFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ImsFilterInput | null | undefined;
};

/** Filter used to filter IMSPermission */
export type ImsPermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<ImsPermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Filter by nodesWithPermission */
    nodesWithPermission?: ImsListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsPermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsPermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsPermissionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ImsPermissionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ImsPermissionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ImsPermissionFilterInput | null | undefined;
};

/** Filter used to filter IMSProject */
export type ImsProjectFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsProjectFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    ims?: ImsFilterInput | null | undefined;
    /** Filter by imsIssues */
    imsIssues?: ImsIssueListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsProjectFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsProjectFilterInput> | null | undefined;
    /** Filter by syncOthersAllowedBy */
    syncOthersAllowedBy?: GropiusUserListFilterInput | null | undefined;
    /** Filter by syncSelfAllowedBy */
    syncSelfAllowedBy?: GropiusUserListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ImsProjectTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    trackable?: TrackableFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsProjectListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ImsProjectFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ImsProjectFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ImsProjectFilterInput | null | undefined;
};

/** Filter used to filter IMSProjectTemplate */
export type ImsProjectTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsProjectTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsProjectTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsProjectTemplateFilterInput> | null | undefined;
};

/** Filter used to filter IMSTemplate */
export type ImsTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by extendedBy */
    extendedBy?: ImsTemplateListFilterInput | null | undefined;
    /** Filter by extends */
    extends?: ImsTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsTemplateFilterInput> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ImsTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ImsTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ImsTemplateFilterInput | null | undefined;
};

/** Filter used to filter IMSUser */
export type ImsUserFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsUserFilterInput> | null | undefined;
    /** Filter by assignments */
    assignments?: AssignmentListFilterInput | null | undefined;
    /** Filter by createdNodes */
    createdNodes?: AuditedNodeListFilterInput | null | undefined;
    /** Filter by displayName */
    displayName?: StringFilterInput | null | undefined;
    /** Filter by email */
    email?: NullableStringFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    gropiusUser?: GropiusUserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    ims?: ImsFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsUserFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsUserFilterInput> | null | undefined;
    /** Filter by participatedIssues */
    participatedIssues?: IssueListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: ImsUserTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by username */
    username?: NullableStringFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ImsUserListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ImsUserFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ImsUserFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ImsUserFilterInput | null | undefined;
};

/** Filter used to filter IMSUserTemplate */
export type ImsUserTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ImsUserTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ImsUserTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ImsUserTemplateFilterInput> | null | undefined;
};

/** Filter used to filter IncomingRelationTypeChangedEvent */
export type IncomingRelationTypeChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IncomingRelationTypeChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issueRelation?: IssueRelationFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newType?: IssueRelationTypeFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IncomingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldType?: IssueRelationTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IncomingRelationTypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific Int field */
export type IntFilterInput = {
    /** Matches values which are equal to the provided value */
    eq?: number | null | undefined;
    /** Matches values which are greater than the provided value */
    gt?: number | null | undefined;
    /** Matches values which are greater than or equal to the provided value */
    gte?: number | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<number> | null | undefined;
    /** Matches values which are lesser than the provided value */
    lt?: number | null | undefined;
    /** Matches values which are lesser than or equal to the provided value */
    lte?: number | null | undefined;
};

/** Filter used to filter InterfaceDefinition */
export type InterfaceDefinitionFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<InterfaceDefinitionFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    componentVersion?: ComponentVersionFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    interfaceSpecificationVersion?: InterfaceSpecificationVersionFilterInput | null | undefined;
    /** Filter by invisibleDerivedBy */
    invisibleDerivedBy?: RelationListFilterInput | null | undefined;
    /** Filter by invisibleSelfDefined */
    invisibleSelfDefined?: BooleanFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceDefinitionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceDefinitionFilterInput> | null | undefined;
    /** Filter by visibleDerivedBy */
    visibleDerivedBy?: RelationListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    visibleInterface?: InterfaceFilterInput | null | undefined;
    /** Filter by visibleSelfDefined */
    visibleSelfDefined?: BooleanFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceDefinitionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: InterfaceDefinitionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: InterfaceDefinitionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: InterfaceDefinitionFilterInput | null | undefined;
};

/** Filter used to filter Interface */
export type InterfaceFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Filter by aggregatedIssues */
    aggregatedIssues?: AggregatedIssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<InterfaceFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by incomingRelations */
    incomingRelations?: RelationListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    interfaceDefinition?: InterfaceDefinitionFilterInput | null | undefined;
    /** Filter by intraComponentDependencyParticipants */
    intraComponentDependencyParticipants?: IntraComponentDependencyParticipantListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceFilterInput> | null | undefined;
    /** Filter by outgoingRelations */
    outgoingRelations?: RelationListFilterInput | null | undefined;
    /** Filters for RelationPartners which are part of a Project's component graph */
    partOfProject?: string | number | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
};

/** Filter used to filter InterfacePart */
export type InterfacePartFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<InterfacePartFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by includingIncomingRelations */
    includingIncomingRelations?: RelationListFilterInput | null | undefined;
    /** Filter by includingIntraComponentDependencyParticipants */
    includingIntraComponentDependencyParticipants?:
        IntraComponentDependencyParticipantListFilterInput | null | undefined;
    /** Filter by includingOutgoingRelations */
    includingOutgoingRelations?: RelationListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfacePartFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfacePartFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    partOf?: InterfaceSpecificationVersionFilterInput | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: InterfacePartTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfacePartListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: InterfacePartFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: InterfacePartFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: InterfacePartFilterInput | null | undefined;
};

/** Filter used to filter InterfacePartTemplate */
export type InterfacePartTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<InterfacePartTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfacePartTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfacePartTemplateFilterInput> | null | undefined;
};

/** Filter used to filter InterfaceSpecificationDerivationCondition */
export type InterfaceSpecificationDerivationConditionFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<InterfaceSpecificationDerivationConditionFilterInput> | null | undefined;
    /** Filter by derivableInterfaceSpecifications */
    derivableInterfaceSpecifications?: InterfaceSpecificationTemplateListFilterInput | null | undefined;
    /** Filter by derivesInvisibleDerived */
    derivesInvisibleDerived?: BooleanFilterInput | null | undefined;
    /** Filter by derivesInvisibleSelfDefined */
    derivesInvisibleSelfDefined?: BooleanFilterInput | null | undefined;
    /** Filter by derivesVisibleDerived */
    derivesVisibleDerived?: BooleanFilterInput | null | undefined;
    /** Filter by derivesVisibleSelfDefined */
    derivesVisibleSelfDefined?: BooleanFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isInvisibleDerived */
    isInvisibleDerived?: BooleanFilterInput | null | undefined;
    /** Filter by isVisibleDerived */
    isVisibleDerived?: BooleanFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceSpecificationDerivationConditionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceSpecificationDerivationConditionFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    partOf?: RelationConditionFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationDerivationConditionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: InterfaceSpecificationDerivationConditionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: InterfaceSpecificationDerivationConditionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: InterfaceSpecificationDerivationConditionFilterInput | null | undefined;
};

/** Filter used to filter InterfaceSpecification */
export type InterfaceSpecificationFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<InterfaceSpecificationFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    component?: ComponentFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceSpecificationFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceSpecificationFilterInput> | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: InterfaceSpecificationTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by versions */
    versions?: InterfaceSpecificationVersionListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: InterfaceSpecificationFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: InterfaceSpecificationFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: InterfaceSpecificationFilterInput | null | undefined;
};

/** Filter used to filter InterfaceSpecificationTemplate */
export type InterfaceSpecificationTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<InterfaceSpecificationTemplateFilterInput> | null | undefined;
    /** Filter by canBeInvisibleOnComponents */
    canBeInvisibleOnComponents?: ComponentTemplateListFilterInput | null | undefined;
    /** Filter by canBeVisibleOnComponents */
    canBeVisibleOnComponents?: ComponentTemplateListFilterInput | null | undefined;
    /** Filter by derivableBy */
    derivableBy?: InterfaceSpecificationDerivationConditionListFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by extendedBy */
    extendedBy?: InterfaceSpecificationTemplateListFilterInput | null | undefined;
    /** Filter by extends */
    extends?: InterfaceSpecificationTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceSpecificationTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceSpecificationTemplateFilterInput> | null | undefined;
    /** Filter by possibleEndOfRelations */
    possibleEndOfRelations?: RelationConditionListFilterInput | null | undefined;
    /** Filter by possibleStartOfRelations */
    possibleStartOfRelations?: RelationConditionListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: InterfaceSpecificationTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: InterfaceSpecificationTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: InterfaceSpecificationTemplateFilterInput | null | undefined;
};

/** Filter used to filter InterfaceSpecificationVersion */
export type InterfaceSpecificationVersionFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<InterfaceSpecificationVersionFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by interfaceDefinitions */
    interfaceDefinitions?: InterfaceDefinitionListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    interfaceSpecification?: InterfaceSpecificationFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceSpecificationVersionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceSpecificationVersionFilterInput> | null | undefined;
    /** Filter by parts */
    parts?: InterfacePartListFilterInput | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: InterfaceSpecificationVersionTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by version */
    version?: StringFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type InterfaceSpecificationVersionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: InterfaceSpecificationVersionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: InterfaceSpecificationVersionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: InterfaceSpecificationVersionFilterInput | null | undefined;
};

/** Filter used to filter InterfaceSpecificationVersionTemplate */
export type InterfaceSpecificationVersionTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<InterfaceSpecificationVersionTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: InterfaceSpecificationVersionTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<InterfaceSpecificationVersionTemplateFilterInput> | null | undefined;
};

/** Filter used to filter IntraComponentDependencyParticipant */
export type IntraComponentDependencyParticipantFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IntraComponentDependencyParticipantFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by includedParts */
    includedParts?: InterfacePartListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    interface?: InterfaceFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IntraComponentDependencyParticipantFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IntraComponentDependencyParticipantFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    usedAsIncomingAt?: IntraComponentDependencySpecificationFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    usedAsOutgoingAt?: IntraComponentDependencySpecificationFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IntraComponentDependencyParticipantListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IntraComponentDependencyParticipantFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IntraComponentDependencyParticipantFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IntraComponentDependencyParticipantFilterInput | null | undefined;
};

/** Filter used to filter IntraComponentDependencySpecification */
export type IntraComponentDependencySpecificationFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IntraComponentDependencySpecificationFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    componentVersion?: ComponentVersionFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by incomingParticipants */
    incomingParticipants?: IntraComponentDependencyParticipantListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IntraComponentDependencySpecificationFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IntraComponentDependencySpecificationFilterInput> | null | undefined;
    /** Filter by outgoingParticipants */
    outgoingParticipants?: IntraComponentDependencyParticipantListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    type?: IntraComponentDependencySpecificationTypeFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IntraComponentDependencySpecificationListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IntraComponentDependencySpecificationFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IntraComponentDependencySpecificationFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IntraComponentDependencySpecificationFilterInput | null | undefined;
};

/** Filter used to filter IntraComponentDependencySpecificationType */
export type IntraComponentDependencySpecificationTypeFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IntraComponentDependencySpecificationTypeFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by intraComponentDependencySpecificationsWithType */
    intraComponentDependencySpecificationsWithType?: IssueListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IntraComponentDependencySpecificationTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IntraComponentDependencySpecificationTypeFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: ComponentTemplateListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IntraComponentDependencySpecificationTypeListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IntraComponentDependencySpecificationTypeFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IntraComponentDependencySpecificationTypeFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IntraComponentDependencySpecificationTypeFilterInput | null | undefined;
};

/** Filter used to filter IssueComment */
export type IssueCommentFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IssueCommentFilterInput> | null | undefined;
    /** Filter by answeredBy */
    answeredBy?: IssueCommentListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    answers?: CommentFilterInput | null | undefined;
    /** Filter by bodyLastEditedAt */
    bodyLastEditedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    bodyLastEditedBy?: UserFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isDeleted */
    isDeleted?: BooleanFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueCommentFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueCommentFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter by referencedArtefacts */
    referencedArtefacts?: ArtefactListFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueCommentListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueCommentFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueCommentFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueCommentFilterInput | null | undefined;
};

/** Filter used to filter Issue */
export type IssueFilterInput = {
    /** Filter by affects */
    affects?: AffectedByIssueListFilterInput | null | undefined;
    /** Filter by aggregatedBy */
    aggregatedBy?: AggregatedIssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<IssueFilterInput> | null | undefined;
    /** Filter by artefacts */
    artefacts?: ArtefactListFilterInput | null | undefined;
    /** Filter by assignments */
    assignments?: AssignmentListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    body?: BodyFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by imsIssues */
    imsIssues?: ImsIssueListFilterInput | null | undefined;
    /** Filter by incomingRelations */
    incomingRelations?: IssueRelationListFilterInput | null | undefined;
    /** Filter by issueComments */
    issueComments?: IssueCommentListFilterInput | null | undefined;
    /** Filter by labels */
    labels?: LabelListFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filter by lastUpdatedAt */
    lastUpdatedAt?: DateTimeFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueFilterInput> | null | undefined;
    /** Filter by outgoingRelations */
    outgoingRelations?: IssueRelationListFilterInput | null | undefined;
    /** Filter by participants */
    participants?: UserListFilterInput | null | undefined;
    /** Filter by pinnedOn */
    pinnedOn?: TrackableListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    priority?: IssuePriorityFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    state?: IssueStateFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: IssueTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
    /** Filter by timelineItems */
    timelineItems?: TimelineItemListFilterInput | null | undefined;
    /** Filter by title */
    title?: StringFilterInput | null | undefined;
    /** Filter by trackables */
    trackables?: TrackableListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    type?: IssueTypeFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueFilterInput | null | undefined;
};

/** Filter used to filter IssuePriority */
export type IssuePriorityFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IssuePriorityFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssuePriorityFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssuePriorityFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: IssueTemplateListFilterInput | null | undefined;
    /** Filter by prioritizedIssues */
    prioritizedIssues?: IssueListFilterInput | null | undefined;
    /** Filter by value */
    value?: FloatFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssuePriorityListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssuePriorityFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssuePriorityFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssuePriorityFilterInput | null | undefined;
};

/** Filter used to filter IssueRelation */
export type IssueRelationFilterInput = {
    /** Filter by aggregatedBy */
    aggregatedBy?: AggregatedIssueRelationListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<IssueRelationFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    initialType?: IssueRelationTypeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueRelationFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueRelationFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    relatedIssue?: IssueFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    type?: IssueRelationTypeFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueRelationListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueRelationFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueRelationFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueRelationFilterInput | null | undefined;
};

/** Filter used to filter IssueRelationType */
export type IssueRelationTypeFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IssueRelationTypeFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by inverseName */
    inverseName?: StringFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueRelationTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueRelationTypeFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: IssueTemplateListFilterInput | null | undefined;
    /** Filter by relationsWithType */
    relationsWithType?: IssueRelationListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueRelationTypeListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueRelationTypeFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueRelationTypeFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueRelationTypeFilterInput | null | undefined;
};

/** Filter used to filter IssueState */
export type IssueStateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IssueStateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isOpen */
    isOpen?: BooleanFilterInput | null | undefined;
    /** Filter by issuesWithState */
    issuesWithState?: IssueListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueStateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueStateFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: IssueTemplateListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueStateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueStateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueStateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueStateFilterInput | null | undefined;
};

/** Filter used to filter IssueTemplate */
export type IssueTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IssueTemplateFilterInput> | null | undefined;
    /** Filter by assignmentTypes */
    assignmentTypes?: AssignmentTypeListFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by extendedBy */
    extendedBy?: IssueTemplateListFilterInput | null | undefined;
    /** Filter by extends */
    extends?: IssueTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter by issuePriorities */
    issuePriorities?: IssuePriorityListFilterInput | null | undefined;
    /** Filter by issueStates */
    issueStates?: IssueStateListFilterInput | null | undefined;
    /** Filter by issueTypes */
    issueTypes?: IssueTypeListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueTemplateFilterInput> | null | undefined;
    /** Filter by relationTypes */
    relationTypes?: IssueRelationTypeListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueTemplateFilterInput | null | undefined;
};

/** Filter used to filter IssueType */
export type IssueTypeFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<IssueTypeFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by issuesWithType */
    issuesWithType?: IssueListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: IssueTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<IssueTypeFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: IssueTemplateListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type IssueTypeListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: IssueTypeFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: IssueTypeFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: IssueTypeFilterInput | null | undefined;
};

/** Input set update the value of a JSON field, like an extension field or a templated field. */
export type JsonFieldInput = {
    /** The name of the field */
    name: string;
    /** The new value of the field */
    value?: any;
};

/** Filter used to filter Label */
export type LabelFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<LabelFilterInput> | null | undefined;
    /** Filter by color */
    color?: StringFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by issues */
    issues?: IssueListFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: LabelFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<LabelFilterInput> | null | undefined;
    /** Filter by trackables */
    trackables?: TrackableListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type LabelListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: LabelFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: LabelFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: LabelFilterInput | null | undefined;
};

/** Filter used to filter NamedAffectedByIssue */
export type NamedAffectedByIssueFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<NamedAffectedByIssueFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type Component */
    isComponentAnd?: ComponentFilterInput | null | undefined;
    /** Filter for nodes of type InterfacePart */
    isInterfacePartAnd?: InterfacePartFilterInput | null | undefined;
    /** Filter for nodes of type InterfaceSpecification */
    isInterfaceSpecificationAnd?: InterfaceSpecificationFilterInput | null | undefined;
    /** Filter for nodes of type Project */
    isProjectAnd?: ProjectFilterInput | null | undefined;
    /** Filter for nodes of type Trackable */
    isTrackableAnd?: TrackableFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: NamedAffectedByIssueFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<NamedAffectedByIssueFilterInput> | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
};

/** Filter used to filter NamedAuditedNode */
export type NamedAuditedNodeFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<NamedAuditedNodeFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type Label */
    isLabelAnd?: LabelFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: NamedAuditedNodeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<NamedAuditedNodeFilterInput> | null | undefined;
};

export type NodePermissionFilterEntry = {
    /** The node where the user must have the permission */
    node: string | number;
    /** The permission the user must have on the node */
    permission: AllPermissionEntry;
};

/** Filter used to filter NodePermission */
export type NodePermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<NodePermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type ComponentPermission */
    isComponentPermissionAnd?: ComponentPermissionFilterInput | null | undefined;
    /** Filter for nodes of type IMSPermission */
    isIMSPermissionAnd?: ImsPermissionFilterInput | null | undefined;
    /** Filter for nodes of type ProjectPermission */
    isProjectPermissionAnd?: ProjectPermissionFilterInput | null | undefined;
    /** Filter for nodes of type TrackablePermission */
    isTrackablePermissionAnd?: TrackablePermissionFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: NodePermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<NodePermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific Int field */
export type NullableIntFilterInput = {
    /** Matches values which are equal to the provided value */
    eq?: number | null | undefined;
    /** Matches values which are greater than the provided value */
    gt?: number | null | undefined;
    /** Matches values which are greater than or equal to the provided value */
    gte?: number | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<number> | null | undefined;
    /** If true, matches only null values, if false, matches only non-null values */
    isNull?: boolean | null | undefined;
    /** Matches values which are lesser than the provided value */
    lt?: number | null | undefined;
    /** Matches values which are lesser than or equal to the provided value */
    lte?: number | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific String field */
export type NullableStringFilterInput = {
    /** Matches Strings which contain the provided value */
    contains?: string | null | undefined;
    /** Matches Strings which end with the provided value */
    endsWith?: string | null | undefined;
    /** Matches values which are equal to the provided value */
    eq?: string | null | undefined;
    /** Matches values which are greater than the provided value */
    gt?: string | null | undefined;
    /** Matches values which are greater than or equal to the provided value */
    gte?: string | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<string> | null | undefined;
    /** If true, matches only null values, if false, matches only non-null values */
    isNull?: boolean | null | undefined;
    /** Matches values which are lesser than the provided value */
    lt?: string | null | undefined;
    /** Matches values which are lesser than or equal to the provided value */
    lte?: string | null | undefined;
    /** Matches Strings using the provided RegEx */
    matches?: string | null | undefined;
    /** Matches Strings which start with the provided value */
    startsWith?: string | null | undefined;
};

/** Filter used to filter OutgoingRelationTypeChangedEvent */
export type OutgoingRelationTypeChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<OutgoingRelationTypeChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issueRelation?: IssueRelationFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newType?: IssueRelationTypeFilterInput | null | undefined;
    /** Negates the subformula */
    not?: OutgoingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldType?: IssueRelationTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<OutgoingRelationTypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter ParentTimelineItem */
export type ParentTimelineItemFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ParentTimelineItemFilterInput> | null | undefined;
    /** Filter by childItems */
    childItems?: TimelineItemListFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type RemovedFromTrackableEvent */
    isRemovedFromTrackableEventAnd?: RemovedFromTrackableEventFilterInput | null | undefined;
    /** Filter for nodes of type TemplateChangedEvent */
    isTemplateChangedEventAnd?: TemplateChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ParentTimelineItemFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ParentTimelineItemFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter PriorityChangedEvent */
export type PriorityChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<PriorityChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newPriority?: IssuePriorityFilterInput | null | undefined;
    /** Negates the subformula */
    not?: PriorityChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldPriority?: IssuePriorityFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<PriorityChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter Project */
export type ProjectFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<ProjectFilterInput> | null | undefined;
    /** Filter by artefacts */
    artefacts?: ArtefactListFilterInput | null | undefined;
    /** Filter by components */
    components?: ComponentVersionListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    defaultView?: ViewFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by issues */
    issues?: IssueListFilterInput | null | undefined;
    /** Filter by labels */
    labels?: LabelListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ProjectFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ProjectFilterInput> | null | undefined;
    /** Filter by permissions */
    permissions?: ProjectPermissionListFilterInput | null | undefined;
    /** Filter by pinnedIssues */
    pinnedIssues?: IssueListFilterInput | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filter by relationLayouts */
    relationLayouts?: RelationLayoutListFilterInput | null | undefined;
    /** Filter by relationPartnerLayouts */
    relationPartnerLayouts?: RelationPartnerLayoutListFilterInput | null | undefined;
    /** Filter by repositoryURL */
    repositoryURL?: NullableStringFilterInput | null | undefined;
    /** Filter by syncsTo */
    syncsTo?: ImsProjectListFilterInput | null | undefined;
    /** Filter by views */
    views?: ViewListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ProjectListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ProjectFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ProjectFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ProjectFilterInput | null | undefined;
};

/** Filter used to filter ProjectPermission */
export type ProjectPermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<ProjectPermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Filter by nodesWithPermission */
    nodesWithPermission?: ProjectListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ProjectPermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ProjectPermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ProjectPermissionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ProjectPermissionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ProjectPermissionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ProjectPermissionFilterInput | null | undefined;
};

/** Filter used to filter PublicTimelineItem */
export type PublicTimelineItemFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<PublicTimelineItemFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type AbstractTypeChangedEvent */
    isAbstractTypeChangedEventAnd?: AbstractTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedAffectedEntityEvent */
    isAddedAffectedEntityEventAnd?: AddedAffectedEntityEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedArtefactEvent */
    isAddedArtefactEventAnd?: AddedArtefactEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedLabelEvent */
    isAddedLabelEventAnd?: AddedLabelEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedToPinnedIssuesEvent */
    isAddedToPinnedIssuesEventAnd?: AddedToPinnedIssuesEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedToTrackableEvent */
    isAddedToTrackableEventAnd?: AddedToTrackableEventFilterInput | null | undefined;
    /** Filter for nodes of type Assignment */
    isAssignmentAnd?: AssignmentFilterInput | null | undefined;
    /** Filter for nodes of type AssignmentTypeChangedEvent */
    isAssignmentTypeChangedEventAnd?: AssignmentTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type Body */
    isBodyAnd?: BodyFilterInput | null | undefined;
    /** Filter for nodes of type Comment */
    isCommentAnd?: CommentFilterInput | null | undefined;
    /** Filter for nodes of type IncomingRelationTypeChangedEvent */
    isIncomingRelationTypeChangedEventAnd?: IncomingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type IssueComment */
    isIssueCommentAnd?: IssueCommentFilterInput | null | undefined;
    /** Filter for nodes of type IssueRelation */
    isIssueRelationAnd?: IssueRelationFilterInput | null | undefined;
    /** Filter for nodes of type OutgoingRelationTypeChangedEvent */
    isOutgoingRelationTypeChangedEventAnd?: OutgoingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type PriorityChangedEvent */
    isPriorityChangedEventAnd?: PriorityChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type RelationTypeChangedEvent */
    isRelationTypeChangedEventAnd?: RelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedAffectedEntityEvent */
    isRemovedAffectedEntityEventAnd?: RemovedAffectedEntityEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedArtefactEvent */
    isRemovedArtefactEventAnd?: RemovedArtefactEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedAssignmentEvent */
    isRemovedAssignmentEventAnd?: RemovedAssignmentEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedFromPinnedIssuesEvent */
    isRemovedFromPinnedIssuesEventAnd?: RemovedFromPinnedIssuesEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedLabelEvent */
    isRemovedLabelEventAnd?: RemovedLabelEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedTemplatedFieldEvent */
    isRemovedTemplatedFieldEventAnd?: RemovedTemplatedFieldEventFilterInput | null | undefined;
    /** Filter for nodes of type StateChangedEvent */
    isStateChangedEventAnd?: StateChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TemplatedFieldChangedEvent */
    isTemplatedFieldChangedEventAnd?: TemplatedFieldChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TitleChangedEvent */
    isTitleChangedEventAnd?: TitleChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TypeChangedEvent */
    isTypeChangedEventAnd?: TypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: PublicTimelineItemFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<PublicTimelineItemFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RelatedByIssueEvent */
export type RelatedByIssueEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelatedByIssueEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelatedByIssueEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelatedByIssueEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    relation?: IssueRelationFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RelationCondition */
export type RelationConditionFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationConditionFilterInput> | null | undefined;
    /** Filter by from */
    from?: RelationPartnerTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by interfaceSpecificationDerivationConditions */
    interfaceSpecificationDerivationConditions?:
        InterfaceSpecificationDerivationConditionListFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationConditionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationConditionFilterInput> | null | undefined;
    /** Filter by partOf */
    partOf?: RelationTemplateListFilterInput | null | undefined;
    /** Filter by to */
    to?: RelationPartnerTemplateListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationConditionListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: RelationConditionFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: RelationConditionFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: RelationConditionFilterInput | null | undefined;
};

/** Filter used to filter Relation */
export type RelationFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationFilterInput> | null | undefined;
    /** Filter by derivesInvisible */
    derivesInvisible?: InterfaceDefinitionListFilterInput | null | undefined;
    /** Filter by derivesVisible */
    derivesVisible?: InterfaceDefinitionListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    end?: RelationPartnerFilterInput | null | undefined;
    /** Filter by endParts */
    endParts?: InterfacePartListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    start?: RelationPartnerFilterInput | null | undefined;
    /** Filter by startParts */
    startParts?: InterfacePartListFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    template?: RelationTemplateFilterInput | null | undefined;
    /** Filter for templated fields with matching key and values. Entries are joined by AND */
    templatedFields?: Array<JsonFieldInput | null | undefined> | null | undefined;
};

/** Filter used to filter RelationLayout */
export type RelationLayoutFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationLayoutFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationLayoutFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationLayoutFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    project?: ProjectFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    relation?: RelationFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    view?: ViewFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationLayoutListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: RelationLayoutFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: RelationLayoutFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: RelationLayoutFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: RelationFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: RelationFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: RelationFilterInput | null | undefined;
};

/** Filter used to filter RelationPartner */
export type RelationPartnerFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Filter by aggregatedIssues */
    aggregatedIssues?: AggregatedIssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<RelationPartnerFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by incomingRelations */
    incomingRelations?: RelationListFilterInput | null | undefined;
    /** Filter for nodes of type ComponentVersion */
    isComponentVersionAnd?: ComponentVersionFilterInput | null | undefined;
    /** Filter for nodes of type Interface */
    isInterfaceAnd?: InterfaceFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationPartnerFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationPartnerFilterInput> | null | undefined;
    /** Filter by outgoingRelations */
    outgoingRelations?: RelationListFilterInput | null | undefined;
    /** Filters for RelationPartners which are part of a Project's component graph */
    partOfProject?: string | number | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
};

/** Filter used to filter RelationPartnerLayout */
export type RelationPartnerLayoutFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationPartnerLayoutFilterInput> | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationPartnerLayoutFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationPartnerLayoutFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    project?: ProjectFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    relationPartner?: RelationPartnerFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    view?: ViewFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationPartnerLayoutListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: RelationPartnerLayoutFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: RelationPartnerLayoutFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: RelationPartnerLayoutFilterInput | null | undefined;
};

/** Filter used to filter RelationPartnerTemplate */
export type RelationPartnerTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationPartnerTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter for nodes of type ComponentTemplate */
    isComponentTemplateAnd?: ComponentTemplateFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter for nodes of type InterfaceSpecificationTemplate */
    isInterfaceSpecificationTemplateAnd?: InterfaceSpecificationTemplateFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationPartnerTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationPartnerTemplateFilterInput> | null | undefined;
    /** Filter by possibleEndOfRelations */
    possibleEndOfRelations?: RelationConditionListFilterInput | null | undefined;
    /** Filter by possibleStartOfRelations */
    possibleStartOfRelations?: RelationConditionListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationPartnerTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: RelationPartnerTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: RelationPartnerTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: RelationPartnerTemplateFilterInput | null | undefined;
};

/** Filter used to filter RelationTemplate */
export type RelationTemplateFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationTemplateFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by extendedBy */
    extendedBy?: RelationTemplateListFilterInput | null | undefined;
    /** Filter by extends */
    extends?: RelationTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by isAbstract */
    isAbstract?: BooleanFilterInput | null | undefined;
    /** Filter by isDeprecated */
    isDeprecated?: BooleanFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationTemplateFilterInput> | null | undefined;
    /** Filter by relationConditions */
    relationConditions?: RelationConditionListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type RelationTemplateListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: RelationTemplateFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: RelationTemplateFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: RelationTemplateFilterInput | null | undefined;
};

/** Filter used to filter RelationTypeChangedEvent */
export type RelationTypeChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RelationTypeChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type IncomingRelationTypeChangedEvent */
    isIncomingRelationTypeChangedEventAnd?: IncomingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type OutgoingRelationTypeChangedEvent */
    isOutgoingRelationTypeChangedEventAnd?: OutgoingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issueRelation?: IssueRelationFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newType?: IssueRelationTypeFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RelationTypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldType?: IssueRelationTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RelationTypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedAffectedEntityEvent */
export type RemovedAffectedEntityEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedAffectedEntityEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedAffectedEntityEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedAffectedEntityEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedAffectedEntity?: AffectedByIssueFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedArtefactEvent */
export type RemovedArtefactEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedArtefactEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedArtefactEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedArtefactEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedArtefact?: ArtefactFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedAssignmentEvent */
export type RemovedAssignmentEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedAssignmentEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedAssignmentEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedAssignmentEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedAssignment?: AssignmentFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedFromPinnedIssuesEvent */
export type RemovedFromPinnedIssuesEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedFromPinnedIssuesEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedFromPinnedIssuesEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedFromPinnedIssuesEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    unpinnedOn?: TrackableFilterInput | null | undefined;
};

/** Filter used to filter RemovedFromTrackableEvent */
export type RemovedFromTrackableEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedFromTrackableEventFilterInput> | null | undefined;
    /** Filter by childItems */
    childItems?: TimelineItemListFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedFromTrackableEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedFromTrackableEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedFromTrackable?: TrackableFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedIncomingRelationEvent */
export type RemovedIncomingRelationEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedIncomingRelationEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedIncomingRelationEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedIncomingRelationEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedRelation?: IssueRelationFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedLabelEvent */
export type RemovedLabelEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedLabelEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedLabelEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedLabelEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedLabel?: LabelFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedOutgoingRelationEvent */
export type RemovedOutgoingRelationEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedOutgoingRelationEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedOutgoingRelationEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedOutgoingRelationEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedRelation?: IssueRelationFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedRelationEvent */
export type RemovedRelationEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedRelationEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type RemovedIncomingRelationEvent */
    isRemovedIncomingRelationEventAnd?: RemovedIncomingRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedOutgoingRelationEvent */
    isRemovedOutgoingRelationEventAnd?: RemovedOutgoingRelationEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedRelationEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedRelationEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    removedRelation?: IssueRelationFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter RemovedTemplatedFieldEvent */
export type RemovedTemplatedFieldEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<RemovedTemplatedFieldEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by fieldName */
    fieldName?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: RemovedTemplatedFieldEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<RemovedTemplatedFieldEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter StateChangedEvent */
export type StateChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<StateChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newState?: IssueStateFilterInput | null | undefined;
    /** Negates the subformula */
    not?: StateChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldState?: IssueStateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<StateChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter which can be used to filter for Nodes with a specific String field */
export type StringFilterInput = {
    /** Matches Strings which contain the provided value */
    contains?: string | null | undefined;
    /** Matches Strings which end with the provided value */
    endsWith?: string | null | undefined;
    /** Matches values which are equal to the provided value */
    eq?: string | null | undefined;
    /** Matches values which are greater than the provided value */
    gt?: string | null | undefined;
    /** Matches values which are greater than or equal to the provided value */
    gte?: string | null | undefined;
    /** Matches values which are equal to any of the provided values */
    in?: Array<string> | null | undefined;
    /** Matches values which are lesser than the provided value */
    lt?: string | null | undefined;
    /** Matches values which are lesser than or equal to the provided value */
    lte?: string | null | undefined;
    /** Matches Strings using the provided RegEx */
    matches?: string | null | undefined;
    /** Matches Strings which start with the provided value */
    startsWith?: string | null | undefined;
};

/** Filter used to filter SyncPermissionTarget */
export type SyncPermissionTargetFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<SyncPermissionTargetFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type IMS */
    isIMSAnd?: ImsFilterInput | null | undefined;
    /** Filter for nodes of type IMSProject */
    isIMSProjectAnd?: ImsProjectFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: SyncPermissionTargetFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<SyncPermissionTargetFilterInput> | null | undefined;
    /** Filter by syncOthersAllowedBy */
    syncOthersAllowedBy?: GropiusUserListFilterInput | null | undefined;
    /** Filter by syncSelfAllowedBy */
    syncSelfAllowedBy?: GropiusUserListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type SyncPermissionTargetListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: SyncPermissionTargetFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: SyncPermissionTargetFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: SyncPermissionTargetFilterInput | null | undefined;
};

/** Filter used to filter TemplateChangedEvent */
export type TemplateChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<TemplateChangedEventFilterInput> | null | undefined;
    /** Filter by childItems */
    childItems?: TimelineItemListFilterInput | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newTemplate?: IssueTemplateFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TemplateChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldTemplate?: IssueTemplateFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TemplateChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter TemplatedFieldChangedEvent */
export type TemplatedFieldChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<TemplatedFieldChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by fieldName */
    fieldName?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TemplatedFieldChangedEventFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TemplatedFieldChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter TimelineItem */
export type TimelineItemFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<TimelineItemFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type AbstractTypeChangedEvent */
    isAbstractTypeChangedEventAnd?: AbstractTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedAffectedEntityEvent */
    isAddedAffectedEntityEventAnd?: AddedAffectedEntityEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedArtefactEvent */
    isAddedArtefactEventAnd?: AddedArtefactEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedLabelEvent */
    isAddedLabelEventAnd?: AddedLabelEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedToPinnedIssuesEvent */
    isAddedToPinnedIssuesEventAnd?: AddedToPinnedIssuesEventFilterInput | null | undefined;
    /** Filter for nodes of type AddedToTrackableEvent */
    isAddedToTrackableEventAnd?: AddedToTrackableEventFilterInput | null | undefined;
    /** Filter for nodes of type Assignment */
    isAssignmentAnd?: AssignmentFilterInput | null | undefined;
    /** Filter for nodes of type AssignmentTypeChangedEvent */
    isAssignmentTypeChangedEventAnd?: AssignmentTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type Body */
    isBodyAnd?: BodyFilterInput | null | undefined;
    /** Filter for nodes of type Comment */
    isCommentAnd?: CommentFilterInput | null | undefined;
    /** Filter for nodes of type IncomingRelationTypeChangedEvent */
    isIncomingRelationTypeChangedEventAnd?: IncomingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type IssueComment */
    isIssueCommentAnd?: IssueCommentFilterInput | null | undefined;
    /** Filter for nodes of type IssueRelation */
    isIssueRelationAnd?: IssueRelationFilterInput | null | undefined;
    /** Filter for nodes of type OutgoingRelationTypeChangedEvent */
    isOutgoingRelationTypeChangedEventAnd?: OutgoingRelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type ParentTimelineItem */
    isParentTimelineItemAnd?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for nodes of type PriorityChangedEvent */
    isPriorityChangedEventAnd?: PriorityChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type PublicTimelineItem */
    isPublicTimelineItemAnd?: PublicTimelineItemFilterInput | null | undefined;
    /** Filter for nodes of type RelatedByIssueEvent */
    isRelatedByIssueEventAnd?: RelatedByIssueEventFilterInput | null | undefined;
    /** Filter for nodes of type RelationTypeChangedEvent */
    isRelationTypeChangedEventAnd?: RelationTypeChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedAffectedEntityEvent */
    isRemovedAffectedEntityEventAnd?: RemovedAffectedEntityEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedArtefactEvent */
    isRemovedArtefactEventAnd?: RemovedArtefactEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedAssignmentEvent */
    isRemovedAssignmentEventAnd?: RemovedAssignmentEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedFromPinnedIssuesEvent */
    isRemovedFromPinnedIssuesEventAnd?: RemovedFromPinnedIssuesEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedFromTrackableEvent */
    isRemovedFromTrackableEventAnd?: RemovedFromTrackableEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedIncomingRelationEvent */
    isRemovedIncomingRelationEventAnd?: RemovedIncomingRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedLabelEvent */
    isRemovedLabelEventAnd?: RemovedLabelEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedOutgoingRelationEvent */
    isRemovedOutgoingRelationEventAnd?: RemovedOutgoingRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedRelationEvent */
    isRemovedRelationEventAnd?: RemovedRelationEventFilterInput | null | undefined;
    /** Filter for nodes of type RemovedTemplatedFieldEvent */
    isRemovedTemplatedFieldEventAnd?: RemovedTemplatedFieldEventFilterInput | null | undefined;
    /** Filter for nodes of type StateChangedEvent */
    isStateChangedEventAnd?: StateChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TemplateChangedEvent */
    isTemplateChangedEventAnd?: TemplateChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TemplatedFieldChangedEvent */
    isTemplatedFieldChangedEventAnd?: TemplatedFieldChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TitleChangedEvent */
    isTitleChangedEventAnd?: TitleChangedEventFilterInput | null | undefined;
    /** Filter for nodes of type TypeChangedEvent */
    isTypeChangedEventAnd?: TypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TimelineItemFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TimelineItemFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type TimelineItemListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: TimelineItemFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: TimelineItemFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: TimelineItemFilterInput | null | undefined;
};

/** All timeline items types */
export type TimelineItemType =
    /** AbstractTypeChangedEvent timeline item */
    | "ABSTRACT_TYPE_CHANGED_EVENT"
    /** AddedAffectedEntityEvent timeline item */
    | "ADDED_AFFECTED_ENTITY_EVENT"
    /** AddedArtefactEvent timeline item */
    | "ADDED_ARTEFACT_EVENT"
    /** AddedLabelEvent timeline item */
    | "ADDED_LABEL_EVENT"
    /** AddedToPinnedIssuesEvent timeline item */
    | "ADDED_TO_PINNED_ISSUES_EVENT"
    /** AddedToTrackableEvent timeline item */
    | "ADDED_TO_TRACKABLE_EVENT"
    /** Assignment timeline item */
    | "ASSIGNMENT"
    /** AssignmentTypeChangedEvent timeline item */
    | "ASSIGNMENT_TYPE_CHANGED_EVENT"
    /** Body timeline item */
    | "BODY"
    /** Comment timeline item */
    | "COMMENT"
    /** IncomingRelationTypeChangedEvent timeline item */
    | "INCOMING_RELATION_TYPE_CHANGED_EVENT"
    /** IssueComment timeline item */
    | "ISSUE_COMMENT"
    /** IssueRelation timeline item */
    | "ISSUE_RELATION"
    /** OutgoingRelationTypeChangedEvent timeline item */
    | "OUTGOING_RELATION_TYPE_CHANGED_EVENT"
    /** ParentTimelineItem timeline item */
    | "PARENT_TIMELINE_ITEM"
    /** PriorityChangedEvent timeline item */
    | "PRIORITY_CHANGED_EVENT"
    /** PublicTimelineItem timeline item */
    | "PUBLIC_TIMELINE_ITEM"
    /** RelatedByIssueEvent timeline item */
    | "RELATED_BY_ISSUE_EVENT"
    /** RelationTypeChangedEvent timeline item */
    | "RELATION_TYPE_CHANGED_EVENT"
    /** RemovedAffectedEntityEvent timeline item */
    | "REMOVED_AFFECTED_ENTITY_EVENT"
    /** RemovedArtefactEvent timeline item */
    | "REMOVED_ARTEFACT_EVENT"
    /** RemovedAssignmentEvent timeline item */
    | "REMOVED_ASSIGNMENT_EVENT"
    /** RemovedFromPinnedIssuesEvent timeline item */
    | "REMOVED_FROM_PINNED_ISSUES_EVENT"
    /** RemovedFromTrackableEvent timeline item */
    | "REMOVED_FROM_TRACKABLE_EVENT"
    /** RemovedIncomingRelationEvent timeline item */
    | "REMOVED_INCOMING_RELATION_EVENT"
    /** RemovedLabelEvent timeline item */
    | "REMOVED_LABEL_EVENT"
    /** RemovedOutgoingRelationEvent timeline item */
    | "REMOVED_OUTGOING_RELATION_EVENT"
    /** RemovedRelationEvent timeline item */
    | "REMOVED_RELATION_EVENT"
    /** RemovedTemplatedFieldEvent timeline item */
    | "REMOVED_TEMPLATED_FIELD_EVENT"
    /** StateChangedEvent timeline item */
    | "STATE_CHANGED_EVENT"
    /** TemplatedFieldChangedEvent timeline item */
    | "TEMPLATED_FIELD_CHANGED_EVENT"
    /** TemplateChangedEvent timeline item */
    | "TEMPLATE_CHANGED_EVENT"
    /** TimelineItem timeline item */
    | "TIMELINE_ITEM"
    /** TitleChangedEvent timeline item */
    | "TITLE_CHANGED_EVENT"
    /** TypeChangedEvent timeline item */
    | "TYPE_CHANGED_EVENT";

/** Filter used to filter TitleChangedEvent */
export type TitleChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<TitleChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filter by newTitle */
    newTitle?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TitleChangedEventFilterInput | null | undefined;
    /** Filter by oldTitle */
    oldTitle?: StringFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TitleChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter Trackable */
export type TrackableFilterInput = {
    /** Filter by affectingIssues */
    affectingIssues?: IssueListFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<TrackableFilterInput> | null | undefined;
    /** Filter by artefacts */
    artefacts?: ArtefactListFilterInput | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type Component */
    isComponentAnd?: ComponentFilterInput | null | undefined;
    /** Filter for nodes of type Project */
    isProjectAnd?: ProjectFilterInput | null | undefined;
    /** Filter by issues */
    issues?: IssueListFilterInput | null | undefined;
    /** Filter by labels */
    labels?: LabelListFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TrackableFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TrackableFilterInput> | null | undefined;
    /** Filter by pinnedIssues */
    pinnedIssues?: IssueListFilterInput | null | undefined;
    /** Filters for AffectedByIssues which are related to a Trackable */
    relatedTo?: string | number | null | undefined;
    /** Filter by repositoryURL */
    repositoryURL?: NullableStringFilterInput | null | undefined;
    /** Filter by syncsTo */
    syncsTo?: ImsProjectListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type TrackableListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: TrackableFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: TrackableFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: TrackableFilterInput | null | undefined;
};

/** Filter used to filter TrackablePermission */
export type TrackablePermissionFilterInput = {
    /** Filter by allUsers */
    allUsers?: BooleanFilterInput | null | undefined;
    /** Connects all subformulas via and */
    and?: Array<TrackablePermissionFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type ComponentPermission */
    isComponentPermissionAnd?: ComponentPermissionFilterInput | null | undefined;
    /** Filter for nodes of type ProjectPermission */
    isProjectPermissionAnd?: ProjectPermissionFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TrackablePermissionFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TrackablePermissionFilterInput> | null | undefined;
    /** Filter by users */
    users?: GropiusUserListFilterInput | null | undefined;
};

/** Filter used to filter TypeChangedEvent */
export type TypeChangedEventFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<TypeChangedEventFilterInput> | null | undefined;
    /** Filter by createdAt */
    createdAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    createdBy?: UserFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    issue?: IssueFilterInput | null | undefined;
    /** Filter by lastModifiedAt */
    lastModifiedAt?: DateTimeFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    lastModifiedBy?: UserFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    newType?: IssueTypeFilterInput | null | undefined;
    /** Negates the subformula */
    not?: TypeChangedEventFilterInput | null | undefined;
    /** Filters for nodes where the related node match this filter */
    oldType?: IssueTypeFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<TypeChangedEventFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    parentItem?: ParentTimelineItemFilterInput | null | undefined;
    /** Filter for specific timeline items. Entries are joined by OR */
    timelineItemTypes?: Array<TimelineItemType> | null | undefined;
};

/** Filter used to filter User */
export type UserFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<UserFilterInput> | null | undefined;
    /** Filter by assignments */
    assignments?: AssignmentListFilterInput | null | undefined;
    /** Filter by createdNodes */
    createdNodes?: AuditedNodeListFilterInput | null | undefined;
    /** Filter by displayName */
    displayName?: StringFilterInput | null | undefined;
    /** Filter by email */
    email?: NullableStringFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter for nodes of type GropiusUser */
    isGropiusUserAnd?: GropiusUserFilterInput | null | undefined;
    /** Filter for nodes of type IMSUser */
    isIMSUserAnd?: ImsUserFilterInput | null | undefined;
    /** Negates the subformula */
    not?: UserFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<UserFilterInput> | null | undefined;
    /** Filter by participatedIssues */
    participatedIssues?: IssueListFilterInput | null | undefined;
    /** Filter by username */
    username?: NullableStringFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type UserListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: UserFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: UserFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: UserFilterInput | null | undefined;
};

/** Filter used to filter View */
export type ViewFilterInput = {
    /** Connects all subformulas via and */
    and?: Array<ViewFilterInput> | null | undefined;
    /** Filter by description */
    description?: StringFilterInput | null | undefined;
    /** Filter by filterByTemplate */
    filterByTemplate?: ComponentTemplateListFilterInput | null | undefined;
    /** Filter by id */
    id?: IdFilterInput | null | undefined;
    /** Filter by name */
    name?: StringFilterInput | null | undefined;
    /** Negates the subformula */
    not?: ViewFilterInput | null | undefined;
    /** Connects all subformulas via or */
    or?: Array<ViewFilterInput> | null | undefined;
    /** Filters for nodes where the related node match this filter */
    project?: ProjectFilterInput | null | undefined;
    /** Filter by relationLayouts */
    relationLayouts?: RelationLayoutListFilterInput | null | undefined;
    /** Filter by relationPartnerLayouts */
    relationPartnerLayouts?: RelationPartnerLayoutListFilterInput | null | undefined;
};

/** Used to filter by a connection-based property. Fields are joined by AND */
export type ViewListFilterInput = {
    /** Filters for nodes where all of the related nodes match this filter */
    all?: ViewFilterInput | null | undefined;
    /** Filters for nodes where any of the related nodes match this filter */
    any?: ViewFilterInput | null | undefined;
    /** Filters for nodes where none of the related nodes match this filter */
    none?: ViewFilterInput | null | undefined;
};

export type LegalInformationQueryVariables = Exact<{ [key: string]: never }>;

export type LegalInformationQuery = {
    legalInformation: { nodes: Array<{ id: string; label: string; priority: number }> };
};

export type GetLegalInformationQueryVariables = Exact<{
    id: string | number;
}>;

export type GetLegalInformationQuery = {
    node: { text: string; id: string; label: string; priority: number } | Record<PropertyKey, never> | null;
};

export type CheckUserIsAdminQueryVariables = Exact<{
    id: string | number;
}>;

export type CheckUserIsAdminQuery = {
    node:
        | { __typename: "AddedAffectedEntityEvent" }
        | { __typename: "AddedArtefactEvent" }
        | { __typename: "AddedLabelEvent" }
        | { __typename: "AddedToPinnedIssuesEvent" }
        | { __typename: "AddedToTrackableEvent" }
        | { __typename: "AggregatedIssue" }
        | { __typename: "AggregatedIssueRelation" }
        | { __typename: "Artefact" }
        | { __typename: "ArtefactTemplate" }
        | { __typename: "Assignment" }
        | { __typename: "AssignmentType" }
        | { __typename: "AssignmentTypeChangedEvent" }
        | { __typename: "Body" }
        | { __typename: "Component" }
        | { __typename: "ComponentPermission" }
        | { __typename: "ComponentTemplate" }
        | { __typename: "ComponentVersion" }
        | { __typename: "ComponentVersionTemplate" }
        | { __typename: "FillStyle" }
        | { __typename: "GlobalPermission" }
        | { __typename: "GropiusUser"; id: string; isAdmin: boolean }
        | { __typename: "IMS" }
        | { __typename: "IMSIssue" }
        | { __typename: "IMSIssueTemplate" }
        | { __typename: "IMSPermission" }
        | { __typename: "IMSProject" }
        | { __typename: "IMSProjectTemplate" }
        | { __typename: "IMSTemplate" }
        | { __typename: "IMSUser" }
        | { __typename: "IMSUserTemplate" }
        | { __typename: "IncomingRelationTypeChangedEvent" }
        | { __typename: "Interface" }
        | { __typename: "InterfaceDefinition" }
        | { __typename: "InterfacePart" }
        | { __typename: "InterfacePartTemplate" }
        | { __typename: "InterfaceSpecification" }
        | { __typename: "InterfaceSpecificationDerivationCondition" }
        | { __typename: "InterfaceSpecificationTemplate" }
        | { __typename: "InterfaceSpecificationVersion" }
        | { __typename: "InterfaceSpecificationVersionTemplate" }
        | { __typename: "IntraComponentDependencyParticipant" }
        | { __typename: "IntraComponentDependencySpecification" }
        | { __typename: "IntraComponentDependencySpecificationType" }
        | { __typename: "Issue" }
        | { __typename: "IssueComment" }
        | { __typename: "IssuePriority" }
        | { __typename: "IssueRelation" }
        | { __typename: "IssueRelationType" }
        | { __typename: "IssueState" }
        | { __typename: "IssueTemplate" }
        | { __typename: "IssueType" }
        | { __typename: "Label" }
        | { __typename: "LegalInformation" }
        | { __typename: "OutgoingRelationTypeChangedEvent" }
        | { __typename: "PriorityChangedEvent" }
        | { __typename: "Project" }
        | { __typename: "ProjectPermission" }
        | { __typename: "RelatedByIssueEvent" }
        | { __typename: "Relation" }
        | { __typename: "RelationCondition" }
        | { __typename: "RelationLayout" }
        | { __typename: "RelationPartnerLayout" }
        | { __typename: "RelationTemplate" }
        | { __typename: "RemovedAffectedEntityEvent" }
        | { __typename: "RemovedArtefactEvent" }
        | { __typename: "RemovedAssignmentEvent" }
        | { __typename: "RemovedFromPinnedIssuesEvent" }
        | { __typename: "RemovedFromTrackableEvent" }
        | { __typename: "RemovedIncomingRelationEvent" }
        | { __typename: "RemovedLabelEvent" }
        | { __typename: "RemovedOutgoingRelationEvent" }
        | { __typename: "RemovedTemplatedFieldEvent" }
        | { __typename: "StateChangedEvent" }
        | { __typename: "StrokeStyle" }
        | { __typename: "TemplateChangedEvent" }
        | { __typename: "TemplatedFieldChangedEvent" }
        | { __typename: "TitleChangedEvent" }
        | { __typename: "TypeChangedEvent" }
        | { __typename: "View" }
        | null;
};

export type GetBasicGropiusUserDataQueryVariables = Exact<{
    id: string | number;
}>;

export type GetBasicGropiusUserDataQuery = {
    node:
        | { __typename: "GropiusUser"; id: string; username: string; displayName: string; email: string | null }
        | Record<PropertyKey, never>
        | null;
};

export type GetAllGropiusUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllGropiusUsersQuery = { gropiusUserIds: Array<string> };

export type CreateNewUserMutationVariables = Exact<{
    input: CreateGropiusUserInput;
}>;

export type CreateNewUserMutation = {
    createGropiusUser: {
        gropiusUser: {
            __typename: "GropiusUser";
            id: string;
            username: string;
            displayName: string;
            email: string | null;
        };
    };
};

export type SetImsUserLinkMutationVariables = Exact<{
    gropiusUserId: string | number;
    imsUserId: string | number;
}>;

export type SetImsUserLinkMutation = {
    updateIMSUser: { __typename: "UpdateIMSUserPayload"; imsUser: { __typename: "IMSUser"; id: string } };
};

export type GetImsUserDetailsQueryVariables = Exact<{
    imsUserId: string | number;
}>;

export type GetImsUserDetailsQuery = {
    node:
        | { __typename: "AddedAffectedEntityEvent" }
        | { __typename: "AddedArtefactEvent" }
        | { __typename: "AddedLabelEvent" }
        | { __typename: "AddedToPinnedIssuesEvent" }
        | { __typename: "AddedToTrackableEvent" }
        | { __typename: "AggregatedIssue" }
        | { __typename: "AggregatedIssueRelation" }
        | { __typename: "Artefact" }
        | { __typename: "ArtefactTemplate" }
        | { __typename: "Assignment" }
        | { __typename: "AssignmentType" }
        | { __typename: "AssignmentTypeChangedEvent" }
        | { __typename: "Body" }
        | { __typename: "Component" }
        | { __typename: "ComponentPermission" }
        | { __typename: "ComponentTemplate" }
        | { __typename: "ComponentVersion" }
        | { __typename: "ComponentVersionTemplate" }
        | { __typename: "FillStyle" }
        | { __typename: "GlobalPermission" }
        | { __typename: "GropiusUser" }
        | { __typename: "IMS" }
        | { __typename: "IMSIssue" }
        | { __typename: "IMSIssueTemplate" }
        | { __typename: "IMSPermission" }
        | { __typename: "IMSProject" }
        | { __typename: "IMSProjectTemplate" }
        | { __typename: "IMSTemplate" }
        | {
              __typename: "IMSUser";
              id: string;
              username: string | null;
              displayName: string;
              email: string | null;
              templatedFields: Array<{ __typename: "JSONField"; name: string; value: any }>;
              ims: {
                  __typename: "IMS";
                  id: string;
                  name: string;
                  description: string;
                  templatedFields: Array<{ __typename: "JSONField"; name: string; value: any }>;
              };
          }
        | { __typename: "IMSUserTemplate" }
        | { __typename: "IncomingRelationTypeChangedEvent" }
        | { __typename: "Interface" }
        | { __typename: "InterfaceDefinition" }
        | { __typename: "InterfacePart" }
        | { __typename: "InterfacePartTemplate" }
        | { __typename: "InterfaceSpecification" }
        | { __typename: "InterfaceSpecificationDerivationCondition" }
        | { __typename: "InterfaceSpecificationTemplate" }
        | { __typename: "InterfaceSpecificationVersion" }
        | { __typename: "InterfaceSpecificationVersionTemplate" }
        | { __typename: "IntraComponentDependencyParticipant" }
        | { __typename: "IntraComponentDependencySpecification" }
        | { __typename: "IntraComponentDependencySpecificationType" }
        | { __typename: "Issue" }
        | { __typename: "IssueComment" }
        | { __typename: "IssuePriority" }
        | { __typename: "IssueRelation" }
        | { __typename: "IssueRelationType" }
        | { __typename: "IssueState" }
        | { __typename: "IssueTemplate" }
        | { __typename: "IssueType" }
        | { __typename: "Label" }
        | { __typename: "LegalInformation" }
        | { __typename: "OutgoingRelationTypeChangedEvent" }
        | { __typename: "PriorityChangedEvent" }
        | { __typename: "Project" }
        | { __typename: "ProjectPermission" }
        | { __typename: "RelatedByIssueEvent" }
        | { __typename: "Relation" }
        | { __typename: "RelationCondition" }
        | { __typename: "RelationLayout" }
        | { __typename: "RelationPartnerLayout" }
        | { __typename: "RelationTemplate" }
        | { __typename: "RemovedAffectedEntityEvent" }
        | { __typename: "RemovedArtefactEvent" }
        | { __typename: "RemovedAssignmentEvent" }
        | { __typename: "RemovedFromPinnedIssuesEvent" }
        | { __typename: "RemovedFromTrackableEvent" }
        | { __typename: "RemovedIncomingRelationEvent" }
        | { __typename: "RemovedLabelEvent" }
        | { __typename: "RemovedOutgoingRelationEvent" }
        | { __typename: "RemovedTemplatedFieldEvent" }
        | { __typename: "StateChangedEvent" }
        | { __typename: "StrokeStyle" }
        | { __typename: "TemplateChangedEvent" }
        | { __typename: "TemplatedFieldChangedEvent" }
        | { __typename: "TitleChangedEvent" }
        | { __typename: "TypeChangedEvent" }
        | { __typename: "View" }
        | null;
};

export type GetImsUsersByTemplatedFieldValuesQueryVariables = Exact<{
    imsFilterInput: ImsFilterInput;
    userFilterInput: ImsUserFilterInput;
}>;

export type GetImsUsersByTemplatedFieldValuesQuery = {
    imss: {
        __typename: "IMSConnection";
        nodes: Array<{
            __typename: "IMS";
            id: string;
            users: { __typename: "IMSUserConnection"; nodes: Array<{ __typename: "IMSUser"; id: string }> };
        }>;
    };
};

export type CreateNewImsUserInImsMutationVariables = Exact<{
    input: CreateImsUserInput;
}>;

export type CreateNewImsUserInImsMutation = {
    createIMSUser: { __typename: "CreateIMSUserPayload"; imsUser: { __typename: "IMSUser"; id: string } };
};

export type GetBasicImsUserDataQueryVariables = Exact<{
    imsUserId: string | number;
}>;

export type GetBasicImsUserDataQuery = {
    node:
        | { __typename: "AddedAffectedEntityEvent"; id: string }
        | { __typename: "AddedArtefactEvent"; id: string }
        | { __typename: "AddedLabelEvent"; id: string }
        | { __typename: "AddedToPinnedIssuesEvent"; id: string }
        | { __typename: "AddedToTrackableEvent"; id: string }
        | { __typename: "AggregatedIssue"; id: string }
        | { __typename: "AggregatedIssueRelation"; id: string }
        | { __typename: "Artefact"; id: string }
        | { __typename: "ArtefactTemplate"; id: string }
        | { __typename: "Assignment"; id: string }
        | { __typename: "AssignmentType"; id: string }
        | { __typename: "AssignmentTypeChangedEvent"; id: string }
        | { __typename: "Body"; id: string }
        | { __typename: "Component"; id: string }
        | { __typename: "ComponentPermission"; id: string }
        | { __typename: "ComponentTemplate"; id: string }
        | { __typename: "ComponentVersion"; id: string }
        | { __typename: "ComponentVersionTemplate"; id: string }
        | { __typename: "FillStyle"; id: string }
        | { __typename: "GlobalPermission"; id: string }
        | { __typename: "GropiusUser"; id: string }
        | { __typename: "IMS"; id: string }
        | { __typename: "IMSIssue"; id: string }
        | { __typename: "IMSIssueTemplate"; id: string }
        | { __typename: "IMSPermission"; id: string }
        | { __typename: "IMSProject"; id: string }
        | { __typename: "IMSProjectTemplate"; id: string }
        | { __typename: "IMSTemplate"; id: string }
        | { __typename: "IMSUser"; id: string }
        | { __typename: "IMSUserTemplate"; id: string }
        | { __typename: "IncomingRelationTypeChangedEvent"; id: string }
        | { __typename: "Interface"; id: string }
        | { __typename: "InterfaceDefinition"; id: string }
        | { __typename: "InterfacePart"; id: string }
        | { __typename: "InterfacePartTemplate"; id: string }
        | { __typename: "InterfaceSpecification"; id: string }
        | { __typename: "InterfaceSpecificationDerivationCondition"; id: string }
        | { __typename: "InterfaceSpecificationTemplate"; id: string }
        | { __typename: "InterfaceSpecificationVersion"; id: string }
        | { __typename: "InterfaceSpecificationVersionTemplate"; id: string }
        | { __typename: "IntraComponentDependencyParticipant"; id: string }
        | { __typename: "IntraComponentDependencySpecification"; id: string }
        | { __typename: "IntraComponentDependencySpecificationType"; id: string }
        | { __typename: "Issue"; id: string }
        | { __typename: "IssueComment"; id: string }
        | { __typename: "IssuePriority"; id: string }
        | { __typename: "IssueRelation"; id: string }
        | { __typename: "IssueRelationType"; id: string }
        | { __typename: "IssueState"; id: string }
        | { __typename: "IssueTemplate"; id: string }
        | { __typename: "IssueType"; id: string }
        | { __typename: "Label"; id: string }
        | { __typename: "LegalInformation"; id: string }
        | { __typename: "OutgoingRelationTypeChangedEvent"; id: string }
        | { __typename: "PriorityChangedEvent"; id: string }
        | { __typename: "Project"; id: string }
        | { __typename: "ProjectPermission"; id: string }
        | { __typename: "RelatedByIssueEvent"; id: string }
        | { __typename: "Relation"; id: string }
        | { __typename: "RelationCondition"; id: string }
        | { __typename: "RelationLayout"; id: string }
        | { __typename: "RelationPartnerLayout"; id: string }
        | { __typename: "RelationTemplate"; id: string }
        | { __typename: "RemovedAffectedEntityEvent"; id: string }
        | { __typename: "RemovedArtefactEvent"; id: string }
        | { __typename: "RemovedAssignmentEvent"; id: string }
        | { __typename: "RemovedFromPinnedIssuesEvent"; id: string }
        | { __typename: "RemovedFromTrackableEvent"; id: string }
        | { __typename: "RemovedIncomingRelationEvent"; id: string }
        | { __typename: "RemovedLabelEvent"; id: string }
        | { __typename: "RemovedOutgoingRelationEvent"; id: string }
        | { __typename: "RemovedTemplatedFieldEvent"; id: string }
        | { __typename: "StateChangedEvent"; id: string }
        | { __typename: "StrokeStyle"; id: string }
        | { __typename: "TemplateChangedEvent"; id: string }
        | { __typename: "TemplatedFieldChangedEvent"; id: string }
        | { __typename: "TitleChangedEvent"; id: string }
        | { __typename: "TypeChangedEvent"; id: string }
        | { __typename: "View"; id: string }
        | null;
};

export type ImsUserWithDetailFragment = {
    __typename: "IMSUser";
    id: string;
    username: string | null;
    displayName: string;
    email: string | null;
    templatedFields: Array<{ __typename: "JSONField"; name: string; value: any }>;
    ims: {
        __typename: "IMS";
        id: string;
        name: string;
        description: string;
        templatedFields: Array<{ __typename: "JSONField"; name: string; value: any }>;
    };
};

export type BaseLegalInformationInfoFragment = { id: string; label: string; priority: number };

export type DefaultLegalInformationInfoFragment = { text: string; id: string; label: string; priority: number };

export type UserDataFragment = {
    __typename: "GropiusUser";
    id: string;
    username: string;
    displayName: string;
    email: string | null;
};

export const ImsUserWithDetailFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ImsUserWithDetail" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "IMSUser" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "displayName" } },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "templatedFields" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                { kind: "Field", name: { kind: "Name", value: "name" } },
                                { kind: "Field", name: { kind: "Name", value: "value" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "ims" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "name" } },
                                { kind: "Field", name: { kind: "Name", value: "description" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "templatedFields" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                            { kind: "Field", name: { kind: "Name", value: "value" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ImsUserWithDetailFragment, unknown>;
export const BaseLegalInformationInfoFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseLegalInformationInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "LegalInformation" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "label" } },
                    { kind: "Field", name: { kind: "Name", value: "priority" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<BaseLegalInformationInfoFragment, unknown>;
export const DefaultLegalInformationInfoFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "DefaultLegalInformationInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "LegalInformation" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "FragmentSpread", name: { kind: "Name", value: "BaseLegalInformationInfo" } },
                    { kind: "Field", name: { kind: "Name", value: "text" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseLegalInformationInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "LegalInformation" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "label" } },
                    { kind: "Field", name: { kind: "Name", value: "priority" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DefaultLegalInformationInfoFragment, unknown>;
export const UserDataFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserData" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "GropiusUser" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "displayName" } },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UserDataFragment, unknown>;
export const LegalInformationDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "legalInformation" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "legalInformation" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "orderBy" },
                                value: {
                                    kind: "ListValue",
                                    values: [
                                        {
                                            kind: "ObjectValue",
                                            fields: [
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "field" },
                                                    value: { kind: "EnumValue", value: "PRIORITY" },
                                                },
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "direction" },
                                                    value: { kind: "EnumValue", value: "ASC" },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "BaseLegalInformationInfo" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseLegalInformationInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "LegalInformation" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "label" } },
                    { kind: "Field", name: { kind: "Name", value: "priority" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LegalInformationQuery, LegalInformationQueryVariables>;
export const GetLegalInformationDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "getLegalInformation" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "LegalInformation" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "DefaultLegalInformationInfo" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseLegalInformationInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "LegalInformation" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "label" } },
                    { kind: "Field", name: { kind: "Name", value: "priority" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "DefaultLegalInformationInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "LegalInformation" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "FragmentSpread", name: { kind: "Name", value: "BaseLegalInformationInfo" } },
                    { kind: "Field", name: { kind: "Name", value: "text" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetLegalInformationQuery, GetLegalInformationQueryVariables>;
export const CheckUserIsAdminDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "checkUserIsAdmin" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                {
                                    kind: "InlineFragment",
                                    typeCondition: { kind: "NamedType", name: { kind: "Name", value: "GropiusUser" } },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "isAdmin" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CheckUserIsAdminQuery, CheckUserIsAdminQueryVariables>;
export const GetBasicGropiusUserDataDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "getBasicGropiusUserData" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserData" } }],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserData" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "GropiusUser" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "displayName" } },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBasicGropiusUserDataQuery, GetBasicGropiusUserDataQueryVariables>;
export const GetAllGropiusUsersDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "getAllGropiusUsers" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [{ kind: "Field", name: { kind: "Name", value: "gropiusUserIds" } }],
            },
        },
    ],
} as unknown as DocumentNode<GetAllGropiusUsersQuery, GetAllGropiusUsersQueryVariables>;
export const CreateNewUserDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createNewUser" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "CreateGropiusUserInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createGropiusUser" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "gropiusUser" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "FragmentSpread", name: { kind: "Name", value: "UserData" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserData" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "GropiusUser" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "displayName" } },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateNewUserMutation, CreateNewUserMutationVariables>;
export const SetImsUserLinkDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "setImsUserLink" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "gropiusUserId" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "imsUserId" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateIMSUser" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "id" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "imsUserId" } },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "gropiusUser" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "gropiusUserId" } },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "imsUser" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SetImsUserLinkMutation, SetImsUserLinkMutationVariables>;
export const GetImsUserDetailsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "getImsUserDetails" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "imsUserId" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "imsUserId" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ImsUserWithDetail" } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ImsUserWithDetail" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "IMSUser" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "displayName" } },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "templatedFields" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                { kind: "Field", name: { kind: "Name", value: "name" } },
                                { kind: "Field", name: { kind: "Name", value: "value" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "ims" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "name" } },
                                { kind: "Field", name: { kind: "Name", value: "description" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "templatedFields" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                            { kind: "Field", name: { kind: "Name", value: "value" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetImsUserDetailsQuery, GetImsUserDetailsQueryVariables>;
export const GetImsUsersByTemplatedFieldValuesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "getImsUsersByTemplatedFieldValues" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "imsFilterInput" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "IMSFilterInput" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "userFilterInput" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "IMSUserFilterInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "imss" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filter" },
                                value: { kind: "Variable", name: { kind: "Name", value: "imsFilterInput" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "users" },
                                                arguments: [
                                                    {
                                                        kind: "Argument",
                                                        name: { kind: "Name", value: "filter" },
                                                        value: {
                                                            kind: "Variable",
                                                            name: { kind: "Name", value: "userFilterInput" },
                                                        },
                                                    },
                                                ],
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nodes" },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: { kind: "Name", value: "__typename" },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: { kind: "Name", value: "id" },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetImsUsersByTemplatedFieldValuesQuery, GetImsUsersByTemplatedFieldValuesQueryVariables>;
export const CreateNewImsUserInImsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createNewImsUserInIms" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "CreateIMSUserInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createIMSUser" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "imsUser" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateNewImsUserInImsMutation, CreateNewImsUserInImsMutationVariables>;
export const GetBasicImsUserDataDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "getBasicImsUserData" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "imsUserId" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "imsUserId" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBasicImsUserDataQuery, GetBasicImsUserDataQueryVariables>;
