import { GitHubAPI, GitHubError } from './GitHubAPI'

function run() {
  const request = new GitHubAPI.SearchRepositoriesRequest('typescript')
  const result = RestClient.send(request)
  if (!result.ok) {
    handleError(result.error)
    return
  }
  const response = result.value.object
  console.log(response)
}

function handleError(error: Error) {
  if (error instanceof GitHubError) {
    console.error(error.message) // Prints message from GitHub API
    return
  }
  console.error(error)
}
