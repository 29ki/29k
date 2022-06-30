<div align="center">

[![29k](https://user-images.githubusercontent.com/474066/174894987-58605dd7-86b8-4455-9c86-f17346f4e213.png)](https://29k.org)

</div>

<p align="center">
  <strong>Your Mental Health App and Supportive Community</strong></br>
  Access free exercises, short or extended courses, daily prompts, meditations and connection with peers via chat, audio & video.
</p>

<p align="center">
  <a href="https://github.com/29ki/29k/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/github/license/29ki/29k" alt="29k is released under the Creative Commons Zero v1.0 Universal." />
  </a>
  <img src="https://github.com/29ki/29k/actions/workflows/test.yml/badge.svg" alt="Current build status." />
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="Make a Pull Request"></a>
</p>

# Download Android/iOS app

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

Instructions on how to setup a React Native development environment can be found here: https://reactnative.dev/docs/environment-setup

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
| `IOS_CODE_PUSH_DEPLOYMENT_KEY` `ANDROID_CODE_PUSH_DEPLOYMENT_KEY` | _Not needed for local development_. Follow the instructions at [app center](https://docs.microsoft.com/en-us/appcenter/sdk/getting-started/react-native#2-create-your-app-in-the-app-center-portal-to-obtain-the-app-secret) for setting up a project and getting the deployment key. |

### iOS

```
cd client/ios
pod install
```

# Local development

## Functions

```
cd functions
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

## Testing

## Translations
