import type { QueryParams } from "../resource";
import type { ResourceType, DocumentCreate, Document } from "../types";
import { ApiResource } from "./base";

export class Documents extends ApiResource {
  static readonly TYPE: ResourceType = "document";

  async create(
    resource: DocumentCreate,
  ): Promise<void> {
    return this.resources.post<DocumentCreate, void>(
      Documents.TYPE,
      resource,
    );
  }

  async list(params?: QueryParams): Promise<Document[]> {
    return this.resources.get(Documents.TYPE, params)
  }
}
