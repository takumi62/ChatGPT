# LIFE - Gamified Goal & Habit Tracker (Under Development 🚧)

🚧 **This project is currently under development** 🚧

LIFE is a **goal-setting and habit-tracking mobile application** built with **React Native Expo** and **Firebase**. Incorporating RPG elements, users can **earn experience points (XP)** by achieving their goals and completing daily habits, making productivity more engaging and rewarding.

This project is inspired by [the original developer's project](https://github.com/originaldeveloper/ChatGPT-Clone) while adding new features tailored for structured goal management and habit formation.

![image](https://github.com/user-attachments/assets/f6d35f9d-da2c-4861-9a73-964dac9fa148)


## Features (Including Work in Progress)

### 1. **Goal Setting & Progress Tracking**
- Set long-term **goals** (e.g., "Score 800 on TOEIC").
- Assign **difficulty levels** (1-5 stars) to each goal.
- Track completion progress and **earn XP upon achievement**.

### 2. **Habit Tracking**
- Create **daily or weekly habits** linked to specific goals.
- Assign **colors** to differentiate habits visually.
- Gain XP for each completed habit to maintain motivation.

### 3. **LLM-Powered Goal Breakdown (In Progress)**
- Interact with an **AI assistant** to **break down large goals** into smaller, actionable steps.
- AI helps create structured study plans or task lists based on the user’s objectives.

### 4. **Gamification System (In Progress)**
- Earn XP based on task difficulty.
- Track progress visually with **leveling up mechanics**.
- Celebrate milestones with **rewards and badges**.

### 5. **User Authentication & Data Storage**
- Secure **login and registration** via Firebase.
- User-specific data storage for goals, habits, and progress.

## Prerequisites

Ensure the following tools are installed before setup:

- **Node.js**: Install from [Node.js website](https://nodejs.org) or via a package manager.
- **Expo CLI**: Install globally with:
  
  ```shell
  npm install --global expo-cli
  ```
  
- **Firebase Account**: Create a Firebase project at [Firebase Console](https://firebase.google.com) and enable authentication & Firestore.

## Getting Started

Follow these steps to set up and run LIFE:

### 1. **Clone the repository**
```shell
git clone https://github.com/yourusername/LIFE.git
cd LIFE
```

### 2. **Install dependencies**
```shell
npm install
```

### 3. **Set up Firebase**
- Create a new Firebase project.
- Enable **Authentication** and **Firestore** services.
- Navigate to **Project Settings** in Firebase Console and copy the Firebase configuration.

### 4. **Configure Firebase in the app**
- Update `firebaseHelper.js` with your Firebase configuration values.

### 5. **Start the development server**
```shell
expo start
```

### 6. **Run the app on a device**
- Install **Expo Go** on your iOS or Android device.
- Scan the QR code shown in the terminal to launch the app.

## Technologies Used

LIFE leverages the following technologies:

- **React Native** - Cross-platform mobile app framework.
- **Expo** - Simplifies development & deployment.
- **Firebase** - Authentication and database services.
- **OpenAI LLM** - AI-powered goal breakdown and habit structuring.

## Acknowledgments

This project was inspired by [the original developer’s Chat GPT Clone](https://github.com/originaldeveloper/ChatGPT-Clone). Their work provided the foundation for LIFE, expanding upon AI-powered interactions to enhance **goal achievement and habit formation**.

## Contributing

💡 **This project is currently in development!** 🚀

If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

---

### 🔗 Useful Links:
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API](https://openai.com/research/gpt-3/)

🚀 Let’s gamify productivity and make goal-setting more engaging with LIFE!

