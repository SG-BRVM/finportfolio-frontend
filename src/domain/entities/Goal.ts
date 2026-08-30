/** Goal - un objectif financier dont on suit la progression dans le temps. */
export interface Goal {
  readonly id: string;
  readonly name: string;
  readonly targetAmount: number;
  readonly currentAmount: number;
  readonly currency: string;
  readonly createdAt: Date;
}
