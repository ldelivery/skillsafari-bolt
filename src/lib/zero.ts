import { createZero } from "@rocicorp/zero";
import { definePermissions, ANYONE_CAN, type PermissionsConfig } from "@rocicorp/zero";
import { schema, type Schema } from "./schema";

// The contents of your decoded JWT.
type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  return {
    settings: {
      row: {
        select: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: ANYONE_CAN,
        delete: ANYONE_CAN,
      },
    },
    activeChallenge: {
      row: {
        select: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: ANYONE_CAN,
        delete: ANYONE_CAN,
      },
    },
    savedChallenges: {
      row: {
        select: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: ANYONE_CAN,
        delete: ANYONE_CAN,
      },
    },
    challenges: {
      row: {
        select: ANYONE_CAN,
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});

export const zero = createZero({
  schema,
  permissions,
  authHandler: {
    auth: () => ({ sub: null }),
  },
});

export const { startChallenge, toggleStep, toggleMaterial, endChallenge, setLanguage, toggleSavedChallenge } = zero.mutations;