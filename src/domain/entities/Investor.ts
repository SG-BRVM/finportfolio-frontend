/** Investor - un investisseur détenteur d'un ou plusieurs portefeuilles. */
export interface Investor {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
}
