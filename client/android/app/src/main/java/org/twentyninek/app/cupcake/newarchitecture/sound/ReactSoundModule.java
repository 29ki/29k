package org.twentyninek.app.cupcake.newarchitecture.sound;

import static android.content.Context.AUDIO_SERVICE;
import static androidx.core.content.ContextCompat.getSystemService;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.PlaybackException;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.analytics.AnalyticsListener;
import com.google.android.exoplayer2.ext.okhttp.OkHttpDataSource;
import com.google.android.exoplayer2.source.DefaultMediaSourceFactory;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.upstream.DefaultLoadErrorHandlingPolicy;

import org.twentyninek.app.cupcake.newarchitecture.ReactVideoLooperView;

import okhttp3.OkHttpClient;
import okhttp3.Request;

public class ReactSoundModule extends ReactContextBaseJavaModule {

  ExoPlayer _player;
  AudioManager _audioManager;
  ReactApplicationContext _context;
  AudioFocusRequest _audioFocusRequest;
  float _volume = 1.0f;

  public ReactSoundModule(ReactApplicationContext context) {
    super(context);
    _context = context;
    _audioManager = (AudioManager)context.getSystemService(AUDIO_SERVICE);
  }

  private void initializeMediaPlayer() {
    System.out.println("initializeMediaPlayer!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    if (_player == null) {
      System.out.println("initializeMediaPlayer not null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      com.google.android.exoplayer2.audio.AudioAttributes audioAttributes = new com.google.android.exoplayer2.audio.AudioAttributes.Builder()
        .setUsage(C.USAGE_MEDIA)
        .setContentType(C.AUDIO_CONTENT_TYPE_MOVIE)
        .setAllowedCapturePolicy(C.ALLOW_CAPTURE_BY_ALL)
        .build();
      _player = new ExoPlayer.Builder(_context)
        .setMediaSourceFactory(new DefaultMediaSourceFactory(createOkHttpFactory()))
        //.setAudioAttributes(audioAttributes, true)
        .build();
      _player.addAnalyticsListener(new AnalyticsListener() {
        @Override
        public void onPlaybackStateChanged(EventTime eventTime, int state) {
          AnalyticsListener.super.onPlaybackStateChanged(eventTime, state);
          if (state == Player.STATE_READY) {
            sendEvent(_context, "onLoad");
          }
        }
      });

      _player.addListener(new Player.Listener() {
        @Override
        public void onPlayerError(PlaybackException error) {
          Player.Listener.super.onPlayerError(error);
          System.out.println(String.format("ERROR!!!!!! %s, %s", error.errorCode, error.getMessage()));

        }
      });
    }
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, null);
  }

  private int requestAudio() {
    AudioAttributes attributes = new AudioAttributes.Builder()
      .setUsage(AudioAttributes.USAGE_MEDIA)
      .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
      .build();

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      _audioFocusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
        .setAudioAttributes(attributes)
        .build();

      int result = _audioManager.requestAudioFocus(_audioFocusRequest);
      System.out.println(String.format("RESULT!!!!!!!!!!!!!!!!!!!! %d", result));
      return result;
    }
    return -1;
  }

  private OkHttpDataSource.Factory createOkHttpFactory() {
    OkHttpClient client = new OkHttpClient.Builder().build();
    OkHttpDataSource.Factory factory = new OkHttpDataSource.Factory((Request r) -> client.newCall(r));
    return factory;
  }

  @ReactMethod
  public void prepare(String source, boolean playWhenReady, boolean repeat) {
    initializeMediaPlayer();
    OkHttpDataSource.Factory okHttpDataSourceFactory = createOkHttpFactory();
    MediaItem soundMediaItem = MediaItem.fromUri(source);
    MediaSource soundMediaSource =
      new ProgressiveMediaSource.Factory(okHttpDataSourceFactory)
        .setLoadErrorHandlingPolicy(new DefaultLoadErrorHandlingPolicy(3))
        .createMediaSource(soundMediaItem);
    _player.setMediaSource(soundMediaSource);
    _player.setVolume(1.0f);
    _player.setPlayWhenReady(playWhenReady);
    _player.prepare();

    setRepeat(repeat);
  }

  @ReactMethod
  public void setRepeat(boolean repeat) {
    if (_player == null) {
      return;
    }
    if (repeat) {
      _player.setRepeatMode(Player.REPEAT_MODE_ONE);
    } else {
      _player.setRepeatMode(Player.REPEAT_MODE_OFF);
    }
  }

  @ReactMethod
  public void play() {
    if (_player == null) {
      return;
    }
    _player.play();
  }

  @ReactMethod
  public void pause() {
    if (_player == null) {
      return;
    }
    _player.pause();
  }

  @ReactMethod
  public void stop() {
    if (_player == null) {
      return;
    }
    _player.stop();
  }

  @ReactMethod
  public void release() {
    if (_player == null) {
      return;
    }
    /*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      _audioManager.abandonAudioFocusRequest(_audioFocusRequest);
    }*/

    _player.release();
    _player = null;
  }

  @ReactMethod
  public void setVolume(double value) {
    _volume = (float)value;
    if (_player == null) {
      return;
    }
    _player.setVolume(_volume);
  }

  @NonNull
  @Override
  public String getName() {
    return "Sound";
  }
}
