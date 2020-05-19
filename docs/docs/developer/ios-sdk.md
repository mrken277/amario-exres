---
id: ios-sdk
title: iOS SDK
sidebar_label: iOS SDK
---

Learn how to install the iOS SDK.

<!--Content-->

## Requirement

+ Minimum deployment target : iOS 9.0
+ Swift 5 compatible
+ Objective-C compatible

brandCode - uniquely generated code for your brand which you can find in your messenger installation code

## Installation with Swift

Following configuration should be made in your AppDelegate.swift.

```swift
import ErxesSDK
```

### For Open Source Version:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    Erxes.setup(erxesApiUrl: "erxesApiUrl", brandId: "brandCode" )
 return true
}
```

### For SaaS Version:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    Erxes.setupSaas(companyName: "companyName", brandId: "brandCode")
 return true
}
```

#### NEXT

### To start Erxes SDK in your app:
```swift
import ErxesSDK
```

##### This function will start Erxes SDK with authentication options:
```swift
@ibaction func buttonAction(sender:Uibutton){
	Erxes.start()
}
```

##### To end current user session:
```swift
 Erxes.endSession(completionHandler: {
            // do your stuff
})
```
##### Or simply
```swift
Erxes.endSession()
```

## Installation with Objective-C

Following configuration should be made in your AppDelegate.m basic properties.

```smalltalk
#import <ErxesSDK/ErxesSDK-Swift.h>
```

### For Open Source Version:
```smalltalk
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [Erxes setupWithErxesApiUrl:@"erxesApiUrl" brandId:@"brandCode"];;
    return YES;
}
```

### For SaaS Version:
```smalltalk
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [Erxes setupSaasWithCompanyName:@"comanyName" brandId:@"brandCode"];
    return YES;
}
```

#### NEXT
### To start erxes SDK in your app:
```smalltalk
#import <ErxesSDK/ErxesSDK-Swift.h>
```

##### This function will start erxes SDK with authentication options:
```smalltalk
- (IBAction)buttonAction:(id)sender {
    [Erxes start];
}
```


##### To end current user session: 
```smalltalk
[Erxes endSessionWithCompletionHandler:^{
        // do your stuff
}];
```

<!--Content-->
