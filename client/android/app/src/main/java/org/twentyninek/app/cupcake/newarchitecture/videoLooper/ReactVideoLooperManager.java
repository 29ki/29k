package org.twentyninek.app.cupcake.newarchitecture.videoLooper;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.io.IOException;
import java.util.Map;

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

  @Override
  public @Nullable Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    for (ReactEvents event : ReactEvents.values()) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()));
    }
    return builder.build();
  }

  @ReactProp(name = "sources")
  public void setSources(ReactVideoLooperView view, ReadableArray sources) throws IOException {
    view.setSources(sources);
  }

  @ReactProp(name = "seek")
  public void setSeek(ReactVideoLooperView view, double to) throws IOException {
    view.setSeek(to);
  }

  @ReactProp(name = "repeat")
  public void setRepeat(ReactVideoLooperView view, boolean repeat) {
    view.setRepeat(repeat);
  }

  @ReactProp(name = "paused")
  public void setPaused(ReactVideoLooperView view, boolean paused) {
    view.setPaused(paused);
  }
  
  @ReactProp(name = "muted")
  public void setMuted(ReactVideoLooperView view, boolean muted) {
    view.setMuted(muted);
  }

  @ReactProp(name = "volume")
  public void setVolume(ReactVideoLooperView view, double volume) {
    view.setVolume(volume);
  }

  @ReactProp(name = "audioOnly")
  public void setAudioOnly(ReactVideoLooperView view, boolean audioOnly) {
    view.setAudioOnly(audioOnly);
  }
}
