import { axiosInstance } from "../../adapters/outbound/http/axios/axiosInstance";
import { HttpClient } from "../../adapters/outbound/http/axios/HttpClient";

import { HttpInvestorRepository } from "../../adapters/outbound/http/repositories/HttpInvestorRepository";
import { HttpPortfolioRepository } from "../../adapters/outbound/http/repositories/HttpPortfolioRepository";
import { HttpInstrumentRepository } from "../../adapters/outbound/http/repositories/HttpInstrumentRepository";
import { HttpOrderRepository } from "../../adapters/outbound/http/repositories/HttpOrderRepository";
import { HttpHealthRepository } from "../../adapters/outbound/http/repositories/HttpHealthRepository";
import { HttpMarketDataRepository } from "../../adapters/outbound/http/repositories/HttpMarketDataRepository";
import { HttpGoalRepository } from "../../adapters/outbound/http/repositories/HttpGoalRepository";
import { HttpDocumentRepository } from "../../adapters/outbound/http/repositories/HttpDocumentRepository";

import { CreateInvestorUseCase } from "../../application/use-cases/investors/CreateInvestorUseCase";
import { GetInvestorUseCase } from "../../application/use-cases/investors/GetInvestorUseCase";
import { GetInvestorsUseCase } from "../../application/use-cases/investors/GetInvestorsUseCase";
import { SearchInvestorsUseCase } from "../../application/use-cases/investors/SearchInvestorsUseCase";

import { CreatePortfolioUseCase } from "../../application/use-cases/portfolios/CreatePortfolioUseCase";
import { GetPortfolioUseCase } from "../../application/use-cases/portfolios/GetPortfolioUseCase";
import { GetPortfoliosUseCase } from "../../application/use-cases/portfolios/GetPortfoliosUseCase";
import { GetPortfolioPositionsUseCase } from "../../application/use-cases/portfolios/GetPortfolioPositionsUseCase";
import { GetPortfolioValuationUseCase } from "../../application/use-cases/portfolios/GetPortfolioValuationUseCase";
import { GetPortfolioValuationHistoryUseCase } from "../../application/use-cases/portfolios/GetPortfolioValuationHistoryUseCase";
import { GetPortfolioPnlUseCase } from "../../application/use-cases/portfolios/GetPortfolioPnlUseCase";
import { GetPortfolioOrdersUseCase } from "../../application/use-cases/portfolios/GetPortfolioOrdersUseCase";
import { GetPortfolioTransactionsUseCase } from "../../application/use-cases/portfolios/GetPortfolioTransactionsUseCase";
import { SearchPortfoliosUseCase } from "../../application/use-cases/portfolios/SearchPortfoliosUseCase";
import { DepositCapitalUseCase } from "../../application/use-cases/portfolios/DepositCapitalUseCase";
import { WithdrawCapitalUseCase } from "../../application/use-cases/portfolios/WithdrawCapitalUseCase";

import { CreateInstrumentUseCase } from "../../application/use-cases/instruments/CreateInstrumentUseCase";
import { GetInstrumentUseCase } from "../../application/use-cases/instruments/GetInstrumentUseCase";
import { GetInstrumentsUseCase } from "../../application/use-cases/instruments/GetInstrumentsUseCase";
import { SearchInstrumentsUseCase } from "../../application/use-cases/instruments/SearchInstrumentsUseCase";
import { UpdateNominalValueUseCase } from "../../application/use-cases/instruments/UpdateNominalValueUseCase";
import { GetInstrumentHistoryUseCase } from "../../application/use-cases/instruments/GetInstrumentHistoryUseCase";
import { RefreshMarketPricesUseCase } from "../../application/use-cases/market-data/RefreshMarketPricesUseCase";

import { CreateOrderUseCase } from "../../application/use-cases/orders/CreateOrderUseCase";
import { GetOrderUseCase } from "../../application/use-cases/orders/GetOrderUseCase";
import { ExecuteOrderUseCase } from "../../application/use-cases/orders/ExecuteOrderUseCase";
import { CancelOrderUseCase } from "../../application/use-cases/orders/CancelOrderUseCase";

import { CheckBackendHealthUseCase } from "../../application/use-cases/health/CheckBackendHealthUseCase";
import { RunDemoEndpointsUseCase } from "../../application/use-cases/health/RunDemoEndpointsUseCase";

import { CreateGoalUseCase } from "../../application/use-cases/goals/CreateGoalUseCase";
import { GetGoalsUseCase } from "../../application/use-cases/goals/GetGoalsUseCase";

import { UploadDocumentUseCase } from "../../application/use-cases/documents/UploadDocumentUseCase";
import { GetDocumentsUseCase } from "../../application/use-cases/documents/GetDocumentsUseCase";
import { GetDocumentContentUseCase } from "../../application/use-cases/documents/GetDocumentContentUseCase";

import { ConsoleTelemetryAdapter } from "../../adapters/outbound/telemetry/ConsoleTelemetryAdapter";
import type { TelemetryPort } from "../../adapters/outbound/telemetry/TelemetryPort";

/**
 * container.ts - Dependency Injection Container.
 *
 * Seul endroit de l'application qui construit concrètement :
 *   HTTP Client -> Repositories -> Use Cases
 *
 * Les composants React ne doivent JAMAIS faire `new Axios()`,
 * `new HttpXxxRepository()` ou `new XxxUseCase()` eux-mêmes : ils
 * importent `container` et consomment les Use Cases déjà assemblés.
 * Remplacer Axios, une implémentation de repository, ou même l'API
 * backend ne touche que ce fichier.
 */
function buildContainer() {
  const httpClient = new HttpClient(axiosInstance);

  const investorRepository = new HttpInvestorRepository(httpClient);
  const portfolioRepository = new HttpPortfolioRepository(httpClient);
  const instrumentRepository = new HttpInstrumentRepository(httpClient);
  const orderRepository = new HttpOrderRepository(httpClient);
  const healthRepository = new HttpHealthRepository(httpClient);
  const marketDataRepository = new HttpMarketDataRepository(httpClient);
  const goalRepository = new HttpGoalRepository(httpClient);
  const documentRepository = new HttpDocumentRepository(httpClient);

  const telemetry: TelemetryPort = new ConsoleTelemetryAdapter();

  return {
    telemetry,
    useCases: {
      investors: {
        create: new CreateInvestorUseCase(investorRepository),
        get: new GetInvestorUseCase(investorRepository),
        getAll: new GetInvestorsUseCase(investorRepository),
        search: new SearchInvestorsUseCase(investorRepository),
      },
      portfolios: {
        create: new CreatePortfolioUseCase(portfolioRepository),
        get: new GetPortfolioUseCase(portfolioRepository),
        getAll: new GetPortfoliosUseCase(portfolioRepository),
        getPositions: new GetPortfolioPositionsUseCase(portfolioRepository),
        getValuation: new GetPortfolioValuationUseCase(portfolioRepository),
        getValuationHistory: new GetPortfolioValuationHistoryUseCase(portfolioRepository),
        getPnl: new GetPortfolioPnlUseCase(portfolioRepository),
        getOrders: new GetPortfolioOrdersUseCase(portfolioRepository),
        getTransactions: new GetPortfolioTransactionsUseCase(portfolioRepository),
        search: new SearchPortfoliosUseCase(portfolioRepository),
        deposit: new DepositCapitalUseCase(portfolioRepository),
        withdraw: new WithdrawCapitalUseCase(portfolioRepository),
      },
      instruments: {
        create: new CreateInstrumentUseCase(instrumentRepository),
        get: new GetInstrumentUseCase(instrumentRepository),
        getAll: new GetInstrumentsUseCase(instrumentRepository),
        search: new SearchInstrumentsUseCase(instrumentRepository),
        updateNominalValue: new UpdateNominalValueUseCase(instrumentRepository),
        getHistory: new GetInstrumentHistoryUseCase(instrumentRepository),
      },
      marketData: {
        refreshPrices: new RefreshMarketPricesUseCase(marketDataRepository),
      },
      goals: {
        create: new CreateGoalUseCase(goalRepository),
        getAll: new GetGoalsUseCase(goalRepository),
      },
      documents: {
        upload: new UploadDocumentUseCase(documentRepository),
        getAll: new GetDocumentsUseCase(documentRepository),
        getContent: new GetDocumentContentUseCase(documentRepository),
      },
      orders: {
        create: new CreateOrderUseCase(orderRepository),
        get: new GetOrderUseCase(orderRepository),
        execute: new ExecuteOrderUseCase(orderRepository),
        cancel: new CancelOrderUseCase(orderRepository),
      },
      health: {
        check: new CheckBackendHealthUseCase(healthRepository),
        demo: new RunDemoEndpointsUseCase(healthRepository),
      },
    },
  };
}

export const container = buildContainer();
export type Container = typeof container;
