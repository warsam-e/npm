# @warsam-e/npm

### Get information about a package or user from the NPM registry.

<a href="https://www.npmjs.com/package/@warsam-e/npm"><img src="https://img.shields.io/npm/v/@warsam-e/npm?maxAge=600" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/@warsam-e/npm"><img src="https://img.shields.io/npm/dt/@warsam-e/npm.svg?maxAge=600" alt="npm downloads" /></a>

### Documentation live at https://warsame.me/npm

## Installation

```zsh
% bun i @warsam-e/npm
```

## Usage

### Get User

```ts
import { npm_user } from '@warsam-e/npm';

const user = await npm_user('username');
const user_packages = await npm_packages('username');
const search_results = await npm_search('query');
const package_info = await npm_package('package-name');
```


