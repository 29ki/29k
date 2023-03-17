package org.twentyninek.app.cupcake.newarchitecture;

import android.app.IntentService;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.exoplayer2.upstream.cache.SimpleCache;

public class VideoPreloadWorker extends Worker {
  SimpleCache _cache;

  public VideoPreloadWorker(
    @NonNull ThemedReactContext appContext,
    @NonNull WorkerParameters workerParams) {
    super(appContext, workerParams);
  }

  @NonNull
  @Override
  public Result doWork() {
    return null;
  }
}
