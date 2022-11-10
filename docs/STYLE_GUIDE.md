# Style guide

- [Hooks](#Hooks)
- [Firestore Client](#Firstore-Client)
- [Rest API](#Rest-Api)

## Hooks

### Info

As a general rule of thumb separate "getter" hooks from "setter" hooks. E.g. use one hook to set the state and another to fetch that state.

### Example

Setting the state from the `useCheckForUpdates` hook

https://github.com/29ki/29k/blob/5dc9ce42034b0ea72e3294772ca5cfc26ecbc8ce/client/src/lib/codePush/hooks/useCheckForUpdate.ts#L50-L62

Getting the state by using the zustand state `useCodePushState(state => state.status)`

https://github.com/29ki/29k/blob/952b16cfb68f5cd9fb4a145d8e9d66c8cc3e8153/client/src/lib/codePush/components/CodePushOverlay.tsx#L50-L58

## Firstore Client

### Info

We use react-native-firbease/firestore in our project, as a general rule though, we decided to only use it in cases where we need live-updates.

You can read more about [how firestore snapshots work](https://rnfirebase.io/firestore/usage#realtime-changes), that's what we use for live data UX.

For the rest of database query operations we use our [REST API](#rest-api), which can aggregate and take further responsibility for how we provide data to our client.

### Example

A decent example of such usage can be found on our `useTemple` react hook.

https://github.com/29ki/29k/blob/237ee21db3cd91990b26ebd0c5da0bb41760fb92/client/src/routes/Temple/hooks/useTemple.ts#L7-L31

## Rest API

### Info

A wrapping API layer enabling a centralized way of accessing and modifying data.
As most REST API we use the method from the request to indicate which operation to perform:

```
GET    /fruit         // Provides all the fruits Fruit[]
GET    /fruit/:id     // Provides a fruit based on the ID used Fruit
POST   /fruit         // Creates a new fruit
PUT    /fruit/:id     // Updates an exisitng fruit
DELETE /fruit/:id     // Deletes an exisitng fruit
```

### Example

An example is the Temple endpoint.

https://github.com/29ki/29k/blob/237ee21db3cd91990b26ebd0c5da0bb41760fb92/functions/src/api/temples/index.ts
