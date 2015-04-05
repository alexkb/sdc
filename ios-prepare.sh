#!/bin/bash

# This script runs a clean build of the app for me.. I dunno why the ios platform is so much
# more difficult to build for than android!

ionic platform rm ios

rm -rf plugins/ platforms/ www/

mkdir www

cordova plugin add com.ionic.keyboard org.apache.cordova.device org.apache.cordova.statusbar \
org.apache.cordova.inappbrowser org.apache.cordova.console org.apache.cordova.geolocation

cordova plugin add https://github.com/katzer/cordova-plugin-email-composer.git

ionic platform add ios

grunt build

cordova build

rm -rf ~/Library/Developer/Xcode/DerivedData

