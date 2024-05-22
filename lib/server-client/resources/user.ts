import { QueryParams } from "../resource";
import type { ResourceType, UserCreate, UserListItem } from "../types";
import { ApiResource } from "./base";

export type SearchUsersParams = QueryParams & {
  query: string
}

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
    params: SearchUsersParams
  ): Promise<UserListItem[]> {
    return this.resources.get<UserListItem[]>(
      `${Users.TYPE}/search`,
      params
    );
  }
}
