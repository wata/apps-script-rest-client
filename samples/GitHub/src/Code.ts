import { GitHubAPI } from './GitHubAPI'

function run() {
  const request = new GitHubAPI.SearchRepositoriesRequest('typescript')
  const result = RestClient.send(request)
  if (!result.ok) {
    Logger.log(JSON.stringify(result.error))
    return
  }
  const response = result.value
  Logger.log(JSON.stringify(response))
}
