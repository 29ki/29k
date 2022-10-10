# Before build

- [ ] Bump Android `versionName` and iOS `MARKETING_VERSION` / `CFBundleShortVersionString`
- [ ] Merge master into this branch

# Build

- [ ] Build and publish Android Staging app
- [ ] Build and publish iOS Staging app
- [ ] Build and publish Android Production app
- [ ] Build and publish iOS Production app

# After build

- [ ] Commit Android `versionCode` and iOS `CURRENT_PROJECT_VERSION` / `CFBundleVersion`
- Android check list
  1. [ ] Sign-up (email, google and apple)
  2. [ ] Sign-out
  3. [ ] Sign-in (email, google and apple)
  4. [ ] Change profile picture
  5. [ ] Start and complete an exercise
  6. [ ] Start and complete a test
  7. [ ] Start course
  8. [ ] Join sharing group
  9. [ ] Share deep link & open it
  10. [ ] Send chat messages (between devices)
  11. [ ] Chat push notifications
  12. [ ] Join video sharing (between devices)
  13. [ ] Leave sharing group
  14. [ ] Delete user
- iOS check list (iOS 10 and iOS 13)
  1. [ ] Sign-up (email, google and apple)
  2. [ ] Sign-out
  3. [ ] Sign-in (email, google and apple)
  4. [ ] Change profile picture
  5. [ ] Start and complete an exercise
  6. [ ] Start and complete a test
  7. [ ] Start course
  8. [ ] Join sharing group
  9. [ ] Share deep link & open it
  10. [ ] Send chat messages (between devices)
  11. [ ] Chat push notifications
  12. [ ] Join video sharing (between devices)
  13. [ ] Leave sharing group
  14. [ ] Delete user
- [ ] 1. Send to review
  - [ ] Add `29k internal` testgroup to build in iOS TestFlight (**Production and Staging**)
  - [ ] Submit iOS app for review (**Production**)
  - [ ] Promote Android app to Closed Alpha testing (**Production and Staging**)
  - [ ] Promote Android app to Production - make sure it's a 100% rollout (**Production**)
- [ ] 2. ✋ Wait for review approvals until proceeding (**iOS and Android**)
- [ ] 3. Release apps
  - [ ] Notify testers in iOS TestFlight (**Production and Staging**)
  - [ ] Release app on iOS AppStore (**Production**)
  - [ ] Review and and release Android app (**Production and Staging**)
- [ ] 4. Merge this branch to master
