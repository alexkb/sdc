#!/bin/bash

# This script runs a clean build of the app for me.. I dunno why the ios platform is so much
# more difficult to build for than android!

ionic platform rm ios

rm -rf plugins/ platforms/

cordova plugin add cordova-plugin-device
cordova plugin add com.ionic.keyboard
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-console
cordova plugin add cordova-plugin-geolocation

cordova plugin add https://github.com/katzer/cordova-plugin-email-composer.git

ionic platform add ios

ionic build

rm -rf ~/Library/Developer/Xcode/DerivedData

