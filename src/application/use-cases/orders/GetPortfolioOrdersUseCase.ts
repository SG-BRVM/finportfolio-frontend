/**
 * Note : la liste des ordres d'un portefeuille est exposée par le Port
 * `PortfolioRepository.getOrders` (l'endpoint backend est
 * GET /portfolios/{id}/orders). Ce fichier ré-exporte le Use Case
 * canonique du sous-domaine `portfolios` pour respecter la convention
 * "un Use Case par fonctionnalité" sans dupliquer la logique.
 */
export { GetPortfolioOrdersUseCase } from "../portfolios/GetPortfolioOrdersUseCase";
