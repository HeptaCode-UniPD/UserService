export class UserEntity {
  readonly #id: string;
  readonly #email: string;
  readonly #passwordHash: string;

  constructor(id: string, email: string, passwordHash: string) {
    this.#id = id;
    this.#email = email;
    this.#passwordHash = passwordHash;
  }

  get id(): string { return this.#id; }
  get email(): string { return this.#email; }
  get passwordHash(): string { return this.#passwordHash; }
  
}