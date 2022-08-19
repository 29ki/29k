# Installation

Instructions on how to setup a React Native development environment can be found here: https://reactnative.dev/docs/environment-setup.

Make sure to follow the instructions for React Native CLI.

```
yarn
```

## Environment

Before being able to start the client, some configs are required.
Create a `.env` file, by duplicating `.env.example`.

| Key                                                               | Description                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENVIRONMENT`                                                     | Client environment, e.g. `dev`, `staging` or `production`                                                                                                                                                                                                                             |
| `SENTRY_DSN`                                                      | _Not needed for local development_. [Sentry DSN string](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)                                                                                                                                                                  |
| `IOS_CODE_PUSH_DEPLOYMENT_KEY` `ANDROID_CODE_PUSH_DEPLOYMENT_KEY` | _Not needed for local development_. Follow the instructions at [app center](https://docs.microsoft.com/en-us/appcenter/sdk/getting-started/react-native#2-create-your-app-in-the-app-center-portal-to-obtain-the-app-secret) for setting up a project and getting the deployment key. |
| `API_ENDPOINT`                                                    | API end points. e.g. `http://localhost:5001/demo-29k-cupcake/europe-west1/api`                                                                                                                                                                                                        |

## Sentry

Create a `client/sentry.properties` from the [Sentry example template](https://github.com/getsentry/examples/blob/master/react-native/sentry.properties). You may use the empty values for local development.

## iOS

```
cd client/ios
pod install
```

# Local development

## iOS

```
cd client
yarn ios
```

## Android

```
cd client
yarn android
```

## Metro bundler

```
cd client
yarn start
```

# Testing

```
yarn test
```

# Build & Deploy

## CodePush

Over-the-air CodePush bundles are deployed through workflows triggered on main branch. See [`.github/workflows/deploy-codepush.yml`](https://github.com/29ki/29k/blob/main/.github/workflows/deploy-codepush.yml) for details

## Apps

Native builds are currently built and uploaded locally with Fastlane. This would preferrably be moved to GitHub workflows.

### Prerequisites

```
xcode-select --install
gem install bundle
cd client/fastlane
bundle install
```

### iOS

1. Environment variables needed for the client bundle (see [`client/.env.example`](https://github.com/29ki/29k/blob/main/client/.env.example) or [Environment docs](https://github.com/29ki/29k#environment))
2. Environment variables needed to build and deploy.

| Key                            | Description                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `IOS_APPLE_ID`                 | AppStore Connect Apple ID - e.g. `john.appleseed@apple.com`                                                   |
| `IOS_APP_STORE_TEAM_ID`        | AppStore Connect Team ID - e.g. `18742801`                                                                    |
| `IOS_DEVELOPER_PORTAL_TEAM_ID` | Developer Portal Team ID - e.g. `Q2CBPJ58CA`                                                                  |
| `IOS_BUNDLE_IDENTIFIER`        | e.g `org.twentyninek.app.cupcake`, `org.twentyninek.app.cupcake.staging` or `org.twentyninek.app.cupcake.dev` |
| `IOS_SCHEME`                   | `dev`, `staging` or `production`                                                                              |

3. Download iOS bitcode

```
cd client
./node_modules/@daily-co/react-native-webrtc/tools/downloadBitcode.sh
```

4. Source GIT_COMMIT_SHORT env variable

```
cd client
source ./scripts/getGitCommitShort.sh
```

5. Build and deploy with Fastlane

Issues with Daily/WebRTC native libs requires the app to be built with rosetta (`arch -x86_64`) on Apple Silicon.

```
cd client/fastlane
<environment variables> arch -x86_64 bundle exec fastlane ios app
```

### Android

1. Environment variables needed for the client bundle (see [`client/.env.example`](https://github.com/29ki/29k/blob/main/client/.env.example) or [Environment docs](https://github.com/29ki/29k#environment))
2. Environment variables needed to build and deploy.

| Key                                | Description                                                                                                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANDROID_GOOGLE_PLAY_SERVICE_FILE` | Path to your Google PlayStore credentials. [Fastlane docs](https://docs.fastlane.tools/getting-started/android/setup/#collect-your-google-credentials) on how to create one) |
| `ANDROID_PACKAGE_NAME`             | e.g `org.twentyninek.app.cupcake`, `org.twentyninek.app.cupcake.staging` or `org.twentyninek.app.cupcake.dev`                                                                |
| `ANDROID_FLAVOR`                   | `dev`, `staging` or `production`                                                                                                                                             |

3. Source GIT_COMMIT_SHORT env variable

```
cd client
source ./scripts/getGitCommitShort.sh
```

4. Build and deploy with Fastlane

```
cd client/fastlane
<environment variables> bundle exec fastlane android app
```

# Translations

# Styleguide