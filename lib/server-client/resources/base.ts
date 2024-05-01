import type { ResourceAdapter } from "../resource";

export abstract class ApiResource {
  protected resources: ResourceAdapter;

  constructor(adapter: ResourceAdapter) {
    this.resources = adapter;
  }
}
