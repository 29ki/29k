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
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.analytics.AnalyticsListener;
import com.google.android.exoplayer2.source.DefaultMediaSourceFactory;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.video.VideoSize;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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
        long duration = _player.getDuration();
        WritableMap eventData = Arguments.createMap();
        eventData.putDouble("duration", duration / 1000D);
        sendEvent(_themedReactContext, ReactEvents.EVENT_ON_LOAD.toString(), eventData);

        setKeepScreenOn(true);
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
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(getId(), eventName, properties);
  }

  private void initializeMediaPlayer(boolean isLocal) {
    if (_player == null) {
      if (isLocal) {
        _player = new ExoPlayer.Builder(_themedReactContext).build();
      } else {
        _player = new ExoPlayer.Builder(_themedReactContext)
          .setMediaSourceFactory(new DefaultMediaSourceFactory(VideoCacheManager.getInstance().getCachedDataSourceFactory()))
          .build();
      }

      _listener = new Listener();
      _player.addAnalyticsListener(_listener);
    }
  }

  private String prepareLocalUri(String src) {
    return String.format("asset:///custom/%s", src);
  }

  private boolean isLocalAsset(String src) {
    if (src.startsWith("https://") || src.startsWith("http://")) {
      return false;
    }
    return true;
  }
  public void setSources(ReadableArray sources) {
    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        List<MediaSource> mediaSources = new ArrayList<>();
        List<MediaItem> mediaItems = new ArrayList<>();
        boolean isLocal = false;
        for (Object sourceConfig: sources.toArrayList()) {
          HashMap<String, Object> mediaItemConfig = (HashMap<String, Object>)sourceConfig;
          String source = (String)mediaItemConfig.get("source");

          // We only allow only remote or only local so it's ok to set this several times
          isLocal = isLocalAsset(source);

          MediaItem mediaItem;
          if (isLocal) {
            mediaItem = new MediaItem.Builder()
              .setUri(prepareLocalUri(source))
              .build();
            mediaItems.add(mediaItem);
          } else {
            mediaItem = new MediaItem.Builder()
              .setUri(source)
              .setCustomCacheKey(source)
              .build();

            VideoCacheManager.getInstance().preCache((String)mediaItemConfig.get("source"));
            MediaSource mediaSource = VideoCacheManager.getInstance().getCachedMediaSource(mediaItem);
            mediaSources.add(mediaSource);
          }
          _mediaItemConfigs.add(new MediaItemConfig(
            source,
            (boolean)mediaItemConfig.getOrDefault("repeat", false),
            mediaItem
          ));
        }

        initializeMediaPlayer(isLocal);

        // Make sure all configs are present, this could trigger events depending on configs
        if (mediaSources.size() > 0) {
          _player.addMediaSources(mediaSources);
        } else if (mediaItems.size() > 0) {
          _player.addMediaItems(mediaItems);
        }

        MediaItemConfig firstMediaItemConfig = _mediaItemConfigs.get(0);
        if (firstMediaItemConfig.getRepeat()) {
          _player.setRepeatMode(Player.REPEAT_MODE_ONE);
        }

        if (!_audioOnly) {
          _player.setVideoTextureView(_textureView);
        }
        _player.setVolume(_volume);
        _player.prepare();
        _player.setPlayWhenReady(!_paused);
      }
    }, 1);
  }

  public void setSeek(double to) {
    if (_player != null) {
      _player.seekTo((long)to * 1000L);
    }
  }

  public void setRepeat(boolean repeat) {
    if (_player != null) {
      if (repeat) {
        _player.setRepeatMode(Player.REPEAT_MODE_ONE);
      } else {
        _player.setRepeatMode(Player.REPEAT_MODE_OFF);
      }
    }
  }

  public void setPaused(boolean paused) {
    _paused = paused;
    if (_player != null) {
      if (paused) {
        _player.pause();
      } else {
        _player.play();
      }
    }
  }

  public void setVolume(double volume) {
    _volume = (float)volume;
    if (_player != null) {
      _player.setVolume(_volume);
    }
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
