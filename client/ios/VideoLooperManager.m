#import <React/RCTViewManager.h>
 
@interface RCT_EXTERN_MODULE(VideoLooperManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(paused, BOOL)
RCT_EXPORT_VIEW_PROPERTY(repeat, BOOL)
RCT_EXPORT_VIEW_PROPERTY(sources, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(mutes, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(onStartEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoopEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTransition, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReadyForDisplay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(seek, NSNumber)

@end
