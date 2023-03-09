import AVFoundation
import AVKit
import UIKit
import Foundation
import React
import Promises

struct Mutes {
  var start = false
  var loop = false
  var end = false
}

class VideoLooperView: RCTView {

  private var _playerLayer: AVPlayerLayer?
  private var _player: AVQueuePlayer?
  private var _startPlayerItem: AVPlayerItem?
  private var _loopPlayerItem: AVPlayerItem?
  private var _endPlayerItem: AVPlayerItem?
  private var _endAsset: AVAsset?
  private var _repeat: Bool = false
  private var _pause: Bool = false
  private var _mutes = Mutes()
  
  
  private var _volume: Float = 1.0
  
  // Key-value observing context
  private var playerItemContext = 0
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
 
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    setupView()
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    CATransaction.begin()
    CATransaction.setAnimationDuration(0)
    _playerLayer?.frame = bounds
    CATransaction.commit()
  }
  
  deinit {
    NotificationCenter.default.removeObserver(self)
    removeItemObservers()
    removePlayerLayer()
  }
  
  func removePlayerLayer() {
    _playerLayer?.removeFromSuperlayer()
    _playerLayer = nil
  }
 
  private func setupView() {
    _player = AVQueuePlayer()
    _playerLayer = AVPlayerLayer(player: _player!)
    
    guard let playerLayer = _playerLayer else { fatalError("Error creating player layer") }
    playerLayer.videoGravity = .resizeAspectFill
    playerLayer.frame = self.layer.bounds
    playerLayer.needsDisplayOnBoundsChange = true
    self.layer.addSublayer(playerLayer)
    self.layer.needsDisplayOnBoundsChange = true
  }
  
  private func addLoopItemObservers() {
    guard let items = self._player?.items() else { return }
    removeItemObservers()
    for item in items {
      addLoopItemObserver(item: item)
    }
  }
  
  private func addStartItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.addObserver(self, selector: #selector(startPlayerItemDidPlayToEnd), name: .AVPlayerItemDidPlayToEndTime, object: item)
  }
  
  private func addLoopItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.addObserver(self, selector: #selector(loopPlayerItemDidPlayToEnd), name: .AVPlayerItemDidPlayToEndTime, object: item)
  }
  
  private func addEndItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.addObserver(self, selector: #selector(endPlayerItemDidPlayToEnd), name: .AVPlayerItemDidPlayToEndTime, object: item)
    item.addObserver(self, forKeyPath: #keyPath(AVPlayerItem.status), context: &playerItemContext)
  }
  
  private func removeItemObservers() {
    guard let items = self._player?.items() else { return }
    for item in items {
      removeItemObserver(item: item)
    }
  }
  
  private func removeItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: item)
  }
  
  private func setVolume(muted: Bool) {
    if (muted) {
      self._player?.volume = 0.0
    } else {
      self._player?.volume = self._volume
    }
  }
  
  private func loadAsset(source: NSString?) -> Promise<AVAsset?> {
    return Promise<AVAsset?> { fullfill, reject in
      if source == nil {
        fullfill(nil)
        return
      }
      let loopAsset = AVAsset(url: URL(string: source! as String)!)
      loopAsset.loadValuesAsynchronously(forKeys: ["duration", "playable"]) {
        fullfill(loopAsset)
      }
    }
  }
  
  // MARK: react props handlers
  
  @objc var onStartEnd: RCTDirectEventBlock?
  @objc var onLoopEnd: RCTDirectEventBlock?
  @objc var onEnd: RCTDirectEventBlock?
  @objc var onTransition: RCTDirectEventBlock?
  @objc var onReadyForDisplay: RCTDirectEventBlock?
  
  @objc func setSources(_ sources: NSDictionary) {
    all(
      loadAsset(source: sources["start"] as? NSString),
      loadAsset(source: sources["loop"] as? NSString),
      loadAsset(source: sources["end"] as? NSString)
    ).then { startAsset, loopAsset, endAsset in
      if startAsset != nil || loopAsset != nil {
        if startAsset != nil && loopAsset != nil {
          self._startPlayerItem = AVPlayerItem(asset: startAsset!)
          self._loopPlayerItem = AVPlayerItem(asset: loopAsset!)
          self.addStartItemObserver(item: self._startPlayerItem!)
          self.addLoopItemObserver(item: self._loopPlayerItem!)
          self._player?.insert(self._startPlayerItem!, after: nil)
          self._player?.insert(self._loopPlayerItem!, after: self._startPlayerItem!)
          self._player?.insert(AVPlayerItem(asset: loopAsset!), after: self._loopPlayerItem!)
          self.setVolume(muted: self._mutes.start)
        } else if loopAsset != nil {
          self._loopPlayerItem = AVPlayerItem(asset: loopAsset!)
          self._player?.insert(self._loopPlayerItem!, after: nil)
          self._player?.insert(AVPlayerItem(asset: loopAsset!), after: self._loopPlayerItem!)
          self.addLoopItemObservers()
          self.setVolume(muted: self._mutes.loop)
        }
        self._endAsset = endAsset
      } else if endAsset != nil {
        self._endPlayerItem = AVPlayerItem(asset: endAsset!)
        self._player?.insert(self._endPlayerItem!, after: nil)
        self.addEndItemObserver(item: self._endPlayerItem!)
        self.setVolume(muted: self._mutes.end)
        self._player?.actionAtItemEnd = .pause
      }
      
      if self.onReadyForDisplay != nil {
        let event = [AnyHashable: Any]()
        self.onReadyForDisplay!(event)
      }
      
      self._player?.play()
    }
  }
  
  @objc func setRepeat(_ val: Bool) {
    self._repeat = val
  }
  
  @objc func setPaused(_ val: Bool) {
    self._pause = val
    if val {
      self._player?.play()
    } else {
      self._player?.pause()
    }
  }
  
  @objc func setMutes(_ val: NSDictionary) {
    self._mutes = Mutes(
      start: val["start"] == nil ? false : val["start"] as! Bool,
      loop: val["loop"] == nil ? false : val["loop"] as! Bool,
      end: val["end"] == nil ? false : val["end"] as! Bool
    )
    
    guard let item = self._player?.currentItem else { return }
    if item == self._startPlayerItem {
      self.setVolume(muted: self._mutes.start)
    } else if item == self._loopPlayerItem {
      self.setVolume(muted: self._mutes.loop)
    } else if item == self._endPlayerItem {
      self.setVolume(muted: self._mutes.end)
    }
  }
  
  @objc func setSeek(_ val: NSNumber) {
    let timeScale: Int = 1000
    let cmSeekTime: CMTime = CMTimeMakeWithSeconds(Float64(truncating: val), preferredTimescale: Int32(timeScale))
    guard let currentItem = self._player?.currentItem else { return }
    let currentTime: CMTime = currentItem.currentTime()
    
    if CMTimeCompare(currentTime, cmSeekTime) != 0 {
      return;
    } else {
      self._player?.seek(to: cmSeekTime)
    }
  }
  
  // MARK: Observers
  
  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    guard context == &playerItemContext else {
      super.observeValue(forKeyPath: keyPath, of: object, change: change, context: context)
      return
    }
    
    if keyPath == #keyPath(AVPlayerItem.status) {
      let status: AVPlayerItem.Status
      if let statusNumber = change?[.kindKey] as? NSNumber {
        status = AVPlayerItem.Status(rawValue: statusNumber.intValue)!
      } else {
        status = .unknown
      }
      
      switch status {
      case .readyToPlay:
        if onTransition != nil {
          self.setVolume(muted: self._mutes.end)
          let event = [AnyHashable: Any]()
          onTransition!(event)
        }
      default:
        return
      }
    }
  }
  
  @objc private func startPlayerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      self.removeItemObserver(item: item!)
    }
    
    if onStartEnd == nil {
      return
    }
    
    self.setVolume(muted: self._mutes.loop)
    let event = [AnyHashable: Any]()
    onStartEnd!(event)
  }
  
  @objc private func loopPlayerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      self.removeItemObserver(item: item!)
    }
    guard let currentItems = self._player?.items() else { return }
    guard let lastItem = currentItems.last else { return }
    
    if self._repeat {
      if onLoopEnd != nil {
        let event = [AnyHashable: Any]()
        onLoopEnd!(event)
      }
    
      self._player?.insert(AVPlayerItem(asset: lastItem.asset), after: lastItem)
      self.addLoopItemObservers()
    } else if self._endAsset != nil {
      self.removeItemObservers()
      let endItem = AVPlayerItem(asset: self._endAsset!)
      self.addEndItemObserver(item: endItem)
      self._player?.insert(endItem, after: lastItem)
    }
  }
  
  @objc private func endPlayerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      self.removeItemObserver(item: item!)
    }
    
    if onEnd == nil {
      return
    }
    
    let event = [AnyHashable: Any]()
    onEnd!(event)
  }
}
