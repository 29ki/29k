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
  <img src="https://github.com/29ki/29k/actions/workflows/main.yml/badge.svg" alt="Current build status." />
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="Make a Pull Request"></a>
</p>

# Download Android/iOS app

# Installation

## Firebase

Download [mock-google-services.json](https://github.com/firebase/quickstart-android/blob/master/mock-google-services.json) and [mock-GoogleService-Info.plist](https://github.com/firebase/quickstart-ios/blob/master/mock-GoogleService-Info.plist).

**_...OR..._**

[Setup a new firebase project](https://cloud.google.com/firestore/docs/client/get-firebase) and [register Android app](https://firebase.google.com/docs/android/setup#create-firebase-project) and [register iOS app](https://firebase.google.com/docs/ios/setup#register-app).

... and put the respective configuration files in `client/android/app/google-services.json` and `client/ios/Supporting/dev/GoogleService-Info.plist`

### Emulator

```
yarn
```

## Client

Instructions on how to setup a React Native development environment can be found here: https://reactnative.dev/docs/environment-setup

Make sure to follow the instructions for React Native CLI.

```
cd client
yarn
```

### iOS

```
cd client/ios
pod install
```

# Local development

## Firebase Emulator

```
yarn start
```

## Client

### iOS

```
cd client
yarn ios
```

#### Android

```
cd client
yarn android
```

#### Metro bundler

```
cd client
yarn start
```

## Testing

## Translations
