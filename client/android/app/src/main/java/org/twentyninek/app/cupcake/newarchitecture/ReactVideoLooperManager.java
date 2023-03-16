package org.twentyninek.app.cupcake.newarchitecture;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.io.IOException;

public class ReactVideoLooperManager extends SimpleViewManager<ReactVideoLooperView> {
  public static final String REACT_CLASS = "VideoLooper";
  ReactApplicationContext mCallerContext;

  public ReactVideoLooperManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

  @Override
  public String getName() { return REACT_CLASS; }

  @Override
  public ReactVideoLooperView createViewInstance(ThemedReactContext context) {
    ReactVideoLooperView view = new ReactVideoLooperView(context);
    return view;
  }

  @ReactProp(name = "sources")
  public void setSources(ReactVideoLooperView view, ReadableMap sources) throws IOException {
    view.setSources(sources);
  }

  @ReactProp(name = "repeat")
  public void setRepeat(ReactVideoLooperView view, boolean repeat) {
    view.setRepeat(repeat);
  }
}
