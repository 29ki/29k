package org.twentyninek.app.cupcake.newarchitecture.videoLooper;

import android.os.Handler;
import android.view.Gravity;
import android.view.TextureView;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.analytics.AnalyticsListener;
import com.google.android.exoplayer2.ext.okhttp.OkHttpDataSource;
import com.google.android.exoplayer2.source.DefaultMediaSourceFactory;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.video.VideoSize;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import okhttp3.OkHttpClient;
import okhttp3.Request;

enum ReactEvents {
  EVENT_ON_END("onEnd"),
  EVENT_ON_LOAD("onLoad"),
  EVENT_ON_TRANSITION("onTransition");

  private final String mName;

  ReactEvents(final String name) {
    mName = name;
  }

  @Override
  public String toString() {
    return mName;
  }
}
public class ReactVideoLooperView extends FrameLayout {
  private class Listener implements AnalyticsListener {
    @Override
    public void onVideoSizeChanged(EventTime eventTime, VideoSize videoSize) {
      AnalyticsListener.super.onVideoSizeChanged(eventTime, videoSize);
      boolean isInitialRatio = _layout.getAspectRatio() == 0;
      _layout.setAspectRatio(videoSize.height == 0 ? 1 : (videoSize.width * videoSize.pixelWidthHeightRatio) / videoSize.height);

      // React native workaround for measuring and layout on initial load.
      if (isInitialRatio) {
        post(measureAndLayout);
      }
    }

    @Override
    public void onMediaItemTransition(EventTime eventTime, @Nullable MediaItem mediaItem, int reason) {
      AnalyticsListener.super.onMediaItemTransition(eventTime, mediaItem, reason);

      if (reason == Player.MEDIA_ITEM_TRANSITION_REASON_AUTO) {
        MediaItemConfig nextConfig = _mediaItemConfigs
          .stream()
          .filter(c -> c.getMediaItem() == mediaItem)
          .findFirst()
          .get();

        _player.setVolume(nextConfig.getMuted() ? 0.0f : _volume);

        if (nextConfig.getRepeat()) {
          _player.setRepeatMode(Player.REPEAT_MODE_ONE);
        } else {
          _player.setRepeatMode(Player.REPEAT_MODE_OFF);
        }

        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_TRANSITION.toString(), null);
      }
    }

    @Override
    public void onPlaybackStateChanged(EventTime eventTime, int state) {
      AnalyticsListener.super.onPlaybackStateChanged(eventTime, state);
      if (state == Player.STATE_READY) {
        _player.setVolume(_mediaItemConfigs.get(0).getMuted() ? 0.0f : _volume);
        long duration = _player.getDuration();
        WritableMap eventData = Arguments.createMap();
        eventData.putDouble("duration", duration / 1000D);
        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_LOAD.toString(), eventData);
      }
      if (state == Player.STATE_ENDED) {
        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_END.toString(), null);
      }
    }
  }
  private ThemedReactContext _themedReactContext;
  private TextureView _textureView;
  private final AspectRatioFrameLayout _layout;
  private ExoPlayer _player;
  private Listener _listener;
  private List<MediaItemConfig> _mediaItemConfigs = new ArrayList<>();
  private float _volume = 0.0f;
  private boolean _audioOnly = false;
  private boolean _paused = true;


  public ReactVideoLooperView(ThemedReactContext context) {
    super(context);
    _themedReactContext = context;

    FrameLayout.LayoutParams aspectRatioParams = new FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT,
      FrameLayout.LayoutParams.MATCH_PARENT);
    aspectRatioParams.gravity = Gravity.CENTER;

    _layout = new AspectRatioFrameLayout(context);
    _layout.setLayoutParams(aspectRatioParams);
    _layout.setResizeMode(ResizeMode.RESIZE_MODE_CENTER_CROP);

    ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT);

    _textureView = new TextureView(context);
    _textureView.setLayoutParams(layoutParams);
    _textureView.setOpaque(false);
    _layout.addView(_textureView, 0, layoutParams);

    addViewInLayout(_layout, 0, aspectRatioParams);

    initializeMediaPlayer();
    VideoCacheManager.getInstance().prepare(context);
  }

  private final Runnable measureAndLayout = new Runnable() {
    @Override
    public void run() {
      measure(
        MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
      layout(getLeft(), getTop(), getRight(), getBottom());
    }
  };

  @Override
  public void requestLayout() {
    super.requestLayout();
    post(measureAndLayout);
  }

  private void sendEvent(ThemedReactContext reactContext,
                         String eventName, @Nullable WritableMap properties) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, properties);
  }

  private OkHttpDataSource.Factory createOkHttpFactory() {
    OkHttpClient client = new OkHttpClient.Builder().build();
    OkHttpDataSource.Factory factory = new OkHttpDataSource.Factory((Request r) -> client.newCall(r));
    return factory;
  }

  private void initializeMediaPlayer() {
    if (_player == null) {
      _player = new ExoPlayer.Builder(_themedReactContext)
        .setMediaSourceFactory(new DefaultMediaSourceFactory(VideoCacheManager.getInstance().getCachedDataSourceFactory()))
        .build();
      _listener = new Listener();
      _player.addAnalyticsListener(_listener);
    }
  }

  public void setSources(ReadableArray sources) {
    ReactVideoLooperView self = this;
    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        OkHttpDataSource.Factory okHttpDataSourceFactory = createOkHttpFactory();

        List<MediaSource> mediaSources = new ArrayList<>();
        for (Object source: sources.toArrayList()) {
          HashMap<String, Object> mediaItemConfig = (HashMap<String, Object>)source;
          MediaItem mediaItem = new MediaItem.Builder()
            .setUri((String)mediaItemConfig.get("source"))
            .setCustomCacheKey((String)mediaItemConfig.get("source"))
            .build();

          VideoCacheManager.getInstance().preCache((String)mediaItemConfig.get("source"));
          MediaSource mediaSource = VideoCacheManager.getInstance().getCachedMediaSource(mediaItem);
          mediaSources.add(mediaSource);
          _mediaItemConfigs.add(new MediaItemConfig(
            (String)mediaItemConfig.get("source"),
            (boolean)mediaItemConfig.getOrDefault("repeat", false),
            (boolean)mediaItemConfig.getOrDefault("muted", false),
            mediaItem
          ));
        }

        // Make sure all configs are present, this could trigger events depending on configs
        for (MediaSource mediaSource: mediaSources) {
          _player.addMediaSource(mediaSource);
        }

        MediaItemConfig firstMediaItemConfig = _mediaItemConfigs.get(0);
        if (firstMediaItemConfig.getRepeat()) {
          _player.setRepeatMode(Player.REPEAT_MODE_ONE);
        }
        _player.setVolume(firstMediaItemConfig.getMuted() ? 0.0f : _volume);

        if (!self._audioOnly) {
          self._player.setVideoTextureView(self._textureView);
        }
        self._player.prepare();
        self._player.setPlayWhenReady(!self._paused);
      }
    }, 1);
  }

  public void setSeek(double to) {
    _player.seekTo((long)to * 1000L);
  }

  public void setRepeat(boolean repeat) {
    if (repeat) {
      _player.setRepeatMode(Player.REPEAT_MODE_ONE);
    } else {
      _player.setRepeatMode(Player.REPEAT_MODE_OFF);
    }
  }

  public void setPaused(boolean paused) {
    _paused = paused;
    if (paused) {
      _player.pause();
    } else {
      _player.play();
    }
  }

  public void setVolume(double volume) {
    _volume = (float)volume;
    _player.setVolume(_volume);
  }

  public void setAudioOnly(boolean audioOnly) {
    _audioOnly = audioOnly;
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (_player != null) {
      _player.removeAnalyticsListener(_listener);
      _player.clearVideoTextureView(_textureView);
      _player.release();
      _player = null;
      _listener = null;
    }
  }
}
