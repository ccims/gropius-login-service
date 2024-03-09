package gropius.sync.github

import com.apollographql.apollo3.exception.ApolloException
import gropius.model.architecture.IMSProject
import gropius.sync.CursorResourceWalker
import gropius.sync.CursorResourceWalkerDataService
import gropius.sync.github.generated.IssueReadQuery

/**
 * A walker that walks over all issues of a github repository
 * @param imsProject the ims project to walk over
 * @param config the config of the walker
 * @param budget the budget of the walker
 * @param apolloClient the apollo client to use for the walker
 * @param issuePileService the issue pile service to use for the walker
 * @param cursorResourceWalkerDataService the data service to use for the walker
 */
class IssueWalker(
    imsProject: IMSProject,
    val config: GitHubResourceWalkerConfig,
    budget: GithubResourceWalkerBudget,
    val githubDataService: GithubDataService,
    val issuePileService: IssuePileService,
    cursorResourceWalkerDataService: CursorResourceWalkerDataService
) : CursorResourceWalker<GithubGithubResourceWalkerBudgetUsageType, GithubGithubResourceWalkerEstimatedBudgetUsageType, GithubResourceWalkerBudget>(
    imsProject, imsProject.rawId!!, config.resourceWalkerConfig, budget, cursorResourceWalkerDataService
) {

    override suspend fun execute(): GithubGithubResourceWalkerBudgetUsageType {
        try {
            println("E1")
            val newestIssue = issuePileService.findFirstByImsProjectOrderByLastUpdateDesc(imsProject.rawId!!)
            println("E2")
            val since = newestIssue?.lastUpdate
            println("E3")
            var cursor: String? = null
            println("E4")
            do {
                println("E5")
                val query = IssueReadQuery(
                    repoOwner = config.remoteOwner,
                    repoName = config.remoteRepo,
                    since = since,
                    cursor = cursor,
                    issueCount = config.count
                )
                println("E6")
                val response = githubDataService.query(imsProject, listOf(), query).second
                println("E7")
                cursor = if (response.data?.repository?.issues?.pageInfo?.hasNextPage == true) {
                    println("E8")
                    response.data?.repository?.issues?.pageInfo?.endCursor
                } else null;
                println("E9")
                val isRateLimited = response.errors?.any {
                    println("E10")
                    it.nonStandardFields?.get("type") == "RATE_LIMITED"
                } ?: false
                println("E11")
                if (isRateLimited) {
                    println("E12")
                    return GithubGithubResourceWalkerBudgetUsageType()//TODO: rate limit max err
                }
                println("E13")
                if (response.errors?.isEmpty() != false) {
                    println("E14")
                    response.data?.repository?.issues?.nodes?.forEach {
                        println("E15")
                        issuePileService.integrateIssue(
                            imsProject, it!!
                        )
                    }
                }
                println("E16")
            } while (cursor != null);
            println("E17")
        } catch (e: ApolloException) {
            e.printStackTrace()
        }
        return GithubGithubResourceWalkerBudgetUsageType();
    }
}

