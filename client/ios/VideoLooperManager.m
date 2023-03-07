#import <React/RCTViewManager.h>
 
@interface RCT_EXTERN_MODULE(VideoLooperManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(paused, BOOL)
RCT_EXPORT_VIEW_PROPERTY(repeat, BOOL)
RCT_EXPORT_VIEW_PROPERTY(sources, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(loopSource, NSString);
RCT_EXPORT_VIEW_PROPERTY(startSource, NSString);
RCT_EXPORT_VIEW_PROPERTY(endSource, NSString);
RCT_EXPORT_VIEW_PROPERTY(onLoopEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTransition, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReadyForDisplay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(seek, NSNumber)

@end
