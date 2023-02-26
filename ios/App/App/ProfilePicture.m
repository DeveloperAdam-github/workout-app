#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>
CAP_PLUGIN(ProfilePicture, "ProfilePicture",
           CAP_PLUGIN_METHOD(getProfilePicture, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(authorizeContacts, CAPPluginReturnPromise);
           )
