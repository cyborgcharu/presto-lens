// RNShakeEvent.m
#import "RNShakeEvent.h"
#import <React/RCTUtils.h>

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
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleShakeEvent)
                                                 name:RCTShowDevMenuNotification
                                               object:nil];
}

- (void)stopObserving {
    self.hasListeners = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
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
    });
}

RCT_EXPORT_METHOD(disable) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].applicationSupportsShakeToEdit = NO;
    });
}

@end