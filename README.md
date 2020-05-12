# Zuoyou mobile app

Built with Ionic 5, Angular 8.

## Run dev

`ionic serve --live-reload`

## Run dev an Android device

`ionic cordova run android --live-reload`

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
