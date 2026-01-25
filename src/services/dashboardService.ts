import type { DashboardData } from "../types/dashboard";
import { httpRequest } from "../shared/http/httpClient";
import { getAuthToken } from "../shared/auth/tokenStore";

export class DashboardService {
  private getToken(): string | null {
    return getAuthToken();
  }

  async getDashboardData(mes?: number, ano?: number): Promise<DashboardData> {
    const token = this.getToken();

    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const params = new URLSearchParams();
    if (mes != null) params.append("mes", String(mes));
    if (ano != null) params.append("ano", String(ano));

    const query = params.toString();
    const path = `/api/dashboard/getSummary${query ? `?${query}` : ""}`;

    // Backend: GET /api/dashboard/getSummary?mes=1&ano=2026
    // userId vem do JWT => req.user.id
    return httpRequest<DashboardData>("GET", path, undefined, token);
  }
}

export const dashboardService = new DashboardService();
