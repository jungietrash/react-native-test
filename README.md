# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

🚀 Deploying to Expo Go
Follow these steps to publish your project to the Expo cloud, allowing you to access your app from anywhere via Expo Go without needing your development computer running.

1. Install the EAS CLI
   EAS (Expo Application Services) is the modern ecosystem for handling Expo deployments and builds. Run this command to install it globally:

Bash
npm install -g eas-cli 2. Configure the Project
You must link your local code to a project on your Expo dashboard. Run the initialization command:

Bash
eas project:init
Note: Follow the terminal prompts to select your account and give your project a name (e.g., "pocket-manager").

3. Deploy via EAS Update
   To bundle your JavaScript and make the app accessible from the cloud, execute the following sequence:

Bash

# Export the project locally

npx expo export

# Log in to your Expo account (if not already logged in)

npx expo login

# Publish the update to the production branch

eas update --branch production --message "Initial deployment"

4. How to View Your Deployed App
   Once the update is successful, your code is live on Expo's servers. You no longer need your terminal or computer to run the app.

Open Expo Go: Launch the app on your iOS or Android device.

Authentication: Ensure you are logged into the same Expo account on your phone as you used in the terminal.

Locate Project:

Tap on the Projects tab.

Look for your project name under "Recent Projects" or "Published Projects."

Launch: Tap the project tile to boot your app!

💡 Pro-Tip: Sharing with Others
To share your progress with a friend or teammate:

Go to your Expo Dashboard.

Select your project and find the Deployment QR Code.

Anyone with the Expo Go app can scan that code to view your live app instantly.
