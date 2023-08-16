package org.twentyninek.app.cupcake.newarchitecture.videoLooper;

import android.net.Uri;

import com.facebook.react.uimanager.ThemedReactContext;

import androidx.annotation.OptIn;
import androidx.media3.common.MediaItem;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.database.StandaloneDatabaseProvider;
import androidx.media3.datasource.DataSource;
import androidx.media3.datasource.DataSpec;
import androidx.media3.datasource.cache.CacheDataSource;
import androidx.media3.datasource.cache.CacheWriter;
import androidx.media3.datasource.cache.LeastRecentlyUsedCacheEvictor;
import androidx.media3.datasource.cache.SimpleCache;
import androidx.media3.datasource.okhttp.OkHttpDataSource;
import androidx.media3.exoplayer.source.MediaSource;
import androidx.media3.exoplayer.source.ProgressiveMediaSource;
import androidx.media3.exoplayer.upstream.DefaultLoadErrorHandlingPolicy;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.OkHttpClient;
import okhttp3.Request;

public class VideoCacheManager {
  private static final long CACHE_MAX_SIZE = 512 * 1024 * 1024;
  private static final long CACHE_SIZE_EACH_VIDEO = 512 * 1024;
  private DataSource.Factory _dataSourceFactory;
  private CacheDataSource.Factory _cachedDataSourceFactory;
  private StandaloneDatabaseProvider _databaseProvider;
  private SimpleCache _simpleCache;
  private ExecutorService executorService;
  private int minLoadRetryCount = 3;
  private boolean _prepared = false;

  private static final VideoCacheManager _instance = new VideoCacheManager();
  private VideoCacheManager() {}

  public static VideoCacheManager getInstance() {
    return _instance;
  }

  public CacheDataSource.Factory getCachedDataSourceFactory() {
    return _cachedDataSourceFactory;
  }

  @OptIn(markerClass = UnstableApi.class)
  public void prepare(ThemedReactContext context) {
    if (!_prepared) {
      String cacheDir = context.getExternalCacheDir() + "/ExoVideoCache";
      _databaseProvider = new StandaloneDatabaseProvider(context);
      _simpleCache = new SimpleCache(new File(cacheDir), new LeastRecentlyUsedCacheEvictor(CACHE_MAX_SIZE), _databaseProvider);
      _dataSourceFactory = createOkHttpFactory();
      _cachedDataSourceFactory = new CacheDataSource.Factory()
        .setUpstreamDataSourceFactory(_dataSourceFactory)
        .setCache(_simpleCache)
        .setFlags(CacheDataSource.FLAG_IGNORE_CACHE_FOR_UNSET_LENGTH_REQUESTS);

      executorService = Executors.newCachedThreadPool();
      _prepared = true;
    }
  }

  @OptIn(markerClass = UnstableApi.class)
  public void preCache(String url) {
    executorService.execute(() -> {
      DataSpec dataSpec = new DataSpec.Builder()
        .setUri(Uri.parse(url))
        .setLength(CACHE_SIZE_EACH_VIDEO)
        .build();

      try {
        new CacheWriter(_cachedDataSourceFactory.createDataSource(), dataSpec, null, null)
          .cache();
      } catch (IOException e) {
        e.printStackTrace();
      }
    });
  }

  @OptIn(markerClass = UnstableApi.class)
  public MediaSource getCachedMediaSource(MediaItem mediaItem) {
    MediaSource mediaSource =
      new ProgressiveMediaSource.Factory(_cachedDataSourceFactory)
        .setLoadErrorHandlingPolicy(new DefaultLoadErrorHandlingPolicy(minLoadRetryCount))
        .createMediaSource(mediaItem);
    return mediaSource;
  }

  public OkHttpDataSource.Factory createOkHttpFactory() {
    OkHttpClient client = new OkHttpClient.Builder().build();
    OkHttpDataSource.Factory factory = new OkHttpDataSource.Factory((Request r) -> client.newCall(r));
    return factory;
  }
}
