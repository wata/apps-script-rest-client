export class GitHubError implements Error {
  readonly message: string
  readonly name = 'GitHubError'

  constructor(object: { message: string }) {
    this.message = object.message
  }

  toString() {
    return `${this.name}: ${this.message}`
  }
}

abstract class GitHubRequest<T> extends RestClient.Request<T> {
  constructor(
    method: 'get' | 'post',
    path: string,
    queryParameters?: { [key: string]: any },
    payload?: object,
  ) {
    super('https://api.github.com', method, path, queryParameters, payload)
  }

  intercept(object: any, httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse): Error | null  {
    const statusCode = httpResponse.getResponseCode()
    if (statusCode >= 200 && statusCode < 300) {
      return null
    }
    return new GitHubError(object)
  }
}

export namespace GitHubAPI {
  export class SearchRepositoriesRequest extends GitHubRequest<ISearchResponse> {
    constructor(query: string) {
      super(
        'get',
        `/search/repositories`,
        { q: query },
      )
    }
  }
}

export interface ISearchResponse {
  readonly items: object[]
  readonly totalCount: number
}
