#import "AppDelegate.h"

#import "RNCConfig.h"
#import <CodePush/CodePush.h>
#import <Firebase.h>
#import <AVFoundation/AVFoundation.h>
#import <AirbridgeReactNative/AirbridgeReactNative.h>

#import <React/RCTBundleURLProvider.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];

  NSString *appName = [RNCConfig envFor:@"AIRBRIDGE_APP_NAME"];
  NSString *sdkToken = [RNCConfig envFor:@"AIRBRIDGE_SDK_TOKEN"];
  [AirbridgeReactNative initializeSDKWithName:appName token:sdkToken];

  // allowing sounds from several sources
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord
                                   withOptions:AVAudioSessionCategoryOptionMixWithOthers |
                                               AVAudioSessionCategoryOptionAllowBluetooth
                                         error:nil];

  self.moduleName = @"twentyninek";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}

// Airbridge when app is opened with scheme deeplink
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    // track deeplink
    [AirbridgeReactNative trackDeeplinkWithUrl:url];

    return YES;
}

// Airbridge when app is opened with universal links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    // track deeplink
    [AirbridgeReactNative trackDeeplinkWithUserActivity:userActivity];

    return YES;
}

@end
