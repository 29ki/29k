import AVFoundation
import AVKit
import UIKit
import Foundation
import React
import Promises

struct ItemConfig {
  var asset: AVAsset
  var isMuted = false
  var shouldRepeat = false
}

class VideoLooperView: RCTView {

  private var _playerLayer: AVPlayerLayer?
  private var _player: AVQueuePlayer?
  private var _repeat: Bool = false
  private var _audioOnly: Bool = false
  private var _pause: Bool = false
  private var _itemConfigs: Array<ItemConfig>
  private var _volume: Float = 0.0
  
  
  override init(frame: CGRect) {
    self._itemConfigs = []
    super.init(frame: frame)
    NotificationCenter.default.addObserver(
        self,
        selector: #selector(applicationDidEnterBackground(notification:)),
        name: UIApplication.didEnterBackgroundNotification,
        object: nil
    )

    NotificationCenter.default.addObserver(
        self,
        selector: #selector(applicationDidBecomeActiveNotification(notification:)),
        name: UIApplication.didBecomeActiveNotification,
        object: nil
    )
    //setupView()
  }
 
  required init?(coder aDecoder: NSCoder) {
    self._itemConfigs = []
    super.init(coder: aDecoder)
    //setupView()
  }
  
  @objc func applicationDidEnterBackground(notification:NSNotification!) {
    self._playerLayer?.player = nil
  }

  @objc func applicationDidBecomeActiveNotification(notification:NSNotification!) {
    self._playerLayer?.player = self._player
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    CATransaction.begin()
    CATransaction.setAnimationDuration(0)
    _playerLayer?.frame = bounds
    CATransaction.commit()
  }
  
  
  
  deinit {
    print("Deinit!!!!!!!!!!!!!!!!!!!!!!!")
    NotificationCenter.default.removeObserver(self)
    _player = nil;
    removeItemObservers()
    removePlayerLayer()
  }
  
  func removePlayerLayer() {
    _playerLayer?.removeFromSuperlayer()
    _playerLayer = nil
  }
 
  private func setupView(audioOnly: Bool) {
    _player = AVQueuePlayer()
    
    if !audioOnly {
      _playerLayer = AVPlayerLayer(player: _player!)
      
      guard let playerLayer = _playerLayer else { fatalError("Error creating player layer") }
      playerLayer.videoGravity = .resizeAspectFill
      playerLayer.frame = self.layer.bounds
      playerLayer.needsDisplayOnBoundsChange = true
      self.layer.addSublayer(playerLayer)
      self.layer.needsDisplayOnBoundsChange = true
    }
  }
  
  private func configureAudio() {
    do {
      let session = AVAudioSession.sharedInstance()
      try session.setCategory(.playAndRecord, options: [.mixWithOthers, .allowBluetooth, .defaultToSpeaker])
    } catch {}
  }
  
  private func addItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(playerItemDidPlayToEnd),
      name: .AVPlayerItemDidPlayToEndTime,
      object: item)
  }
  
  private func addLoopItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(loopPlayerItemDidPlayToEnd),
      name: .AVPlayerItemDidPlayToEndTime,
      object: item)
  }
  
  private func removeItemObservers() {
    guard let items = self._player?.items() else { return }
    for item in items {
      removeItemObserver(item: item)
    }
  }
  
  private func removeItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.removeObserver(
      self,
      name: .AVPlayerItemDidPlayToEndTime,
      object: item)
  }
  
  private func setMuted(muted: Bool) {
    self._player?.isMuted = muted;
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
  
  private func createConfig(config: NSDictionary) -> Promise<ItemConfig> {
    return Promise<ItemConfig> { fullfill, reject in
      self.loadAsset(source: config["source"] as? NSString).then { asset in
        fullfill(ItemConfig(
          asset: asset!,
          isMuted: config["muted"] == nil ? false : config["muted"] as! Bool,
          shouldRepeat: config["repeat"] == nil ? false : config["repeat"] as! Bool
        ))
      }
    }
  }
  
  // MARK: react props handlers
  
  @objc var onEnd: RCTDirectEventBlock?
  @objc var onTransition: RCTDirectEventBlock?
  @objc var onReadyForDisplay: RCTDirectEventBlock?
  
  @objc func setSources(_ sources: NSArray) {
    self.setupView(audioOnly: self._audioOnly)
    let configs = sources.map {
      self.createConfig(config: $0 as! NSDictionary)
    }
    
    all(configs).then { loadedConfigs in
      self._itemConfigs = loadedConfigs
      
      for itemConfig in self._itemConfigs {
        if (itemConfig.shouldRepeat) {
          let playerItem1 = AVPlayerItem(asset: itemConfig.asset)
          let playerItem2 = AVPlayerItem(asset: itemConfig.asset)
          let lastItem = self._player?.items().last;
          self._player?.insert(playerItem1, after: lastItem)
          self._player?.insert(playerItem2, after: playerItem1)
          self.addLoopItemObserver(item: playerItem1)
          self.addLoopItemObserver(item: playerItem2)
        } else {
          let playerItem = AVPlayerItem(asset: itemConfig.asset)
          let lastItem = self._player?.items().last;
          self._player?.insert(playerItem, after: lastItem)
          self.addItemObserver(item: playerItem)
        }
      }
      
      if self._itemConfigs.count == 1 {
        if !self._itemConfigs[0].shouldRepeat {
          self._player?.actionAtItemEnd = .pause
        }
      }
      
      if self._itemConfigs[0].shouldRepeat {
        self._repeat = true;
      }
      
      self.setMuted(muted: self._itemConfigs[0].isMuted)
      
      if self.onReadyForDisplay != nil {
        let event = [AnyHashable: Any]()
        self.onReadyForDisplay!(event)
      }
      
      self.configureAudio()
      self._player?.play()
    }
  }
  
  @objc func setRepeat(_ val: Bool) {
    self._repeat = val
  }
  
  @objc func setPaused(_ val: Bool) {
    self._pause = val
    
    if (self._pause != val) {
      self.configureAudio()
    }
    
    if val {
      self._player?.play()
    } else {
      self._player?.pause()
    }
  }
  
  @objc func setAudioOnly(_ val: Bool) {
    self._audioOnly = val
  }
  
  @objc func setVolume(_ val: NSNumber?) {
    self._player?.volume = val?.floatValue ?? 0
  }
  
  // MARK: Observers
  
  @objc private func playerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      self.removeItemObserver(item: item!)
    }
    
    let currentIndex = _itemConfigs.firstIndex(where: {$0.asset == item?.asset})
    if (self._itemConfigs.count > currentIndex! + 1) {
      let nextItem = self._itemConfigs[currentIndex! + 1]
      self.setMuted(muted: nextItem.isMuted)
      self._repeat = nextItem.shouldRepeat
      
      if onTransition != nil {
        let event = [AnyHashable: Any]()
        onTransition!(event)
      }
    } else if (_player?.items().last == item) {
      self._player?.actionAtItemEnd = .pause
      if onEnd != nil {
        let event = [AnyHashable: Any]()
        onEnd!(event)
      }
    }
  }
  
  @objc private func loopPlayerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      self.removeItemObserver(item: item!)
    }
    guard let currentItems = self._player?.items() else { return }
    
    if self._repeat {
      let currentIndex = currentItems.firstIndex(of: item!)
      if currentIndex != nil && currentItems.count >= currentIndex! + 2 {
        let playerItem = AVPlayerItem(asset: item!.asset)
        self._player?.insert(playerItem, after: currentItems[currentIndex! + 1])
        self.addLoopItemObserver(item: playerItem)
      }
    } else {
      let currentIndex = currentItems.firstIndex(of: item!)
      if currentIndex != nil && currentItems.count >= currentIndex! + 2 {
        let playerItem = currentItems[currentIndex! + 1]
        self._player?.remove(playerItem)
        self.removeItemObserver(item: playerItem)
      }
    }
  }
}
