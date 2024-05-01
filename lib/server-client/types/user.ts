import type { ResourceCreate } from "./base";

export type UserCreate = ResourceCreate & {
  email: string,
  username: string,
  password: string,
};
