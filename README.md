<h1 align="center">
  <a href="https://29k.org/">
    29k
  </a>
</h1>

<p align="center">
  <strong>Your Mental Health App and Supportive Communitys</strong></br>
    Access free exercises, short or extended courses, daily prompts, meditations and connection with peers via chat, audio & video.
</p>

<p align="center">
  <a href="https://github.com/29ki/29k/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/github/license/29ki/29k" alt="29k is released under the Creative Commons Zero v1.0 Universal." />
  </a>
  <img src="https://github.com/29ki/29k/actions/workflows/main.yml/badge.svg" alt="Current build status." />
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="Chat on Discord"></a>
</p>

## Download Android/iOS app

## Environment setup

Instructions on how to setup a React Native development environment can be found here: https://reactnative.dev/docs/environment-setup

Make sure to follow the instructions for React Native CLI.

## Installation

### Firebase Emulator

```
yarn
```

### Client

```
cd client
yarn
```

### iOS installation

```
cd client/ios
pod install
```

## Local development

### Firebase Emulator

```
yarn start
```

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


## Code Push
Follow the instructions at [https://docs.microsoft.com/en-us/appcenter/sdk/getting-started/react-native#2-create-your-app-in-the-app-center-portal-to-obtain-the-app-secret](app center) for setting up a project. 

### iOS
Create the file `ios/Supporting/production/AppCenter-Config.plist``
and add you secret key.
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "https://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>AppSecret</key>
		<string>{APP_SECRET_VALUE}</string>
	</dict>
</plist>
```