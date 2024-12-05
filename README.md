# Introduction
This project aims to provide a cross-platform mobile application to facilitate the purchasing of memberships, reserve sports complexes' spots due to a limited amount of space, and reduce entrance queue time. It is built using React Native and Expo for the front end, so a single base was needed for both Android and iOS.

## Key Features:
1. Authentication and User Accounts: Integration with **Firebase** for user authentication, user data management, and cloud functions.
2. QR Code Scanning: Validation of reservations at the entrance using the built-in feature.
3. Live Data: Receive live data about places using **Firestore**.
4. Form Validation: Users can fill out forms with dynamic inputs that are validated using Yup for form validation.
5. Efficient search: The app integrates with Algolia search service using react-instantsearch-native, allowing users to perform fast and relevant searches.
6. Seamless UI and UX Design: The app features intuitive navigation using React Navigation and React Native Paper is used to style the app with Material Design components.

## Technologies Used:
- **React Native** for building cross-platform mobile apps.
- **Expo** for development, testing, and deployment.
- **Firebase** for cloud-based services and authentication.
- **Algolia** for fast and effective search functionality.
- **Axios** for making HTTP requests.
- **React Navigation** for managing the app's navigation and routing.
