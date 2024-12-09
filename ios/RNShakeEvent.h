// RNShakeEvent.h
#import "RNShakeEvent.h"
#import <React/RCTUtils.h>
#import <React/RCTDevMenu.h>

@implementation RNShakeEvent

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        self.hasListeners = NO;
        
        // Make this view controller receive shake events
        [UIApplication sharedApplication].applicationSupportsShakeToEdit = YES;
    }
    return self;
}

- (void)startObserving {
    self.hasListeners = YES;
    // Instead of using RCTShowDevMenuNotification directly, we observe motion events
    [self becomeFirstResponder];
}

- (void)stopObserving {
    self.hasListeners = NO;
    [self resignFirstResponder];
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}

- (void)motionEnded:(UIEventSubtype)motion withEvent:(UIEvent *)event {
    if (motion == UIEventSubtypeMotionShake) {
        [self handleShakeEvent];
    }
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"ShakeEvent"];
}

- (void)handleShakeEvent {
    if (self.hasListeners) {
        [self sendEventWithName:@"ShakeEvent" body:@{}];
    }
}

// Override the shake event handling
RCT_EXPORT_METHOD(enable) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].applicationSupportsShakeToEdit = YES;
        [self becomeFirstResponder];
    });
}

RCT_EXPORT_METHOD(disable) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].applicationSupportsShakeToEdit = NO;
        [self resignFirstResponder];
    });
}

@end
