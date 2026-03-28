export class UserEntity {
  readonly #id: string;
  readonly #nome: string;
  readonly #cognome: string;
  readonly #email: string;
  readonly #passwordHash: string;

  constructor(id: string, nome: string, cognome: string, email: string, passwordHash: string) {
    this.#id = id;
    this.#nome = nome;
    this.#cognome = cognome;
    this.#email = email;
    this.#passwordHash = passwordHash;
  }

  get id(): string { return this.#id; }
  get nome(): string { return this.#nome; }
  get cognome(): string { return this.#cognome; }
  get email(): string { return this.#email; }
  get passwordHash(): string { return this.#passwordHash; }
  
}