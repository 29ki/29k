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
