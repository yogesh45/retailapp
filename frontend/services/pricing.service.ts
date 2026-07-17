import api from "@/services/api";
import {
  PricingListResponse,
  UpdatePricingRequest
} from "@/types/pricing";

export interface PricingSearchParams {
  store_id?: string;
  sku?: string;
  product_name?: string;
  pricing_date?: string;
  page?: number;
  page_size?: number;
}

class PricingService {
  async search(
    params: PricingSearchParams
  ): Promise<PricingListResponse> {
    const response =
      await api.get<PricingListResponse>(
        "/pricing",
        {
          params,
        }
      );

    return response.data;
  }

    async updatePrice(
        pricingId: number,
        request: UpdatePricingRequest
        ): Promise<void> {
        await api.put(
            `/pricing/${pricingId}`,
            request
        );
    }
}

const pricingService = new PricingService();

export default pricingService;