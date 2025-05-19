# Leaderboard
Login Create your team and update score and thats it.
Demo project on how to manage a leaderboard and display score with Top 3 ranks

## App Demonstration
https://github.com/user-attachments/assets/a23c2b73-ce6b-4324-920b-461778a52a68

Development Language: React Native

Backend: Firebase(Realtime DB, Authentication)


# Initial Commands on how to run the project
npm start

cd ios && pod install && cd ..

## To Run on iOS
npx react-native run-ios

## To Run on Android
npx react-native run-android


# How to chnage package and app name
Install following package

npm i react-native-rename


Update details

npx react-native-rename "App Name" -b "package name/bundle identifier"

# Cleaning ios build
cd ios && pod deintegrate && pod clean && rm -rf Pods && rm Podfile.lock && pod install && cd ..

npx react-native run-ios


# installing addded libs
cd ios && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..

# For Firebase installation
https://rnfirebase.io

# Icons
https://oblador.github.io/react-native-vector-icons/#MaterialIcons
