/** CashOperationDTO - payload pour déposer ou retirer du capital d'un portefeuille. */
export interface CashOperationDTO {
  portfolioId: string;
  amount: string;
}
