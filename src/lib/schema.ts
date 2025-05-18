import {
  createSchema,
  definePermissions,
  ExpressionBuilder,
  Row,
  ANYONE_CAN,
  table,
  string,
  boolean,
  number,
  json,
  relationships,
  PermissionsConfig,
} from "@rocicorp/zero";

const settings = table("settings")
  .columns({
    id: string(),
    language: string(),
  })
  .primaryKey("id");

const activeChallenge = table("active_challenges")
  .columns({
    id: string(),
    //challenge: string(), // JSON stringified challenge
    //startTime: number(),
    //completed_steps: json(), // boolean[]
    //completed_materials: json(), // boolean[]
  })
  .primaryKey("id");

const savedChallenges = table("saved_challenges")
  .columns({
    id: string(),
    //savedAt: number(),
  })
  .primaryKey("id");

const challenges = table("challenges")
  .columns({
    id: string(),
    language_code: string(),
    title: string(),
    description: string(),
    cta: string().optional(),
    time_estimate_minutes: number(),
    status: string(),
    version: number(),
    progress_percentage: number(),
    categories: json(), // string[]
    environments: json(), // string[]
    age_groups: json(), // string[]
    steps: json(), // {title: string, description: string, image_url: string}[]
    materials: json(), // {name: string, quantity: string, image_url: string}[]
  })
  .primaryKey("id", "language_code");

export const schema = createSchema({
  tables: [
    settings,
    activeChallenge,
    savedChallenges,
    challenges
  ],
  relationships: [],
});

export type Schema = typeof schema;

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