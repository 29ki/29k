# This is a pretty naive folder git diff test.
# It does not take what changes have been made or the actual version into account.

echo "🔍 Checking for iOS / Android native changes"

git --no-pager diff origin/main -- ios

git diff --quiet origin/main -- ios
if [ $? -ne 0 ]; then
    echo "📱 iOS native changes found! (could be that you're not on par with main)"

    IOS_VERSION_CHANGES=$(git --no-pager diff --unified=0 --word-diff=color origin/main HEAD -- ios/twentyninek.xcodeproj/project.pbxproj)
    IOS_MARKETING_VERSION_CHANGES=$(echo "${IOS_VERSION_CHANGES}" | grep MARKETING_VERSION | wc -l)
    IOS_BUILD_VERSION_CHANGES=$(echo "${IOS_VERSION_CHANGES}" | grep CURRENT_PROJECT_VERSION | wc -l)

    # Check for 6 changes (Relase + Debug x 3 targets)
    if [ $IOS_MARKETING_VERSION_CHANGES -ne 6 ]; then
      echo "⚠️ iOS marketing version needs to be bumped!"
      exit 1
    else
      echo "✅ iOS marketing version has changed!"
    fi

    # Check for 6 changes (Relase + Debug x 3 targets)
    if [ $IOS_BUILD_VERSION_CHANGES -ne "6" ]; then
      echo "⚠️ iOS current project version needs to be bumped!"
      exit 1
    else
      echo "✅ iOS current project version has changed!"
    fi
else
    echo "✅ No iOS native changes found"
fi

# Check for Android OR Podfile.lock changes (since it hints about new native libraries)
git diff --quiet origin/main -- android ios/Podfile.lock
if [ $? -ne 0 ]; then
    echo "📱 Android native changes found! (could be that you're not on par with main)"

    ANDROID_VERSION_CHANGES=$(git --no-pager diff --unified=0 --word-diff=color origin/main HEAD -- android/app/build.gradle)
    ANDROID_VERSION_NAME_CHANGES=$(echo "${ANDROID_VERSION_CHANGES}" | grep versionName | wc -l)
    ANDROID_VERSION_CODE_CHANGES=$(echo "${ANDROID_VERSION_CHANGES}" | grep versionCode | wc -l)

    if [ $ANDROID_VERSION_NAME_CHANGES -ge 1 ]; then
      echo "✅ Android versionName has changed!"
    else
      echo "⚠️ Android versionName needs to be bumped!"
      exit 1
    fi

    if [ $ANDROID_VERSION_CODE_CHANGES -ge 1 ]; then
      echo "✅ Android versionCode has changed!"
    else
      echo "⚠️ Android versionCode needs to be bumped!"
      exit 1

    fi
else
    echo "✅ No Android native changes found"
fi

exit 0
