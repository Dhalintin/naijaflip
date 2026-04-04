import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export const createOrUpdateUser = async (user: any) => {
  if (!user?.uid) {
    throw new Error("User UID is required");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUserData = {
      username: user.displayName || user.email?.split("@")[0] || "Player",
      email: user.email,
      currentLevel: 1,
      points: 0,
      userImage: user.photoURL || "",
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    await setDoc(userRef, newUserData);

    return newUserData;
  } else {
    await setDoc(
      userRef,
      {
        lastLogin: new Date(),

        userImage: user.photoURL || userSnap.data().userImage,
      },
      { merge: true }
    );

    return userSnap.data();
  }
};

/**
 * Update specific fields of a user without overwriting everything
 */
export const updateUserProfile = async (data: {
  uid: string;
  updates: {
    currentLevel?: number;
    points?: number;
  };
}) => {
  const { uid, updates } = data;
  if (!uid) {
    console.error("UID is required to update user profile");
    return;
  }

  try {
    const userRef = doc(db, "users", uid);

    const dataToUpdate: any = {
      ...updates,
    };

    await updateDoc(userRef, dataToUpdate);

    return updates;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const saveGameResult = async (data: {
  userId: string;
  gameLevel: number;
  score: number;
  status: "won" | "lost";
  timeTaken: number;
}) => {
  try {
    const { userId, gameLevel, score, status, timeTaken } = data;
    const statRef = doc(collection(db, "userGameStats"));

    await setDoc(statRef, {
      userId,
      gameLevel,
      score,
      status,
      timeTaken,
      playedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Fetch all game history for a specific user, sorted by most recent first
 */
export const getUserGameHistory = async (userId: string) => {
  try {
    if (!userId) throw new Error("userId is required");

    const q = query(
      collection(db, "userGameStats"),
      where("userId", "==", userId),
      orderBy("playedAt", "desc") // Most recent games first
    );

    const querySnapshot = await getDocs(q);

    const history: any[] = [];

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
        playedAt: doc.data().playedAt?.toDate() || new Date(), // Convert Firestore Timestamp to JS Date
      });
    });

    return history;
  } catch (error: any) {
    console.error("Error fetching user game history:", error);
    throw error;
  }
};
