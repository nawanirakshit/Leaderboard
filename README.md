
## Project on how to manage a leaderboard and display score with Top 3 ranks

# Initial Commands
npm start 
cd ios && pod install && cd ..
npx react-native run-ios
npx react-native run-android

# How to chnage package name
npx react-native-rename "App Name" -b "package name/bundle identifier"

# Cleaning ios build
cd ios
pod deintegrate 
pod clean
rm -rf Pods
rm Podfile.lock
pod install
cd ..
npx react-native run-ios

# installing addded libs
cd ios && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..

# For Firebase installation
https://rnfirebase.io

# Icons: 
https://oblador.github.io/react-native-vector-icons/#MaterialIcons