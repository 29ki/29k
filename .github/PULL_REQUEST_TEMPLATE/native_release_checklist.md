# Changes in this release

- [ ] PRs...

# Before build

- [ ] Bump Android `versionName` and iOS `MARKETING_VERSION` / `CFBundleShortVersionString`
- [ ] Merge main into this branch

# Build

- [ ] Trigger [build action](https://github.com/29ki/29k/actions/workflows/build.yml)

# After build

- [ ] 1. Merge auto generated iOS version bump
- [ ] 2. Merge auto generated Android version bump
- [ ] 3. Send to review
  - [ ] Add `29k internal` testgroup to build in iOS TestFlight (**Production and Staging**)
  - [ ] Promote Android app to `Closed testing - Alpha` (**Production and Staging**)
- [ ] 4. ✋ Wait for review approvals until proceeding (**iOS and Android**)
- [ ] 5. Release apps
  - [ ] Notify testers in iOS TestFlight (**Production and Staging**)
  - [ ] Review and and release Android app (**Production and Staging**)
- [ ] 6. Merge this branch to main
