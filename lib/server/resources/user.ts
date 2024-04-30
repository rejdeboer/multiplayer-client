import type { ResourceType, UserCreate } from "../types";
import { ApiResource } from "./base";

export class Users extends ApiResource {
  static readonly TYPE: ResourceType = "user";

  async create(
    resource: UserCreate,
  ): Promise<void> {
    return this.resources.post<UserCreate, void>(
      Users.TYPE,
      resource,
    );
  }
}
