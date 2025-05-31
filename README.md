# 📱 StudyBuddy Mobile

### Study smarter, together — on the go!

**StudyBuddy Mobile** is the React Native version of the StudyBuddy web app, allowing QUT students to create and join collaborative study sessions, comment, and explore university events — all from their phones.

This app was developed by **Angus Wong** as part of the assessment for **IFN666 Web and Mobile Application Development** at the **Queensland University of Technology**.

🔗 Visit the web version: [https://n11941073.ifn666.com/StudyBuddy](https://n11941073.ifn666.com/StudyBuddy)

---

## ⚙️ Setup Instructions

This project uses **Expo** and **React Native** with **React Native Paper** for Material Design theming.

### 1. Clone the repository

```bash
git clone https://github.com/wongy123/StudyBuddyMobile.git
cd StudyBuddyMobile
```

### 2. Install dependencies

Make sure you have [Node.js](https://nodejs.org/) and the [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally:

```bash
npm install
```

### 3. Configure environment

The app is currently configured to connect to the deployed backend at:

```
https://n11941073.ifn666.com/StudyBuddy
```

You can change this in `@constants/api.js` if needed:

```js
export const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";
```

If testing locally, be sure to point to your local network IP instead.

### 4. Run the app

```bash
npx expo start
```

* Use the QR code to run the app on a physical device with the **Expo Go** app.
* Or run it in an Android/iOS simulator via the Expo CLI.

---

## 📦 Features

* 🔐 **JWT Authentication**
* 👥 **Role-Based Access Control**
* 📆 **Create, join, and manage study sessions**
* 💬 **Commenting and moderation**
* 🏛️ **QUT event listings**
* 🔔 **Push Notifications**
* 🌙 **Dark Theme** using React Native Paper
* ✅ **Offline-friendly UX and loading states**

---

## 🧪 Testing Notes

* **Ensure backend API is running** (locally or remotely).
* **Authentication is required** to access most features. The app will redirect unauthenticated users to the login screen.
* Push notifications are not available in Expo Go.  
* Deep linking on Android can be enabled in Android Settings -> Apps -> StudyBuddy -> Open by default -> In the app, and select Links to open in this app

---

Feel free to contribute or fork the repo. This project is a work in progress and part of ongoing learning.

Happy studying! 🎓📚
