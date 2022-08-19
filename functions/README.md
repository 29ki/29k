# Installation

```
yarn
```

## Environment

Before being able to start the client, some configs are required.
Create a `.env` file, by duplicating `.env.example`.

| Key                                                               | Description                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DAILY_API_KEY`                                                   | E.g. `<your-daily-api-key>`                                                                                                                                                                                                                         |
| `DAILY_API_URL`                                                   | [https://api.daily.co](https://api.daily.co)                                                                                                                                                                  |
| `DAILY_API_VERSION`                                               | API version e.g. `v1`                                                                                                                         

# Local development

```
yarn build:watch
yarn start
```

# Testing

```
yarn test
```

# Build & Deploy

Functions are deployed through workflows triggered on main branch. See [`.github/workflows/deploy-functions.yml`](https://github.com/29ki/29k/blob/main/.github/workflows/deploy-functions.yml) for details

# Translations

# Styleguide