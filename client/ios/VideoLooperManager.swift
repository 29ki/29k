
@objc (VideoLooperManager)
class VideoLooperManager: RCTViewManager {
 
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
 
  override func view() -> UIView! {
    return VideoLooperView()
  }
 
}
