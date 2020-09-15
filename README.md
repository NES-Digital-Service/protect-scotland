# Scotland COVID Tracker

## Table of Contents

0. [Context](#context)
1. [Getting Started](#getting-started)
2. [Setup to run the application on a real iPhone](#setup-to-run-the-application-on-a-real-iPhone)
3. [Setup to simulate the application on an iPhone](#setup-to-simulate-the-application-on-an-iphone)
4. [Setup to run the application on a real Android](#setup-to-run-the-application-on-a-real-android)
5. [Setup to emulate the application on an Android](#setup-to-emulate-the-application-on-an-android)
6. [Running the applications locally](#running-the-applications-locally)
7. [E2E Testing](#e2e-testing)

## Context
The COVID tracker application works with a series of other systems, and is indicated by the yellow box 'app' on the Citizen's mobile phone:

![COVID tracker in context](https://github.com/NES-Digital-Service/protect-scotland/blob/master/app_context.png)

The system described as the nearform app back end is shown here:

![COVID tracker app back end](https://github.com/NES-Digital-Service/protect-scotland/blob/master/app_server_side.png)

## Getting Started

Following these instructions will allow you to run and build the project on your local machine for development and testing purposes.

### Prerequisites

Follow the official guide "[Setting up the development environment](https://reactnative.dev/docs/environment-setup)" to set up your local machine to develop iOS and Android applications with React Native.

Install an xCode version that supports iOS 13.5, required by the [ExposureNotification framework](https://developer.apple.com/documentation/exposurenotification) used by the app.

Install `yarn` globally:

```bash
npm install -g yarn
```

For other installation methods, follow the official [Installation guide](https://classic.yarnpkg.com/en/docs/install).

### Installing

Clone this repository.

Install the npm dependencies:

```bash
yarn install
```

Create your `.env` file or copy it from the `.env.sample`:

```bash
cp .env.sample .env
```

Obtain the following env values from devops:

- SAFETYNET_KEY Only required if testing on an Android device or emulator
- TEST_TOKEN Only required if testing on an iOS simulator

Note: `.env` vars can be cached by gradlew and metro. If changes are not picked up then clean these caches with:

```
cd android && ./gradlew clean
yarn start --reset-cache
```

Move to `ios/` folder and install the CocoaPods dependencies:

```bash
cd ios && pod install
```

## Setup to run the application on a real iPhone

TODO

## Setup to simulate the application on an iPhone

Assuming you are on a Mac this should work out of the box. Just run `yarn ios`

### Common issues

**Network errors**

Ensure that `TEST_TOKEN` is populated in `.env`

## Setup to run the application on a real Android

- Turn on USB debugging on your android device
- Connect the device via USB and select USB debugging on the device
- Run: `yarn android`

## Setup to emulate the application on an Android

This guide assumes you are on a Mac

- [Install jenv](https://github.com/jenv/jenv) so that multiple Java versions can be managed

        brew install jenv
        jenv enable-plugin export

- Install version 11 of Java. Version 11 is the last LTS version that will work. Does not work with version 14.

        brew cask install AdoptOpenJDK/openjdk/adoptopenjdk11
        jenv global 11.0.2

- Install [Android Studio](https://developer.android.com/studio/index.html)
- After installation, click Configure (bottom right of splash) -> SDK manager
- Select 'Show Package Details' checkbox
- Deselect everything except:
  - Android 10.0 (Q)-> Android SDK Platform 29
  - Android 10.0 (Q)-> Sources for Android 29
  - Android 10.0 (Q)-> Intel x86 Atom_64 System image
  - Android 10.0 (Q)-> Google Play Intel x86 Atom System Image
- Click the ‘SDK tools’ tab (Towards the top)
- Select 'Show Package Details' checkbox
- Deselect everything except:
  - Android SDK Build-Tools -> 29.0.2
  - NDK (Side by Side) -> 21.0.6113669
  - Android Emulator
  - Android SDK Platform-tools
  - Intel x86 Emulator Accelerator (HAXM installer)
- Click 'Apply'

- Edit bash profile to include new paths:

        export ANDROID_HOME=$HOME/Library/Android/sdk
        export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
        export ANDROID_AVD_HOME=$HOME/.android/avd
        export PATH=$PATH:$ANDROID_HOME/emulator
        export PATH=$PATH:$ANDROID_HOME/tools
        export PATH=$PATH:$ANDROID_HOME/tools/bin
        export PATH=$PATH:$ANDROID_HOME/platform-tools
        export PATH="$HOME/.jenv/bin:$PATH"
        eval "$(jenv init -)"

- Run: `yarn android`

### Common issues

**INSTALL_FAILED_INSUFFICIENT_STORAGE error message when running `yarn android`**

Close the emulated android and run `emulator -list-avds` to get your device name. Then `emulator YOUR_DEVICE_NAME -no-snapshot-load`

**App crashes as soon as it loads**

The emulated device may be corrupt. This can happen on initial installation.

- Create a dummy project in Android Studio and then selecting 'Open AVD Manager' from the 'running devices' menu. Then selecting 'Delete' from the devices menu.
- Click 'Create Virtual Device' to add a new device.

**Emulated device does not open**

If you have a real android plugged in then the app will run there automatically. It is possible to run on both by opening the emulated device first by creating a dummy project in Android Studio and then selecting 'Open AVD Manager' from the 'running devices' menu. Then selecting 'Launch' (Play icon) on the device. Alternatively, follow the instructions below to use a custom DNS.

**Network issues**

These can have 2 known causes. Both have the same error message in the terminal - `Error registering device: [Error: Network Unavailable] object Network Unavailable`. Both are triggered when accepting the terms and conditions in the app.

The first is caused by a missing `SAFETYNET_KEY` in `.env`.

The second is a problem with the emulator being unable to reach the internet. The easiest solution to this is to start the emulator manually with a specified DNS before running `yarn android`. First use `emulator -list-avds` to get your device name. Then `emulator -avd YOUR_DEVICE_NAME -dns-server 8.8.8.8`. This will use the Google DNS.

[More command line options for the emulator](https://developer.android.com/studio/run/emulator-commandline#startup-options)

**Cleaning Cache**

Changes to the `./android` folder can require cleaning the gradle cache. Do so with `cd android && ./gradlew clean`

## Running the applications locally

Start the React Native bundler:

```bash
yarn start
```

To start the Android application, run:

```bash
yarn android
```

To start the iOS one, run:

```bash
yarn ios
```

## Creating a test/beta build

### Install fastlane

```bash
bundle install
```

### Build for iOS

In order to build, sign, and upload your app to TestFlight, you need to have configured a provisioning profile (with the Exposure Notification entitlement) and added a signing key to your Keychain.

Copy and then customize the dotenv file with your developer account information:

```bash
cd ios
cp .env.default.sample .env.default
```

Use fastlane to build the app and upload it to TestFlight:

```bash
cd ios
fastlane beta
```

This command will increment the build number. It will not change the app version. That must be done in the project settings manually.

### Build for Android

In order to build, sign, and upload your app to an internal test track, you need to have configured an app in the Play console that has been enabled for the Exposure Notification API, and installed an upload key and API access key locally. You will also need to know the keystore and key passwords.

Copy and then customize the dotenv file with your signing information:

```bash
cd android
cp .env.default.sample .env.default
```

Use fastlane to build the app and push it to a draft Internal Test Track:

```bash
cd android
fastlane internal
```

This command will increment the build number. It will not change the app version. That must be done in the project settings manually.

## E2E Testing

Application is using [Detox](https://github.com/wix/detox/) to run E2E testing. Check the [Getting Started](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md) section for details of how to setup Detox locally.

Before running the tests, make sure your Metro server is running:

```sh
yarn start
```

#### iOS

To run the tests on iOS, you'll need an **iPhone 11 Pro Max** simulator and to install the utils for Apple simulators (see [Detox getting started docs](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md#step-1-install-dependencies))

```sh
brew tap wix/brew
brew install applesimutils
```

Running the tests

```sh
yarn test:e2e:ios
```

#### Android

TODO
