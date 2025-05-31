# IFN666_25se1 Assessment 03 Submission

**Student name:**  Man Shing (Angus) Wong

**Student ID:** n11941073

# Response to marking criteria

## Core: Development workflow (3 marks)

- **One line description:** Developed mobile application in React Native using Expo with Expo Router.
- **Video timestamp:** 00:00
- **Relevant files**
   - app
   - src

## Core: Core functionality (3 marks)

- **One line description:** Recreated most of the functionality from the web app except Admin and Mod RBAC, in their place additional features such as notifications and profile pictures were added.
- **Video timestamp:** 00:05
- **Relevant files**
   - app
   - src

## Core: User interface design (3 marks)

- **One line description:** Designed application with consistent theming and colours, intuitive UX, and various navigation methods including Tab Navigators and Stack Navigators.
- **Video timestamp:** 00:05
- **Relevant files**
   - app/(tabs)/_layout.jsx
   - app/(tabs)/(home)/_layout.jsx

## Core: API integration (3 marks)

- **One line description:** Fully integrated with REST API for StudyBuddy, available at https://n11941073.ifn666.com/StudyBuddy/api/
- **Video timestamp:** 04:20
- **Relevant files**
   - src/constants/api.js

## Additional: Device notifications (3 marks)

- **One line description:** Notifications scheduled for 24 hours before a joined event is due to start.
- **Video timestamp:** 02:22
- **Relevant files**
   - src/utils/notification.js
   - app/_layout.jsx

## Additional: Linking (3 marks)

- **One line description:** On Android,navigating to web url will redirect to app instead.
- **Video timestamp:** 01:39
- **Relevant files**
   - app/_linking.jsx
   - app.json

## Additional: Camera (3 marks)

- **One line description:** Modified REST API to accept image uploads, allowing users to upload profile pictures.
- **Video timestamp:** 02:39
- **Relevant files**
   - app/(tabs)/my_profile/index.jsx

## Additional: Share (3 marks)

- **One line description:** When share button is pressed, study session details can be shared with a link to the session page.
- **Video timestamp:** 01:23
- **Relevant files**
   - app/(tabs)/(home)/study_session/[id].jsx
