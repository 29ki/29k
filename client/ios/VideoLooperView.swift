import AVFoundation
import AVKit
import UIKit
import Foundation
import React
import Promises

struct ItemConfig: Equatable {
  var asset: AVAsset
  var shouldRepeat = false
}

class VideoLooperView: RCTView {

  private var _player: AVQueuePlayer?
  private var _audioPlayer: AVAudioPlayer?
  private var _repeat: Bool = false
  private var _audioOnly: Bool = false
  private var _pause: Bool = false
  private var _itemConfigs: Array<ItemConfig>
  private var _volume: Float = 1.0
  private var _mixWithOhters: Bool = false;
  
  override static var layerClass: AnyClass { AVPlayerLayer.self }
  private var _playerLayer: AVPlayerLayer  { layer as! AVPlayerLayer }
  
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
    
    NotificationCenter.default.addObserver(
        self,
        selector: #selector(playerInterruption(notification:)),
        name: AVAudioSession.interruptionNotification,
        object: nil
    )
    setupView()
  }
 
  required init?(coder aDecoder: NSCoder) {
    self._itemConfigs = []
    super.init(coder: aDecoder)
    setupView()
  }
  
  @objc func applicationDidEnterBackground(notification:NSNotification!) {
    self._playerLayer.player = nil
  }

  @objc func applicationDidBecomeActiveNotification(notification:NSNotification!) {
    self._playerLayer.player = self._player
    if !self._pause {
      self._player?.play()
    }
  }
  
  @objc func playerInterruption(notification: NSNotification) {
    guard let userInfo = notification.userInfo,
    let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
    let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
      return
    }
    if type == .began {
      self._player?.pause()
    }
    else if type == .ended {
      guard let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt else {
        return
      }
      let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
      if options.contains(.shouldResume) {
        // Interruption Ended - playback should resume
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
          if !self._pause {
            self._player?.play()
          }
        }
      }
    }
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    CATransaction.begin()
    CATransaction.setAnimationDuration(0)
    _playerLayer.frame = bounds
    CATransaction.commit()
  }
  
  deinit {
    NotificationCenter.default.removeObserver(self)
    _player = nil;
    _audioPlayer?.stop()
    _audioPlayer = nil;
    removeItemObservers()
    removePlayerLayer()
  }
  
  func removePlayerLayer() {
    _playerLayer.removeFromSuperlayer()
  }
 
  private func setupView() {
    _player = AVQueuePlayer()
    _player?.preventsDisplaySleepDuringVideoPlayback = true
    _player?.allowsExternalPlayback = false
    _player?.automaticallyWaitsToMinimizeStalling = true
    _playerLayer.player = _player
    
    _playerLayer.videoGravity = .resizeAspectFill
    _playerLayer.frame = self.layer.bounds
    _playerLayer.needsDisplayOnBoundsChange = true
    self.layer.needsDisplayOnBoundsChange = true
  }
  
  private func configureAudio() {
    if _player?.isMuted != true {
      do {
        let session = AVAudioSession.sharedInstance()
        if (_mixWithOhters) {
          try session.setCategory(.playAndRecord, options: [.mixWithOthers, .allowBluetooth, .defaultToSpeaker])
          try session.setActive(true)
        } else {
          try session.setCategory(.playback)
        }
      } catch {}
    }
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
  
  private func loadAsset(source: NSString?) -> Promise<AVAsset?> {
    return Promise<AVAsset?> { fullfill, reject in
      if source == nil {
        fullfill(nil)
        return
      }
      
      var asset: AVAsset? = nil
      if source?.hasPrefix("http") == true {
        asset = AVAsset(url: URL(string: source! as String)!)
      } else {
        let url = Bundle.main.url(
          forResource: source!.deletingPathExtension as String,
          withExtension: source!.pathExtension)
        if (url != nil) {
          asset = AVAsset(url: url!)
        }
      }
      
      if asset != nil {
        asset!.loadValuesAsynchronously(forKeys: ["duration", "playable"]) {
          fullfill(asset)
        }
      } else {
        fullfill(nil)
      }
    }
  }
  
  private func createConfig(config: NSDictionary) -> Promise<ItemConfig> {
    return Promise<ItemConfig> { fullfill, reject in
      self.loadAsset(source: config["source"] as? NSString).then { asset in
        fullfill(ItemConfig(
          asset: asset!,
          shouldRepeat: config["repeat"] == nil ? false : config["repeat"] as! Bool
        ))
      }
    }
  }
  
  private func setUpAudio(source: NSString, shouldRepeat: Bool) {
    let url = URL(string: source as String)
    DispatchQueue.global().async {
      guard let url = url  else { return }
      let data = try? Data(contentsOf: url)
      guard let data = data else { return }
      do {
        
        self._audioPlayer = try AVAudioPlayer(data: data)
        self._audioPlayer?.numberOfLoops = shouldRepeat ? -1 : 0
        self._audioPlayer?.volume = self._volume
        
        if self.onLoad != nil {
          var event = [AnyHashable: Any]()
          if self._audioPlayer?.duration != nil {
            event["duration"] = NSNumber(value: self._audioPlayer!.duration)
          }
          self.onLoad!(event)
        }
      } catch {
        print("Error creating audioPlayer \(error)")
      }
    }
  }
  
  private func delay(seconds: Int = 0) -> Promise<Void> {
    return Promise<Void>(on: .global()) { fulfill, reject in
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + Double(Int64(seconds)) / Double(NSEC_PER_SEC), execute: {
            fulfill(())
        })
    }
  }
  
  // MARK: react props handlers
  
  @objc var onEnd: RCTDirectEventBlock?
  @objc var onTransition: RCTDirectEventBlock?
  @objc var onLoad: RCTDirectEventBlock?
  
  @objc func setSources(_ sources: NSArray) {
    DispatchQueue.global(qos: .default).async {
      self.delay().then { [weak self] in
      guard let self = self else { return }
      if self._audioOnly {
        let firstConfig = sources[0] as! NSDictionary
        self.setUpAudio(
          source: firstConfig["source"] as! NSString,
          shouldRepeat: firstConfig["repeat"] == nil ? false : firstConfig["repeat"] as! Bool)
      } else {
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
            
            if self.onLoad != nil {
              var event = [AnyHashable: Any]()
              let firstItem = self._player?.items().first
              if firstItem != nil {
                let duration = Float(CMTimeGetSeconds(firstItem!.asset.duration))
                event["duration"] = NSNumber(value: duration)
              }
              self.onLoad!(event)
            }
          }
        }
      }
    }
  }
  
  @objc func setSeek(_ val: NSNumber) {
    _audioPlayer?.currentTime = TimeInterval(val.int64Value)
    guard let currentItem = _player?.currentItem else { return }
    let timeScale: Int = 1000
    let cmSeekTime: CMTime = CMTimeMakeWithSeconds(Float64(truncating: val), preferredTimescale: Int32(timeScale))
    let current: CMTime = currentItem.currentTime()
    guard CMTimeCompare(current, cmSeekTime) != 0 else { return }
    
    _player?.seek(to: cmSeekTime)
    
  }
  
  @objc func setRepeat(_ val: Bool) {
    _repeat = val
  }
  
  @objc func setPaused(_ val: Bool) {
    if val {
      _player?.pause()
      _player?.rate = 0.0
      _audioPlayer?.pause()
    } else {
      if _pause != val {
        configureAudio()
      }
      _player?.playImmediately(atRate: 1.0)
      _player?.rate = 1.0
      _audioPlayer?.play()
    }
    
    _pause = val
  }
  
  @objc func setAudioOnly(_ val: Bool) {
    _audioOnly = val
  }
  
  @objc func setMixWithOthers(_ val: Bool) {
    _mixWithOhters = val
  }
  
  @objc func setVolume(_ val: NSNumber?) {
    _volume = val?.floatValue ?? 0
    _player?.volume = _volume
    _audioPlayer?.volume = _volume
  }
  
  @objc func setMuted(_ val: Bool) {
    _player?.isMuted = val
    _audioPlayer?.volume = val ? 0 : _volume
  }
  
  // MARK: Observers
  
  @objc private func playerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      removeItemObserver(item: item!)
    }
    
    let currentIndex = _itemConfigs.firstIndex(where: {$0.asset == item?.asset})
    if (_itemConfigs.indices.contains(currentIndex! + 1)) {
      let nextItem = _itemConfigs[currentIndex! + 1]
      _repeat = nextItem.shouldRepeat
    }
    
    if (_player?.items().last == item) {
      _player?.actionAtItemEnd = .pause
      if onEnd != nil {
        let event = [AnyHashable: Any]()
        onEnd!(event)
      }
    } else {
      if onTransition != nil {
        let event = [AnyHashable: Any]()
        onTransition!(event)
      }
    }
  }
  
  @objc private func loopPlayerItemDidPlayToEnd(_ notification: Notification) {
    let item = notification.object as? AVPlayerItem
    if (item != nil) {
      removeItemObserver(item: item!)
    }
    guard let currentItems = _player?.items() else { return }
    
    if self._repeat {
      let currentIndex = currentItems.firstIndex(of: item!)
      if currentIndex != nil && currentItems.indices.contains(currentIndex! + 1) {
        let playerItem = AVPlayerItem(asset: item!.asset)
        _player?.insert(playerItem, after: currentItems[currentIndex! + 1])
        addLoopItemObserver(item: playerItem)
      }
    } else {
      if onTransition != nil {
        let event = [AnyHashable: Any]()
        onTransition!(event)
      }
      let currentIndex = currentItems.firstIndex(of: item!)
      if currentIndex != nil && currentItems.indices.contains(currentIndex! + 1) {
        let playerItem = currentItems[currentIndex! + 1]
        _player?.remove(playerItem)
        removeItemObserver(item: playerItem)
      }
    }
  }
}
