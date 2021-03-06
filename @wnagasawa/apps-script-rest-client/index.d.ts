/// <reference types="google-apps-script" />

declare namespace RestClient {
  function send<T>(request: Request<T>): Result<IResponse<T>>;

  type Result<T> = {
    ok: true;
    value: T;
  } | {
    ok: false;
    error: Error;
  };

  interface IResponse<T> {
    readonly statusCode: number;
    readonly object: T;
    readonly headers: object;
  }

  class ResponseError implements Error {
    readonly statusCode: number;
    readonly object: object;
    readonly message: string;
    readonly name: string;
    constructor(statusCode: number, object: object, message: string);
    toString(): string;
  }

  abstract class Request<T> {
    readonly url: string;
    readonly options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    constructor(baseURL: string, method: 'get' | 'delete' | 'patch' | 'post' | 'put', path: string, queryParameters?: {
      [key: string]: any;
    }, payload?: object, options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions);
    intercept(object: any, httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse): Error | null;
    response(httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse): Result<IResponse<T>>;
  }
}
