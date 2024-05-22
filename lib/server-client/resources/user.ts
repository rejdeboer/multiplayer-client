import type { SearchParams } from "../resource";
import type { ResourceType, UserCreate, UserListItem } from "../types";
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

  async search(
    params: SearchParams
  ): Promise<UserListItem[]> {
    return this.resources.get<UserListItem[]>(
      `${Users.TYPE}/search`,
      params
    );
  }
}
