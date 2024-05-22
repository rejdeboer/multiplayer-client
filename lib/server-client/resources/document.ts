import type { QueryParams, SearchParams } from "../resource";
import type { ResourceType, DocumentCreate, Document, DocumentContributorCreate } from "../types";
import { ApiResource } from "./base";

export class Documents extends ApiResource {
  static readonly TYPE: ResourceType = "document";

  async create(
    resource: DocumentCreate,
  ): Promise<Document> {
    return this.resources.post<DocumentCreate, Document>(
      Documents.TYPE,
      resource,
    );
  }

  async list(params?: QueryParams): Promise<Document[]> {
    return this.resources.get(Documents.TYPE, params)
  }

  async delete(id: string): Promise<void> {
    return this.resources.delete(Documents.TYPE, id)
  }

  // TODO: Implement document search functionality
  async search(
    params: SearchParams
  ): Promise<Document[]> {
    throw new Error("TODO")
  }

  async addContributor(documentId: string, resource: DocumentContributorCreate): Promise<void> {
    return this.resources.post<DocumentContributorCreate, void>(
      `${Documents.TYPE}/${documentId}/contributor`,
      resource,
    )
  }
}
