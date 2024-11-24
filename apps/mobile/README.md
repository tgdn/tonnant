# Mobile app

## Running

You can build a development build to be run either on a simulator with `pnpm run:ios`, or on a device with `pnpm run:io -- --device`.

You can rebuild a clean version of the `/ios` folder by running `pnpm prebuild-clean` which runs `expo prebuild --clean` within the mobile workspace.

**Troubleshooting issues when testing on a device**
Sometimes running the app on a device won't work. Stop the running command (`pnpm run:ios -- --device`) and run `pnpm dev`, kill the app on the device and restart it manually.

You may have to enter the server's url shown in the cli. It looks like `192.168.1.146:8081`.
