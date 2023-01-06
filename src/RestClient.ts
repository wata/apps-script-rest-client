type Result<T> =
  | { ok: true, value: T }
  | { ok: false, error: Error }

class ResponseError implements Error {
  public readonly name = 'ResponseError'

  constructor(public readonly statusCode: number, public readonly object: any, public readonly message: string) { }

  public toString() {
    return `${this.name}: ${this.message}`
  }
}

interface IResponse<T> {
  readonly statusCode: number
  readonly object: T
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

  public intercept(object: any, httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse): Error | null {
    const statusCode = httpResponse.getResponseCode()
    if (statusCode >= 200 && statusCode < 300) {
      return null
    }
    return new ResponseError(
      statusCode,
      object,
      `Unacceptable status code ${statusCode}\n${JSON.stringify(this, null, 2)}\n${JSON.stringify(object, null, 2)}`
    )
  }

  public response(httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse): Result<IResponse<T>> {
    const contents = httpResponse.getContentText()
    const parsedObject = contents.length > 0 ? JSON.parse(contents) : {}
    const interceptedError = this.intercept(parsedObject, httpResponse)
    if (error) {
      return { ok: false, error: interceptedError }
    }
    const response = {
      statusCode: httpResponse.getResponseCode(),
      object: parsedObject,
      headers: httpResponse.getAllHeaders(),
    }
    return { ok: true, value: response }
  }
}

function send<T>(request: Request<T>): Result<IResponse<T>> {
  return request.response(UrlFetchApp.fetch(request.url, request.options))
}
