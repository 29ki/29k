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

4. Source GIT_COMMIT_SHORT env variable

```
cd client
source ../shared/scripts/getGitCommitShort.sh
```

5. Build and deploy with Fastlane

Issues with Daily/WebRTC native libs requires the app to be built with rosetta (`arch -x86_64`) on Apple Silicon.

```
cd client/fastlane
<environment variables> arch -x86_64 bundle exec fastlane ios app
```

#### Android

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
source ../shared/scripts/getGitCommitShort.sh
```

4. Build and deploy with Fastlane

```
cd client/fastlane
<environment variables> bundle exec fastlane android app
```
