package org.twentyninek.app.cupcake.newarchitecture.videoLooper;

import androidx.media3.common.MediaItem;

public class MediaItemConfig {
  private String _source;
  private boolean _repeat;
  private MediaItem _mediaItem;

  public MediaItem getMediaItem() {
    return _mediaItem;
  }


  public String getSource() {
    return _source;
  }

  public boolean getRepeat() {
    return _repeat;
  }

  public MediaItemConfig(
    String source,
    boolean repeat,
    MediaItem mediaItem) {
    _source = source;
    _repeat = repeat;
    _mediaItem = mediaItem;
  }
}
