import type { InstrumentRepository } from "../../../../application/ports/InstrumentRepository";
import type { CreateInstrumentDTO } from "../../../../application/dto/CreateInstrumentDTO";
import type { UpdateNominalValueDTO } from "../../../../application/dto/UpdateNominalValueDTO";
import type { FinancialInstrument } from "../../../../domain/entities/FinancialInstrument";
import type { InstrumentHistoryEntry } from "../../../../domain/entities/InstrumentHistoryEntry";
import type { HttpClient } from "../axios/HttpClient";
import {
  InstrumentMapper,
  type InstrumentApiResponse,
  type InstrumentHistoryEntryApiResponse,
} from "../mappers/InstrumentMapper";

export class HttpInstrumentRepository implements InstrumentRepository {
  constructor(private readonly http: HttpClient) {}

  async create(data: CreateInstrumentDTO): Promise<FinancialInstrument> {
    const response = await this.http.post<InstrumentApiResponse>("/api/v1/instruments", {
      symbol: data.symbol,
      name: data.name,
      instrument_type: data.instrumentType,
      currency: data.currency,
      current_price: data.currentPrice,
      nominal_value: data.nominalValue ?? null,
      sector: data.sector ?? null,
    });
    return InstrumentMapper.toDomain(response);
  }

  async getById(id: string): Promise<FinancialInstrument> {
    const response = await this.http.get<InstrumentApiResponse>(`/api/v1/instruments/${id}`);
    return InstrumentMapper.toDomain(response);
  }

  async getAll(): Promise<FinancialInstrument[]> {
    const response = await this.http.get<InstrumentApiResponse[]>("/api/v1/instruments");
    return response.map(InstrumentMapper.toDomain);
  }

  async search(query: string, limit = 20): Promise<FinancialInstrument[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    const response = await this.http.get<InstrumentApiResponse[]>(
      `/api/v1/instruments?${params.toString()}`
    );
    return response.map(InstrumentMapper.toDomain);
  }

  async updateNominalValue(data: UpdateNominalValueDTO): Promise<FinancialInstrument> {
    const response = await this.http.patch<InstrumentApiResponse>(
      `/api/v1/instruments/${data.instrumentId}/nominal-value`,
      { nominal_value: data.nominalValue }
    );
    return InstrumentMapper.toDomain(response);
  }

  async getHistory(instrumentId: string): Promise<InstrumentHistoryEntry[]> {
    const response = await this.http.get<InstrumentHistoryEntryApiResponse[]>(
      `/api/v1/instruments/${instrumentId}/history`
    );
    return response.map(InstrumentMapper.historyToDomain);
  }
}
