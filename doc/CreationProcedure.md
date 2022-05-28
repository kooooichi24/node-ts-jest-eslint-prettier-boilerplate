# How to create this template

本テンプレートを作成した手順

## 手順

### 1. git 初期化

```
git init
```

#### .gitignore の作成

```sh
touch .gitignore
```

下記を設定 (必要に応じて修正してください)

```
node_modules/
dist/
coverage/
test-report/
```

### 2. package.json の作成

```sh
npm init
```

### 3. TypeScript の設定

#### パッケージのインストール

```sh
npm i -D typescript @types/node
```

#### Typescript から Javascript へコンパイルする際の、設定ファイル(tsconfig)の作成

```sh
npx tsc --init
```

#### tsconfig.json の修正

```json
{
  "compilerOptions": {
    "target": "es2020",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "rootDir": "./",
    "moduleResolution": "node",
    "baseUrl": ".",
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "__tests__/**/*"],
  "exclude": ["dist/**/*", "node_modules/**/*"]
}
```

下記を参考にした

- [すべての TSConfig のオプションのドキュメント - TypeScript](https://www.typescriptlang.org/ja/tsconfig)
- [tsconfig.json - TypeScript Deep Dive 日本語版について](https://typescript-jp.gitbook.io/deep-dive/project/compilation-context/tsconfig)
- [tsconfig.json を設定する - サバイバル TypeScript](https://typescriptbook.jp/reference/tsconfig/tsconfig.json-settings)

### 4. ESLint の設定

#### typescript に lint を導入するために、eslint のライブラリを導入

[TypeScript ESLint](https://typescript-eslint.io/) の [Getting Start](https://typescript-eslint.io/docs/linting/) を参考にする

```sh
npm i -D eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### .eslintrc.yml の作成

```sh
touch .eslintrc.yml
```

下記を設定

```yml
root: true
env:
  es2020: true
  node: true
parser: "@typescript-eslint/parser"
parserOptions:
  sourceType: "module"
  ecmaVersion: 2020,
plugins:
  - "@typescript-eslint"
extends:
  - "eslint:recommended"
  - "plugin:@typescript-eslint/recommended"
```

#### .eslintignore の作成

```sh
touch .eslintignore
```

下記を設定

```
node_modules/**/*
dist
coverage
test-report
```

#### npm script の作成

lint 対象のサンプルプログラムの作成

```
src
└── index.ts
```

サンプルコード (index.ts)

```ts
function hello(name: string): string {
  return `Hello, ${name}!`;
}
console.log(hello("TypeScript"));
```

複数の npm-scripts を実行するために、npm-run-all ライブラリを導入

```sh
npm i -D npm-run-all
```

lint 実行するための npm script を追加

```diff
{
  ...
  "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "check-types": "tsc --noEmit",
+    "eslint": "eslint '*/**/*.{js,ts}' --quiet",
+    "lint": "run-s eslint check-types"
  },
  ...
}
```

### 5. Prettier の設定

#### formatter を利用するために、 Prettier の導入

[prettier](https://github.com/prettier/prettier) の [Install - Prettier](https://prettier.io/docs/en/install.html) を参考にする

```sh
npm i -D --save-exact prettier
```

#### Prettier の設定ファイル作成

デフォルトの設定を利用するため、設定ファイルのみ作成

```sh
touch .prettierrc.yml
```

Prettier の対象外ファイルの作成

```sh
touch .prettierignore
```

.prettierignore に下記を設定

```
# Ignore artifacts:
/dist
node_modules
package.json
package-lock.json
tsconfig.json
```

#### eslint-config-prettier の導入

[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) の [Installation](https://github.com/prettier/eslint-config-prettier#installation) を参考にする

eslint-config-prettier のインストール

```sh
npm i -D --save-exact eslint-config-prettier
```

ESLint と Prettier が競合するため、ESLint 側のフォーマットルールを OFF にする設定の追加

```diff
root: true
env:
  es2020: true
  node: true
parser: "@typescript-eslint/parser"
parserOptions:
  sourceType: "module"
  ecmaVersion: 2020,
plugins:
  - "@typescript-eslint"
extends:
  - "eslint:recommended"
  - "plugin:@typescript-eslint/recommended"
+ - "prettier"
```

#### format 用の npm script を追加

```diff
{
  ...
  "scripts": {
+   "format": "prettier --write .",
    "check-types": "tsc --noEmit",
    "eslint": "eslint '*/**/*.{js,ts}' --quiet",
    "lint": "run-s eslint check-types",
+   "lint:fix": "run-s format lint",
    "test:unit": "jest"
  },
  ...
}
```

### 6. Jest の設定

#### Jest の導入

[TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io) の [Jest](https://typescript-jp.gitbook.io/deep-dive/intro-1/jest) を参考にする

```sh
npm i -D jest @types/jest ts-jest
```

#### Jest の設定ファイル追加

```sh
touch jest.config.js
```

下記を設定

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov", "text", "text-summary"],
};
```

#### vscode でサブディレクトリ配下の test ファイルで、名前解決できないため、tsconfig の設定を変更

- エラー事象
  - VSCode 上で、下記エラーが発生するケースがあった
    > Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i @types/jest` or `npm i @types/mocha`.ts(2582)
- 解決策
  - テスト用とビルド用の設定ファイルを分割した
    - `tsconfig.json` <- テストで読み込む設定ファイル
      ```diff
      {
        "compilerOptions": {
          ...
        },
        "include": [
          "src/**/*.ts",
      +   "__tests__/**/*",
        ],
        "exclude": [
          "dist/**/*",
          "node_modules/**/*",
        ]
      }
      ```
    - `tsconfig.build.json` <- ビルドで読み込む設定ファイル
      ```diff
      + {
      +   "extends": "./tsconfig.json",
      +   "exclude": [
      +     "dist/**/*",
      +     "node_modules/**/*",
      +     "__tests__/**/*", /* testファイルはビルド対象から除外する */
      +   ]
      + }
      ```
- 参考記事
  - [vscode でワークスペースを root で開いた際、サブディレクトリの jest モジュールが読み込まれない問題の解決方法](https://zenn.dev/nananaoto/articles/f96faba43c59255db91f)
  - [How to exclude specific files in typescript only for the build?](https://stackoverflow.com/questions/58461649/how-to-exclude-specific-files-in-typescript-only-for-the-build/58461810#58461810)

#### jest 実行用の npm script の追加

```diff
{
  ...
  "scripts": {
    "format": "prettier --write .",
    "check-types": "tsc --noEmit",
    "eslint": "eslint '*/**/*.{js,ts}' --quiet",
    "lint": "run-s eslint check-types",
-   "lint:fix": "run-s format lint"
+   "lint:fix": "run-s format lint",
+   "test:unit": "jest"
  },
  ...
}
```

#### jest 実行

`jest.config.js` で設定した coverage も含めて実行されていることを確認

```sh
$ npm run test:unit

> ts-jest-eslint-prettier-boilerplate@1.0.0 test:unit
> jest

 PASS  __tests__/sample.test.ts
  ✓ 正常系 (1 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |       0 |      100 |       0 |       0 |
 index.ts |       0 |      100 |       0 |       0 | 2-4
----------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 0% ( 0/2 )
Branches     : 100% ( 0/0 )
Functions    : 0% ( 0/1 )
Lines        : 0% ( 0/2 )
================================================================================
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.035 s
Ran all test suites.
```

#### テストレポートを確認するために、jest-html-reporters を導入

```sh
npm i -D jest-html-reporters
```

`jest.config.js` の修正

```diff
module.exports = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov", "text", "text-summary"],
+ reporters: [
+   "default",
+   [
+     "jest-html-reporters",
+     {
+       publicPath: "./test-report",
+       outputPath: "./test-report",
+       filename: "report.html",
+       pageTitle: "Test Report",
+     },
+   ],
+ ],
};
```

#### ESLint の Jest 用の設定を追加

[eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest) の [Installation](https://github.com/jest-community/eslint-plugin-jest#installation) と [Usage](https://github.com/jest-community/eslint-plugin-jest#usage) を参考にする

パッケージインストール

```sh
npm i -D eslint-plugin-jest
```

`.eslintrc.yml` の修正

```diff
root: true
env:
  es2020: true
  node: true
+ jest/globals: true
parser: "@typescript-eslint/parser"
parserOptions:
  sourceType: "module"
  ecmaVersion: 2020,
plugins:
+ - jest
  - "@typescript-eslint"
extends:
  - "eslint:recommended"
  - "plugin:@typescript-eslint/recommended"
+ - "plugin:jest/recommended"
  - "prettier"
```

### 7. Husky & lint-staged の導入

#### commit 時に自動で ESLint と Prettier を実行するために、 Husky と lint-staged を導入

[lint-staged](https://github.com/okonet/lint-staged) の [Installation and setup](https://github.com/okonet/lint-staged#installation-and-setup) と [husky](https://github.com/typicode/husky) の [Usage](https://github.com/typicode/husky#usage) を参考にする

```sh
npx mrm@2 lint-staged
```

#### lint-staged の設定修正

js もしくは ts がコミットされたら、lint と format を実行するように修正した

```diff
{
  ...
  "scripts": {
    "format": "prettier --write .",
    "check-types": "tsc --noEmit",
    "eslint": "eslint '*/**/*.{js,ts}' --quiet",
    "lint": "run-s eslint check-types",
    "lint:fix": "run-s lint format",
    "test:unit": "jest",
+   "lint-staged": "lint-staged"
  },
  ...
+ "lint-staged": {
+   "*/**/*.{js,ts}": [
+     "npm run check-types",
+     "npm run eslint",
+     "npm run format"
+   ]
+ }
}
```

#### push 前に自動でテストを実行させるように、Husky を修正

```sh
.husky
├── _
│   └── husky.sh
├── pre-commit
└── pre-push # 追加
```

pre-push の設定を追加

```diff
+ #!/bin/sh
+ . "$(dirname "$0")/_/husky.sh"
+
+ npm run test:unit
```

## 参考資料

- [TypeScript + Node.js プロジェクトのはじめかた 2020](https://qiita.com/notakaos/items/3bbd2293e2ff286d9f49#tsconfigjson-%E7%94%9F%E6%88%90)
- [TypeScript + Node.js プロジェクトに ESLint + Prettier を導入する手順 2020](https://qiita.com/notakaos/items/85fd2f5c549f247585b1)
- [決定版！イマドキの ESLint 設定！](https://dev.classmethod.jp/articles/eslint-configurations-2020/)
