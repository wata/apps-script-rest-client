# Google Apps Script REST Client with typings for use with TypeScript

A lightweight REST client optimized for use with TypeScript with generics.

## Setup

This library is already published as an Apps Script, making it easy to include in your project. To add it to your script, do the following in the Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."
1. In the "Find a Library" text box, enter the script ID `1mvxMPd7MWgOeQmOzovVgU3yXcSlnPZ74tz1tjxNI-zMs4wO_xcm5aTJq` and click the "Select" button.
1. Choose a version in the dropdown box (usually best to pick the latest version).
1. Click the "Save" button.

If you are [setting explicit scopes](https://developers.google.com/apps-script/concepts/scopes#setting_explicit_scopes) in your manifest file, ensure that the following scope is included:

- `https://www.googleapis.com/auth/script.external_request`

### Add Typescript Definitions:

1. Add the package:
    ```sh
    npm install -D @wnagasawa/apps-script-rest-client
    ```
1. Configure tsconfig.json:
    ```json
    {
      "compilerOptions": {
        "typeRoots" : ["node_modules/@wnagasawa", "node_modules/@types"]
      }
    }
    ```

## Usage

### 1. Base URL

```typescript
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
```

### 2. Defining request types

```typescript
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
  readonly items: IItem[]
  readonly totalCount: number
}
```

### 3. Sending request

```typescript
import { GitHubAPI } from './GitHubAPI'

function run() {
  const request = new GitHubAPI.SearchRepositoriesRequest('typescript')
  const result = RestClient.send(request)
  if (!result.ok) {
    console.log(result.error)
    return
  }
  const response = result.value
  console.log(response)
}
```
