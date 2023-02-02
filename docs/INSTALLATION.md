# Installation

```
yarn
```

## Functions

```
cd functions
yarn
```

### Environment

Before being able to start the functions emulator, some configs are required.
Create a `.env` file, by duplicating `.env.example`.

| Key                                  | Description                                                                                                                                                                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GIT_COMMIT_SHORT`                   | _May be left blank for local development_. Current GIT Commit hash                                                                                                                                                                                   |
| `ENVIRONMENT`                        | Functions environment, e.g. `dev`, `staging` or `production`                                                                                                                                                                                         |
| `SENTRY_DSN`                         | _Not needed for local development_. [Sentry DSN string](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)                                                                                                                                 |
| `DAILY_API_KEY`                      | [Daily](https://www.daily.co/) API key                                                                                                                                                                                                               |
| `DAILY_DOMAIN_ID`                    | [Daily](https://www.daily.co/) Domain id (ask another developer for it)                                                                                                                                                                              |
| `DEEP_LINK_API_KEY`                  | [Firebase Dynamic Links API key](https://firebase.google.com/docs/dynamic-links/rest#before_you_begin)                                                                                                                                               |
| `DEEP_LINK_DOMAIN_URI_PREFIX`        | Dynamic links domain, e.g. `dev.app.cupcake.29k.org`. [Dynamic links parameters](https://firebase.google.com/docs/reference/dynamic-links/link-shortener#parameters)                                                                                 |
| `DEEP_LINK_BASE_URL`                 | Base URL of the deep links, e.g. `https://29k.org`.                                                                                                                                                                                                  |
| `DEEP_LINK_ANDROID_PACKAGE_NAME`     | Android package name, e.g. `org.twentyninek.app.cupcake.dev`. [Dynamic links parameters](https://firebase.google.com/docs/reference/dynamic-links/link-shortener#parameters)                                                                         |
| `DEEP_LINK_ANDROID_FALLBACK_LINK`    | Android link to open when the app isn't installed., e.g. `https://play.google.com/store/apps/details?id=org.twentyninek.app.cupcake`. [Dynamic links parameters](https://firebase.google.com/docs/reference/dynamic-links/link-shortener#parameters) |
| `DEEP_LINK_IOS_BUNDLE_ID`            | iOS bundle ID, e.g. `org.twentyninek.app.cupcake.dev`. [Dynamic links parameters](https://firebase.google.com/docs/reference/dynamic-links/link-shortener#parameters)                                                                                |
| `DEEP_LINK_IOS_APPSTORE_ID`          | iOS AppStore ID, e.g. `1631342681`. [Dynamic links parameters](https://firebase.google.com/docs/reference/dynamic-links/link-shortener#parameters)                                                                                                   |
| `DEEP_LINK_IOS_FALLBACK_LINK`        | iOS link to open when the app isn't installed., e.g. `https://testflight.apple.com/join/0VdruQ6z`. [Dynamic links parameters](https://firebase.google.com/docs/reference/dynamic-links/link-shortener#parameters)                                    |
| `SLACK_BOT_NAME`                     | _Not needed for local development_ Slack Bot to post messegas as, e.g. `Cupcake Bot (prod)`                                                                                                                                                          |
| `SLACK_PUBLIC_HOST_REQUESTS_CHANNEL` | _Not needed for local development_ Slack channel to post messages to, e.g. `public-host-requests`.                                                                                                                                                   |
| `SLACK_FEEDBACK_CHANNEL`             | _Not needed for local development_ Slack channel to post messages to, e.g. `feedback`.                                                                                                                                                               |
| `SLACK_OAUTH_TOKEN`                  | _Not needed for local development_ Slack OAuth token. To be able to send messages to slack e.g. `xoxb-XXX...`. [Slack workspace tokens](https://api.slack.com/authentication/token-types#workspace)                                                  |
| `SLACK_SIGNING_SECRET`               | _Not needed for local development_ Slack Signing Secret. To verify requests are coming from our slack e.g. `5326f8...`. [Slack signing secrets](https://api.slack.com/authentication/verifying-requests-from-slack)                                  |

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
| `POSTHOG_API_KEY`                                                 | _Not needed for local development_. [PostHog Project API key](https://posthog.com/)                                                                                                                                                                                                   |
| `IOS_CODE_PUSH_DEPLOYMENT_KEY` `ANDROID_CODE_PUSH_DEPLOYMENT_KEY` | _Not needed for local development_. Follow the instructions at [app center](https://docs.microsoft.com/en-us/appcenter/sdk/getting-started/react-native#2-create-your-app-in-the-app-center-portal-to-obtain-the-app-secret) for setting up a project and getting the deployment key. |
| `API_ENDPOINT`                                                    | API end point. e.g. `http://localhost:5001/demo-29k-cupcake/europe-west1/api`                                                                                                                                                                                                         |
| `METRICS_ENDPOINT`                                                | _Not needed for local development_. Metrics end point. e.g. `http://localhost:5001/demo-29k-cupcake/europe-west1/metrics`                                                                                                                                                             |
| `STORAGE_ENDPOINT`                                                | Cloud Storage end point. e.g. `http://localhost:9199`                                                                                                                                                                                                                                 |
| `DEEP_LINK_SCHEMA`                                                | _Not needed for local development_. Deep link app schema, e.g `org.twentyninek.app.cupcake.dev://`                                                                                                                                                                                    |
| `DEEP_LINK_PREFIX`                                                | _Not needed for local development_. Deep link app prefix, e.g `https://29k.org/`                                                                                                                                                                                                      |

### Sentry

Create a `client/sentry.properties` from the [Sentry example template](https://github.com/getsentry/examples/blob/master/react-native/sentry.properties). You may use the empty values for local development.

### iOS

Add a `client/ios/Supporting/dev/GoogleService-Info.plist` for local development. You have two options:

- By copying `client/ios/Supporting/dev/GoogleService-Info.plist.local` ➡️ `GoogleService-Info.plist`. _This will only work with local firebase emulator._
- By [downloading it from Firebase](https://firebase.google.com/docs/ios/setup)

Then install pod dependencies

```
cd client/ios
pod install
```

### Android

Add a `client/android/app/src/dev/google-services.json` for local development. You have two options:

- By copying `client/android/app/src/dev/google-services.json.local` ➡️ `google-services.json`. _This will only work with local firebase emulator._
- By [downloading it from Firebase](https://firebase.google.com/docs/android/setup)
