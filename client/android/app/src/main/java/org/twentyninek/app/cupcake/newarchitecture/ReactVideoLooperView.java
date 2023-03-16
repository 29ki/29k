package org.twentyninek.app.cupcake.newarchitecture;

import android.graphics.Matrix;
import android.graphics.SurfaceTexture;
import android.media.MediaPlayer;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.AttributeSet;
import android.view.Surface;
import android.view.TextureView;
import android.webkit.CookieManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.exoplayer2.upstream.DataSource;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

class Size {

  private int mWidth;
  private int mHeight;

  public Size(int width, int height) {
    mWidth = width;
    mHeight = height;
  }

  public int getWidth() {
    return mWidth;
  }

  public int getHeight() {
    return mHeight;
  }
}

public class ReactVideoLooperView extends TextureView implements TextureView.SurfaceTextureListener,
  MediaPlayer.OnVideoSizeChangedListener {

  public enum Events {
    EVENT_ON_START_END("onStartEnd"),
    EVENT_ON_LOOP_END("onLoopEnd"),
    EVENT_ON_END("onEnd"),
    EVENT_ON_READY_FOR_DISPLAY("onReadyForDisplay"),
    EVENT_ON_TRANSITION("onTransition");

    private final String mName;

    Events(final String name) {
      mName = name;
    }

    @Override
    public String toString() {
      return mName;
    }
  }
  private MediaPlayer mLoopMediaPlayer;
  private MediaPlayer mEndMediaPlayer;
  private ThemedReactContext themedReactContext;
  private RCTEventEmitter mEventEmitter;
  private SurfaceTexture mSurfaceTexture;
  public ReactVideoLooperView(ThemedReactContext context) {
    super(context);
    themedReactContext = context;
    setUpView();
  }

  public ReactVideoLooperView(ThemedReactContext context, AttributeSet attrs) {
    super(context, attrs);
  }

  public ReactVideoLooperView(ThemedReactContext context, AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
  }

  private void setUpView() {
    initializeMediaPlayer();
  }

  private void sendEvent(ThemedReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private void initializeMediaPlayer() {
    if (mLoopMediaPlayer == null) {
      mLoopMediaPlayer = new MediaPlayer();
      mLoopMediaPlayer.setOnVideoSizeChangedListener(this);
      setSurfaceTextureListener(this);
    } else {
      mLoopMediaPlayer.reset();
    }
  }

  private void setSource(String source, MediaPlayer mediaPlayer) throws IOException {
    CookieManager cookieManager = CookieManager.getInstance();

    Uri parsedUrl = Uri.parse(source);
    Uri.Builder builtUrl = parsedUrl.buildUpon();

    String cookie = cookieManager.getCookie(builtUrl.build().toString());

    Map<String, String> headers = new HashMap<String, String>();

    if (cookie != null) {
      headers.put("Cookie", cookie);
    }

    mediaPlayer.setDataSource(themedReactContext, parsedUrl, headers);
  }

  public void setSources(ReadableMap sources) throws IOException {
    String startSource = sources.getString("start");
    String loopSource = sources.getString("loop");
    String endSource = sources.getString("end");

    initializeMediaPlayer();

    if (loopSource != null) {
        mLoopMediaPlayer.setLooping(true);
        mLoopMediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
          @Override
          public void onPrepared(MediaPlayer mediaPlayer) {
            sendEvent(themedReactContext, Events.EVENT_ON_READY_FOR_DISPLAY.toString(), null);
            mLoopMediaPlayer.start();
            if (endSource != null) {
              try {
                prepareEndMediaPlayer(endSource);
              } catch (IOException e) {}
            }
          }
        });

        mLoopMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
          @Override
          public void onCompletion(MediaPlayer mediaPlayer) {
            sendEvent(themedReactContext, Events.EVENT_ON_TRANSITION.toString(), null);
            mLoopMediaPlayer.release();
            mEndMediaPlayer.setSurface(new Surface(mSurfaceTexture));
          }
        });

        setSource(loopSource, mLoopMediaPlayer);
        mLoopMediaPlayer.prepareAsync();
        mLoopMediaPlayer.setLooping(false);
    }
  }

  private void prepareEndMediaPlayer(String endSource) throws IOException {
    mEndMediaPlayer = new MediaPlayer();
    setSource(endSource, mEndMediaPlayer);

    mEndMediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
      @Override
      public void onPrepared(MediaPlayer mediaPlayer) {
        sendEvent(themedReactContext, Events.EVENT_ON_TRANSITION.toString(), null);
        mLoopMediaPlayer.setNextMediaPlayer(mEndMediaPlayer);
      }
    });

    mEndMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
      @Override
      public void onCompletion(MediaPlayer mediaPlayer) {
        sendEvent(themedReactContext, Events.EVENT_ON_END.toString(), null);
      }
    });

    mEndMediaPlayer.prepareAsync();
  }

  public void setRepeat(boolean repeat) {
    if (mLoopMediaPlayer != null) {
      mLoopMediaPlayer.setLooping(repeat);
    }
  }

  @Override
  public void onVideoSizeChanged(MediaPlayer mediaPlayer, int width, int height) {
    scaleVideoSize(width, height);
  }

  @Override
  public void onSurfaceTextureAvailable(@NonNull SurfaceTexture surfaceTexture, int width, int height) {
    mSurfaceTexture = surfaceTexture;
    if (mLoopMediaPlayer != null) {
      mLoopMediaPlayer.setSurface(new Surface(mSurfaceTexture));
    }
  }

  @Override
  public void onSurfaceTextureSizeChanged(@NonNull SurfaceTexture surfaceTexture, int i, int i1) {

  }

  @Override
  public boolean onSurfaceTextureDestroyed(@NonNull SurfaceTexture surfaceTexture) {
    return false;
  }

  @Override
  public void onSurfaceTextureUpdated(@NonNull SurfaceTexture surfaceTexture) {}

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (mLoopMediaPlayer != null) {
      try {
        if (mLoopMediaPlayer.isPlaying()) {
          mLoopMediaPlayer.stop();
        }
        mLoopMediaPlayer.release();
        mLoopMediaPlayer = null;
      } catch (Exception e) {
        mLoopMediaPlayer = null;
      }
    }

    if (mEndMediaPlayer != null) {
      if (mEndMediaPlayer.isPlaying()) {
        mEndMediaPlayer.stop();
      }
      mEndMediaPlayer.release();
      mEndMediaPlayer = null;
    }
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
}
