// RNShakeEvent.h
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNShakeEvent : RCTEventEmitter <RCTBridgeModule>
@property (nonatomic, assign) BOOL hasListeners;
@end