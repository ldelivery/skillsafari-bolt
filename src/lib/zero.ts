import { Zero } from '@rocicorp/zero';
import { schema, type Schema } from './schema';

export type Challenge = {
  id: string;
  title: {
    en: string;
    de: string;
  };
  category: string;
  duration: string;
  age: string;
  description: {
    en: string;
    de: string;
  };
  icon: any;
  materials: {
    en: string[];
    de: string[];
  };
  steps: {
    en: string[];
    de: string[];
  };
  benefits: {
    en: string[];
    de: string[];
  };
};

export type ActiveChallenge = Challenge & {
  startTime: number;
  completedSteps: boolean[];
  completedMaterials: boolean[];
};

// Initialize Zero with explicit configuration
export const zero = new Zero<Schema>({
  userID: 'default-user',
  auth: import.meta.env.ZERO_AUTH_SECRET,
  serverURL: "https://skillsafari-zero-cache.fly.dev",
  schemaVersion: "1",
  schema,
  kvStore: "idb",
});

// Actions
export const setLanguage = async (language: 'en' | 'de') => {
  await zero.mutate.settings.upsert({
    id: 'user-settings',
    language,
  });
};

export const startChallenge = async (challenge: Challenge) => {
  await zero.mutate.activeChallenge.upsert({
    id: challenge.id,
    challenge: JSON.stringify(challenge),
    startTime: Date.now(),
    completedSteps: new Array(challenge.steps.en.length).fill(false),
    completedMaterials: new Array(challenge.materials.en.length).fill(false),
  });
};

export const toggleStep = async (challengeId: string, index: number, completedSteps: boolean[]) => {
  await zero.mutate.activeChallenge.update({
    id: challengeId,
    completedSteps: completedSteps.map((step, i) => i === index ? !step : step),
  });
};

export const toggleMaterial = async (challengeId: string, index: number, completedMaterials: boolean[]) => {
  await zero.mutate.activeChallenge.update({
    id: challengeId,
    completedMaterials: completedMaterials.map((material, i) => i === index ? !material : material),
  });
};

export const endChallenge = async (challengeId: string) => {
  await zero.mutate.activeChallenge.delete({
    id: challengeId,
  });
};

export const toggleSavedChallenge = async (challengeId: string, savedChallenges: string[]) => {
  const isAlreadySaved = savedChallenges.includes(challengeId);
  
  if (isAlreadySaved) {
    await zero.mutate.savedChallenges.delete({
      id: challengeId,
    });
  } else {
    await zero.mutate.savedChallenges.insert({
      id: challengeId,
      savedAt: Date.now(),
    });
  }
};