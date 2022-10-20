# Local development

## Functions

```
cd functions
yarn build:watch
```

Then eiter start Firebase Emulator fully local:

```
yarn start
```

...or against an existing remote Firebase project:

```
yarn start:remote --project <firebase-project>
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

# Firebase dynamic links

1. Make your client setup has [`google-services.json`](../INSTALLATION.md#android) and [`GoogleService-Info.plist`](../INSTALLATION.md#ios) config files pointing to a real Firebase project.
2. Make sure `DEEP_LINK_` variables are properly setup for both [`client/.env`](../INSTALLATION.md#environment) and [`functions/.env`](../INSTALLATION.md#environment-1)
3. Start functions with a real firebase project:
   ```
   yarn start:remote --project <firebase-project>
   ```
4. Open links in iOS and Android simulators from the terminal:
   ```
   npx uri-scheme open "https://testing.app.cupcake.29k.org/jksd23kjh2kjhk" --ios --android
   ```
