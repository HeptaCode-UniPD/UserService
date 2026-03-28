export class RepoEntity {
  readonly #id: string;
  readonly #idUtente: string[];
  readonly #url: string;
  readonly #name: string;
  readonly #pathStorage: string;

  constructor(id: string, idUtente: string[], url: string, name: string, pathStorage: string) {
    this.#id = id;
    this.#idUtente = idUtente;
    this.#url = url;
    this.#name = name;
    this.#pathStorage = pathStorage;
  }

  get id(): string { return this.#id; }
  get idUtente(): string[] { return this.#idUtente; }
  get url(): string { return this.#url; }
  get name(): string { return this.#name; }
  get pathStorage(): string { return this.#pathStorage; }
  
}