export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  livemode: boolean;
  lookup_key: null;
  metadata: Metadata;
  nickname: null;
  product: string;
  recurring: Recurring;
  tiers_mode: null;
  transform_quantity: null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

export interface Metadata {}

export interface Recurring {
  aggregate_usage: null;
  interval: string;
  interval_count: number;
  usage_type: string;
}
