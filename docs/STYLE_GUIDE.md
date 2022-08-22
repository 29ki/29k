# Style guide

* [Hooks](#Hooks)
    * Info
    * Example
* [Firestore Client](#Firstore-Client)
    * Info
    * Example
* [Rest API](#Rest-Api)
    * Info
    * Example

## Hooks

### Info
### Example

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

One API endpoint with functions

### Example