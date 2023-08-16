package org.twentyninek.app.cupcake.newarchitecture.videoLooper;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;
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

import androidx.annotation.OptIn;
import androidx.media3.common.MediaItem;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.common.VideoSize;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.exoplayer.source.MediaSource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ReactVideoLooperView extends FrameLayout {
  private final int SHOW_PROGRESS = 1;

  private final Handler progressHandler = new Handler(Looper.getMainLooper()) {
    @Override
    public void handleMessage(Message msg) {
      switch (msg.what) {
        case SHOW_PROGRESS:
          if (_player != null) {
            if (_player.isPlaying()) {
              long pos = _player.getCurrentPosition();
              WritableMap eventData = Arguments.createMap();
              eventData.putDouble("time", pos / 1000D);
              sendEvent(_themedReactContext, ReactEvents.EVENT_ON_PROGRESS.toString(), eventData);
            }

            msg = obtainMessage(SHOW_PROGRESS);
            sendMessageDelayed(msg, Math.round(_progressUpdateInterval));
          }
          break;
      }
    }
  };

  private class PlayerListener implements Player.Listener {
    @Override
    public void onEvents(Player player, Player.Events events) {
      if (events.contains(Player.EVENT_PLAYBACK_STATE_CHANGED) || events.contains(Player.EVENT_PLAY_WHEN_READY_CHANGED)) {
        int state = player.getPlaybackState();
        if (state == Player.STATE_READY) {
          long duration = player.getDuration();
          WritableMap eventData = Arguments.createMap();
          eventData.putDouble("duration", duration / 1000D);
          sendEvent(_themedReactContext, ReactEvents.EVENT_ON_LOAD.toString(), eventData);
          progressHandler.removeMessages(SHOW_PROGRESS);
          progressHandler.sendEmptyMessage(SHOW_PROGRESS);
          setKeepScreenOn(true);
        }
        if (state == Player.STATE_IDLE) {
          progressHandler.sendEmptyMessage(SHOW_PROGRESS);
        }
        if (state == Player.STATE_BUFFERING) {
          progressHandler.sendEmptyMessage(SHOW_PROGRESS);
        }
        if (state == Player.STATE_ENDED) {
          sendEvent(_themedReactContext, ReactEvents.EVENT_ON_END.toString(), null);
        }
      }
    }

    @Override
    public void onMediaItemTransition(@Nullable MediaItem mediaItem, int reason) {
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
    public void onVideoSizeChanged(VideoSize videoSize) {
      Player.Listener.super.onVideoSizeChanged(videoSize);
      boolean isInitialRatio = _layout.getAspectRatio() == 0;
      _layout.setAspectRatio(videoSize.height == 0 ? 1 : (videoSize.width * videoSize.pixelWidthHeightRatio) / videoSize.height);

      // React native workaround for measuring and layout on initial load.
      if (isInitialRatio) {
        post(measureAndLayout);
      }
    }

    @Override
    public void onPlayerError(PlaybackException error) {
      WritableMap eventData = Arguments.createMap();
      eventData.putString("cause", error.getMessage());
      sendEvent(_themedReactContext, ReactEvents.EVENT_ON_ERROR.toString(), eventData);
    }
  }
  private ThemedReactContext _themedReactContext;
  private TextureView _textureView;
  private final AspectRatioFrameLayout _layout;
  private ExoPlayer _player;
  private Player.Listener _playerListener;
  private List<MediaItemConfig> _mediaItemConfigs = new ArrayList<>();
  private float _volume = 0.0f;
  private boolean _muted = true;
  private float _progressUpdateInterval = 1000.0f;
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

  @OptIn(markerClass = UnstableApi.class)
  private void initializeMediaPlayer(boolean isLocal) {
    if (_player == null) {
      if (isLocal) {
        _player = new ExoPlayer.Builder(_themedReactContext).build();
      } else {
        _player = new ExoPlayer.Builder(_themedReactContext)
          .setMediaSourceFactory(new DefaultMediaSourceFactory(VideoCacheManager.getInstance().getCachedDataSourceFactory()))
          .build();
      }

      _playerListener = new PlayerListener();
      _player.addListener(_playerListener);
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

  private void setDeviceVolume(float volume) {
    if (_player != null && !_muted) {
      _player.setDeviceVolume((int)volume, 0);
    }
  }
  public void setSources(ReadableArray sources) {
    new Handler().postDelayed(new Runnable() {
      @Override
      @OptIn(markerClass = UnstableApi.class)
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
        setDeviceVolume(_volume);
        _player.prepare();
        _player.setPlayWhenReady(!_paused);
      }
    }, 1);
  }

  public void setSeek(double to) {
    if (_player != null) {
      _player.seekTo((long)to * 1000L);
      if (!_paused) {
        _player.play();
      }
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

  public void setMuted(boolean muted) {
    if (_player != null) {
      _muted = muted;
      _player.setVolume(muted ? 0f : _volume);
    }
  }

  public void setAudioOnly(boolean audioOnly) {
    _audioOnly = audioOnly;
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (_player != null) {
      progressHandler.removeMessages(SHOW_PROGRESS);
      _player.removeListener(_playerListener);
      _player.clearVideoTextureView(_textureView);
      _player.release();
      _player = null;
      _playerListener = null;
    }
  }
}
