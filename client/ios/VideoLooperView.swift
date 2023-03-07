import AVFoundation
import AVKit
import UIKit
import Foundation
import React

class VideoLooperView: RCTView {

  private var _playerLayer: AVPlayerLayer?
  private var _player: AVQueuePlayer?
  private var _loopPlayerItem: AVPlayerItem?
  private var _endPlayerItem: AVPlayerItem?
  private var _startAsset: AVAsset?
  private var _endAsset: AVAsset?
  private var _repeat: Bool = true
  private var _pause: Bool = true
  
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
    self.removePlayerLayer()
  }
  
  func removePlayerLayer() {
    _playerLayer?.removeFromSuperlayer()
    _playerLayer = nil
  }
 
  private func setupView() {
    _player = AVQueuePlayer()
    _playerLayer = AVPlayerLayer(player: _player!)
    
    guard let playerLayer = _playerLayer else { fatalError("Error creating player layer") }
    playerLayer.videoGravity = AVLayerVideoGravity(rawValue: "cover")
    playerLayer.frame = self.layer.bounds
    self.layer.addSublayer(playerLayer)
  }
  
  private func addItemObservers() {
    guard let items = self._player?.items() else { return }
    self.removeItemObservers()
    for item in items {
      NotificationCenter.default.addObserver(self, selector: #selector(playerItemDidPlayToEnd), name: .AVPlayerItemDidPlayToEndTime, object: item)
    }
  }
  
  private func removeItemObservers() {
    guard let items = self._player?.items() else { return }
    for item in items {
      NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: item)
    }
  }
  
  private func addEndItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.addObserver(self, selector: #selector(endPlayerItemDidPlayToEnd), name: .AVPlayerItemDidPlayToEndTime, object: item)
    item.addObserver(self, forKeyPath: #keyPath(AVPlayerItem.status), context: &playerItemContext)
  }
  
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
          
          let event = [AnyHashable: Any]()
          onTransition!(event)
        }
      default:
        return
      }
    }
  }
  
  private func removeItemObserver(item: AVPlayerItem) {
    NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: item)
  }
  
  @objc func setLoopSource(_ val: NSString) {
    print("SET LOOP")
    let loopAsset = AVAsset(url: URL(string: val as String)!)
    loopAsset.loadValuesAsynchronously(forKeys: ["duration", "playable"]) {
      DispatchQueue.main.async {
        self._loopPlayerItem = AVPlayerItem(asset: loopAsset)
        self._player?.insert(self._loopPlayerItem!, after: nil)
        self._player?.insert(AVPlayerItem(asset: loopAsset), after: self._loopPlayerItem!)
        self.addItemObservers()
        
        if self.onReadyForDisplay != nil {
          let event = [AnyHashable: Any]()
          self.onReadyForDisplay!(event)
        }
        
        self._player?.play()
      }
    }
  }
  
  @objc func setStartSource(_ val: NSString) {
    let endAsset = AVAsset(url: URL(string: val as String)!)
    endAsset.loadValuesAsynchronously(forKeys: ["duration", "playable"]) {
      DispatchQueue.main.async {
        self._startAsset = endAsset
      }
    }
  }
  
  @objc func setEndSource(_ val: NSString) {
    print("SET END")
    let endAsset = AVAsset(url: URL(string: val as String)!)
    endAsset.loadValuesAsynchronously(forKeys: ["duration", "playable"]) {
      DispatchQueue.main.async {
        self._endAsset = endAsset
      }
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
  
  @objc var onLoopEnd: RCTDirectEventBlock?
  @objc var onEnd: RCTDirectEventBlock?
  @objc var onTransition: RCTDirectEventBlock?
  @objc var onReadyForDisplay: RCTDirectEventBlock?
  
  @objc private func playerItemDidPlayToEnd(_ notification: Notification) {
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
      self.addItemObservers()
    } else if self._endAsset != nil {
      self.removeItemObservers()
      
      let endItem = AVPlayerItem(asset: self._endAsset!)
      self.addEndItemObserver(item: endItem)
      self._player?.insert(endItem, after: lastItem)
    }
  }
  
  @objc private func endPlayerItemDidPlayToEnd(_ notification: Notification) {
    if onEnd == nil {
      return
    }
    let event = [AnyHashable: Any]()
    onEnd!(event)
  }
}
