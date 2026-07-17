export interface PricingRecord {
  id: number;
  store_id: string;
  sku: string;
  product_name: string;
  price: number | string;
  pricing_date: string;
}

export interface PricingListResponse {
  items: PricingRecord[];
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
}

export interface UpdatePricingRequest {
  price: number;
}