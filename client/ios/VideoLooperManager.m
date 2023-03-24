#import <React/RCTViewManager.h>
 
@interface RCT_EXTERN_MODULE(VideoLooperManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(paused, BOOL)
RCT_EXPORT_VIEW_PROPERTY(repeat, BOOL)
RCT_EXPORT_VIEW_PROPERTY(volume, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(sources, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTransition, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReadyForDisplay, RCTDirectEventBlock)

@end
