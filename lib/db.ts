import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Curriculum } from "./types";

export async function saveCurriculum(userId: string, curriculum: Curriculum) {
  const strategyRef = doc(db, "strategies", userId);
  const data = {
    ...curriculum,
    timestamp: Date.now()
  };
  await setDoc(strategyRef, data);
  return data;
}

export async function getLatestCurriculum(userId: string): Promise<Curriculum | null> {
  const strategyRef = doc(db, "strategies", userId);
  const snap = await getDoc(strategyRef);
  
  if (snap.exists()) {
    return snap.data() as Curriculum;
  }
  return null;
}