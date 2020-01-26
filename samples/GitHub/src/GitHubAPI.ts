abstract class GitHubRequest<T> extends RestClient.Request<T> {
  constructor(
    method: 'get' | 'post',
    path: string,
    queryParameters?: { [key: string]: any },
    payload?: object,
  ) {
    super('https://api.github.com', method, path, queryParameters, payload)
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
