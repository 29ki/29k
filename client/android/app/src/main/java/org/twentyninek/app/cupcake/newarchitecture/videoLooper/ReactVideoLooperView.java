package org.twentyninek.app.cupcake.newarchitecture.videoLooper;

import android.graphics.Matrix;
import android.os.Handler;
import android.view.TextureView;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.analytics.AnalyticsListener;
import com.google.android.exoplayer2.ext.okhttp.OkHttpDataSource;
import com.google.android.exoplayer2.source.DefaultMediaSourceFactory;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.upstream.DefaultLoadErrorHandlingPolicy;
import com.google.android.exoplayer2.video.VideoSize;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import okhttp3.OkHttpClient;
import okhttp3.Request;

enum ReactEvents {
  EVENT_ON_END("onEnd"),
  EVENT_ON_READY_FOR_DISPLAY("onReadyForDisplay"),
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
public class ReactVideoLooperView extends TextureView {
  private class Listener implements AnalyticsListener {
    @Override
    public void onVideoSizeChanged(EventTime eventTime, VideoSize videoSize) {
      AnalyticsListener.super.onVideoSizeChanged(eventTime, videoSize);
      scaleVideoSize(videoSize.width, videoSize.height);
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

        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_TRANSITION.toString());
      }
    }

    @Override
    public void onPlaybackStateChanged(EventTime eventTime, int state) {
      AnalyticsListener.super.onPlaybackStateChanged(eventTime, state);
      if (state == Player.STATE_READY) {
        _player.setVolume(_mediaItemConfigs.get(0).getMuted() ? 0.0f : _volume);
        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_READY_FOR_DISPLAY.toString());
      }
      if (state == Player.STATE_ENDED) {
        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_END.toString());
      }
    }
  }
  private ThemedReactContext _themedReactContext;
  private ExoPlayer _player;
  private Listener _listener;
  private List<MediaItemConfig> _mediaItemConfigs = new ArrayList<>();
  private float _volume = 0.0f;
  private boolean _audioOnly = false;
  private int minLoadRetryCount = 3;

  public ReactVideoLooperView(ThemedReactContext context) {
    super(context);
    _themedReactContext = context;
    initializeMediaPlayer();
  }

  private void sendEvent(ThemedReactContext reactContext,
                         String eventName) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, null);
  }

  private OkHttpDataSource.Factory createOkHttpFactory() {
    OkHttpClient client = new OkHttpClient.Builder().build();
    OkHttpDataSource.Factory factory = new OkHttpDataSource.Factory((Request r) -> client.newCall(r));
    //CacheDataSource.Factory cacheFactory = new CacheDataSource.Factory().setUpstreamDataSourceFactory(factory);
    return factory;
  }

  private void initializeMediaPlayer() {
    if (_player == null) {
      _player = new ExoPlayer.Builder(_themedReactContext)
        .setMediaSourceFactory(new DefaultMediaSourceFactory(createOkHttpFactory()))
        .build();

      _listener = new Listener();
      _player.addAnalyticsListener(_listener);
    }
  }
  public void setSources(ReadableArray sources) throws IOException {
    ReactVideoLooperView self = this;
    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        OkHttpDataSource.Factory okHttpDataSourceFactory = createOkHttpFactory();

        List<MediaSource> mediaSources = new ArrayList<>();
        for (Object source: sources.toArrayList()) {
          HashMap<String, Object> mediaItemConfig = (HashMap<String, Object>)source;
          MediaItem mediaItem = MediaItem.fromUri((String)mediaItemConfig.get("source"));
          MediaSource mediaSource =
            new ProgressiveMediaSource.Factory(okHttpDataSourceFactory)
              .setLoadErrorHandlingPolicy(new DefaultLoadErrorHandlingPolicy(minLoadRetryCount))
              .createMediaSource(mediaItem);
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
          self._player.setVideoTextureView(self);
        }
        self._player.prepare();
        self._player.setPlayWhenReady(true);
      }
    }, 1);

  }

  public void setRepeat(boolean repeat) {
    if (repeat) {
      _player.setRepeatMode(Player.REPEAT_MODE_ONE);
    } else {
      _player.setRepeatMode(Player.REPEAT_MODE_OFF);
    }
  }

  public void setPaused(boolean paused) {
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

  private void scaleVideoSize(int videoWidth, int videoHeight) {
    if (videoWidth == 0 || videoHeight == 0) {
      return;
    }

    Size viewSize = new Size(getWidth(), getHeight());
    Size videoSize = new Size(videoWidth, videoHeight);
    ScaleManager scaleManager = new ScaleManager(viewSize, videoSize);
    Matrix matrix = scaleManager.getScaleMatrix(ScalableType.CENTER_CROP);
    if (matrix != null) {
      setTransform(matrix);
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (_player != null) {
      _player.removeAnalyticsListener(_listener);
      _player.release();
      _player = null;
      _listener = null;
    }
  }
}
