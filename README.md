<div align="center">

[![29k](https://user-images.githubusercontent.com/474066/174894987-58605dd7-86b8-4455-9c86-f17346f4e213.png)](https://29k.org)

</div>

<p align="center">
  <strong>Your Mental Health App and Supportive Community</strong></br>
  Access free exercises, short or extended courses, daily prompts, meditations and connection with peers via chat, audio & video.
</p>

<p align="center">
  This is the 2.0 open-source version based on the learnings from the currently live <a href="https://app.29k.org/download">29k: Mental Health App</a>.
</p>

<p align="center">
  <a href="https://github.com/29ki/29k/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/github/license/29ki/29k" alt="29k is released under the Creative Commons Zero v1.0 Universal." />
  </a>
  <img src="https://github.com/29ki/29k/actions/workflows/test.yml/badge.svg" alt="Current build status." />
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="Make a Pull Request"></a>
  <a href="code_of_conduct.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Contributor Covenant"></a>
</p>

# Download Android/iOS app

Latest builds can be downloaded through iOS TestFlight and Android PlayStore:

- 🍎 [29k: Cupcake for iOS](https://testflight.apple.com/join/0VdruQ6z) - get access through TestFlight
- 🤖 [29k: Cupcake for Android](https://groups.google.com/u/1/a/29k.org/g/android-beta-test) - get access by becoming member of this google group

# Installation

```
yarn
```

## Functions

```
cd functions
yarn
```

## Client

Instructions on how to setup a React Native development environment can be found here: https://reactnative.dev/docs/environment-setup.

Make sure to follow the instructions for React Native CLI.

```
cd client
yarn
```

### Environment

Before being able to start the client, some configs are required.
Create a `.env` file, by duplicating `.env.example`.

| Key                                                               | Description                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENVIRONMENT`                                                     | Client environment, e.g. `dev`, `staging` or `production`                                                                                                                                                                                                                             |
| `SENTRY_DSN`                                                      | _Not needed for local development_. [Sentry DSN string](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)                                                                                                                                                                  |
| `IOS_CODE_PUSH_DEPLOYMENT_KEY` `ANDROID_CODE_PUSH_DEPLOYMENT_KEY` | _Not needed for local development_. Follow the instructions at [app center](https://docs.microsoft.com/en-us/appcenter/sdk/getting-started/react-native#2-create-your-app-in-the-app-center-portal-to-obtain-the-app-secret) for setting up a project and getting the deployment key. |
| `KILL_SWITCH_ENDPOINT`                                            | Kill Switch functions end point. e.g. `http://localhost:5001/demo-29k-cupcake/europe-west1/killswitch`                                                                                                                                                                                |
| `CALL_ENDPOINT`                                                   | Call functions end point. e.g. `http://localhost:5001/demo-29k-cupcake/europe-west1/call`                                                                                                                                                                                             |

### Sentry

Create a `client/sentry.properties` from the [Sentry example template](https://github.com/getsentry/examples/blob/master/react-native/sentry.properties). You may use the empty values for local development.

### iOS

```
cd client/ios
pod install
```

# Local development

## Functions

```
cd functions
yarn build:watch
yarn start
```

## Client

### iOS

```
cd client
yarn ios
```

### Android

```
cd client
yarn android
```

### Metro bundler

```
cd client
yarn start
```

## Content

Content needs to be re-built when it's changed.

```
cd content
yarn build:watch
```

# Testing

## Client

```
cd client
yarn test
```

## Functions

```
cd functions
yarn test
```

# Build & Deploy

## Functions

Functions are deployed through workflows triggered on main branch. See [`.github/workflows/deploy-functions.yml`](https://github.com/29ki/29k/blob/main/.github/workflows/deploy-functions.yml) for details

## Client

### CodePush

Over-the-air CodePush bundles are deployed through workflows triggered on main branch. See [`.github/workflows/deploy-codepush.yml`](https://github.com/29ki/29k/blob/main/.github/workflows/deploy-codepush.yml) for details

### Apps

Native builds are currently built and uploaded locally with Fastlane. This would preferrably be moved to GitHub workflows.

#### Prerequisites

```
xcode-select --install
gem install bundle
cd client/fastlane
bundle install
```

#### iOS

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

4. Build and deploy with Fastlane

Issues with Daily/WebRTC native libs requires the app to be built with rosetta (`arch -x86_64`) on Apple Silicon.

```
cd client/fastlane
<environment variables> arch -x86_64 fastlane ios app
```

#### Android

1. Environment variables needed for the client bundle (see [`client/.env.example`](https://github.com/29ki/29k/blob/main/client/.env.example) or [Environment docs](https://github.com/29ki/29k#environment))
2. Environment variables needed to build and deploy.

| Key                                | Description                                                                                                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANDROID_GOOGLE_PLAY_SERVICE_FILE` | Path to your Google PlayStore credentials. [Fastlane docs](https://docs.fastlane.tools/getting-started/android/setup/#collect-your-google-credentials) on how to create one) |
| `ANDROID_PACKAGE_NAME`             | e.g `org.twentyninek.app.cupcake`, `org.twentyninek.app.cupcake.staging` or `org.twentyninek.app.cupcake.dev`                                                                |
| `ANDROID_FLAVOR`                   | `dev`, `staging` or `production`                                                                                                                                             |

3. Build and deploy with Fastlane

```
cd client/fastlane
<environment variables> fastlane android app
```

## Translations
