# Zuoyou mobile app

Built with Ionic 5, Angular 8.

## Installation

### Basic install
Install nvm (which installs nodejs and npm).
Install also ionic CLI

```shell script
npm i -g @ionic/cli
```

### Android install

To run the app on a native Android device, you need to install few more librairies.
Follow the [instructions](https://ionicframework.com/docs/developing/android) of Ionic.
You need to install Android Studio to get the Android SDK. To install, you can run 
the following command. The default settings during installation are fine.
```shell script
# To uncompress
sudo tar -xzvf <android_studio_********.tar.gz> -C /usr/local/

# To launch and install the Android SdK
/usr/local/android-studio/bin/studio.sh
```

The Android SDK is located in `~/Android/Sdk/`. In the `.bashrc` :
```shell script
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export ANDROID_HOME=$HOME/Android/Sdk
# avdmanager, sdkmanager
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
# adb, logcat
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
# emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
```

To accept licences, [follow those instructions](https://github.com/ionic-team/ionic-cli/issues/1726#issuecomment-279164447).
Run Android Studio, go to _Parameters > Android SDK > Untick lastest > Apply > Tick latest > Apply > Accept licences_.

Finally, you need to install cordova, native-run and gradle :
```shell script
npm i -g native-run
npm i -g cordova
sudo apt install gradle
```

## Run dev

```shell script
ionic serve --live-reload
```

## Run dev an Android device

After plugging the Android phone, and allowing the file transfer :
```shell script
ionic cordova run android --live-reload
```

You can check if the phone is correctly connected with `adb devices`.

## Compile APK

For Android, use debug to install without signing the APK.

```shell script
ionic cordova build android --prod --debug
```

Use `--release`, then sign to put in an app marketplace.

## CI

The `.gitlab-ci.yml` is correctly configured for an Android SDK 28
build. It builds the app APK file and sends it to a Slack channel.

The Docker image used is a custom image defined in the `Dockerfile` in the root of this repo.
When doing any changes to it, to push it to the Docker HUB repo, do the following :

```shell script
docker tag ionic-build rhidra/ionic-build
docker push rhidra/ionic-build
```
