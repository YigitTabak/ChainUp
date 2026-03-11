# ChainUp 

**ChainUp** is a habit-tracking app based on the "don't break the chain" methodology. Users set daily goals, add rings to their chain by completing tasks each day, and unlock a letter they wrote to themselves once the target duration is reached.

---

## How It Works

1. **Set your task** — Enter the habit you want to build and its daily action. Choose how many days it will last.
2. **Write yourself a letter** — Before you start, write a letter to your future self about why this goal matters to you. It stays locked until you complete the chain — giving you a personal reason to keep going.
3. **Do your task every day** — Mark your daily task as done in the dashboard to add a ring to your chain.
4. **Track your progress** — Visit the History page to review your past completions on a calendar view and see which days you stayed consistent.
5. **Complete the chain** — Once all rings are filled, unlock and read your letter.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, CSS Modules
- **Routing:** React Router DOM v7
- **Backend / DB:** Firebase Firestore (realtime subscriptions)
- **Auth:** Firebase Authentication (Google Sign-In)
- **Build:** Vite 7
- **Linting:** ESLint + typescript-eslint

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ChainUp.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication**  Sign-in method  **Google**.
3. Create a **Firestore Database**.
4. Add a web app in your project settings and copy the configuration values.

### 4. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 6. Start the development server

```bash
npm run dev
```


---


## License

MIT
