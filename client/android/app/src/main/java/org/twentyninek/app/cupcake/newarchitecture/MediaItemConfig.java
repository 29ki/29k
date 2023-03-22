package org.twentyninek.app.cupcake.newarchitecture;

import com.google.android.exoplayer2.MediaItem;

public class MediaItemConfig {
  private String _source;
  private boolean _muted;
  private MediaItem _mediaItem;

  public MediaItem getMediaItem() {
    return _mediaItem;
  }

  public boolean isMuted() {
    return _muted;
  }

  public String getSource() {
    return _source;
  }

  public MediaItemConfig(String source, boolean muted, MediaItem mediaItem) {
    _source = source;
    _muted = muted;
    _mediaItem = mediaItem;
  }
}
