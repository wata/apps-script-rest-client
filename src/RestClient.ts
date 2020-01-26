type Result<T> =
  | { ok: true, value: T }
  | { ok: false, error: ResponseError }

class ResponseError implements Error {
  public name = 'ResponseError'

  constructor(public statusCode: number, public result: object, public message: string) { }

  public toString() {
    return `${this.name}: ${this.message}`
  }
}

interface IResponse<T> {
  readonly statusCode: number
  readonly result: T
  readonly headers: object
}

abstract class Request<T> {
  public readonly url: string
  public readonly options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

  constructor(
    baseURL: string,
    method: 'get' | 'delete' | 'patch' | 'post' | 'put',
    path: string,
    queryParameters?: { [key: string]: any },
    payload?: object,
    options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
  ) {
    this.url = `${baseURL}${path}`
    if (queryParameters) {
      this.url += `?${Object.keys(queryParameters).map(key => key + '=' + queryParameters[key]).join('&')}`
    }
    this.options = Object.assign(
      { contentType: 'application/json; charset=utf-8', muteHttpExceptions: true, method },
      payload && { payload: JSON.stringify(payload) },
      options,
    )
  }

  public response(httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse): Result<IResponse<T>> {
    const response = {
      statusCode: httpResponse.getResponseCode(),
      result: JSON.parse(httpResponse.getContentText()),
      headers: httpResponse.getAllHeaders(),
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return { ok: true, value: response }
    }
    const error = new ResponseError(
      response.statusCode,
      response.result,
      `Unacceptable status code ${response.statusCode}\n${JSON.stringify(this, null, 2)}\n${JSON.stringify(response.result, null, 2)}`,
    )
    return { ok: false, error }
  }
}

function send<T>(request: Request<T>): Result<IResponse<T>> {
  return request.response(UrlFetchApp.fetch(request.url, request.options))
}
