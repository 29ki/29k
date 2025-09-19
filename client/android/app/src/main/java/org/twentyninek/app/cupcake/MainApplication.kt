package org.twentyninek.app.cupcake;

import android.app.Application

import co.ab180.airbridge.reactnative.AirbridgeReactNative
import com.microsoft.codepush.react.CodePush;
import org.twentyninek.app.cupcake.newarchitecture.videoLooper.ReactVideoLooperPackage;

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

import com.facebook.react.modules.i18nmanager.I18nUtil;

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              add(ReactVideoLooperPackage());
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getJSBundleFile(): String = CodePush.getJSBundleFile()

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    val name = BuildConfig.AIRBRIDGE_APP_NAME
    val token = BuildConfig.AIRBRIDGE_SDK_TOKEN
    AirbridgeReactNative.initializeSDK(this, "awaredev", "4bfe3019388e492eb954f14da462c32d")
    // Do not support right-to-left layouting
    val sharedI18nUtilInstance = I18nUtil.getInstance()
    sharedI18nUtilInstance.allowRTL(applicationContext, false)
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}
