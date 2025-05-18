import {
  createSchema,
  table,
  string,
  boolean,
  number,
  json,
  relationships,
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
  })
  .primaryKey("id");

const savedChallenges = table("saved_challenges")
  .columns({
    id: string(),
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