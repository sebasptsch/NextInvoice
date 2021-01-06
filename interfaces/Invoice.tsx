export default interface Invoice {
  id: string;
  object: string;
  account_country: string;
  account_name: string;
  account_tax_ids: any;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  application_fee_amount: any;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  billing_reason: string;
  charge: string;
  collection_method: string;
  created: number;
  currency: string;
  custom_fields: any;
  customer: string;
  customer_address: any;
  customer_email: string;
  customer_name: any;
  customer_phone: any;
  customer_shipping: any;
  customer_tax_exempt: string;
  customer_tax_ids: any[];
  default_payment_method: any;
  default_source: any;
  default_tax_rates: any[];
  description: any;
  discount: any;
  discounts: any[];
  due_date: number;
  ending_balance: number;
  footer: any;
  hosted_invoice_url: string;
  invoice_pdf: string;
  last_finalization_error: any;
  lines: Lines;
  livemode: boolean;
  metadata: Metadata;
  next_payment_attempt: any;
  number: string;
  paid: boolean;
  payment_intent: string;
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  receipt_number: string;
  starting_balance: number;
  statement_descriptor: any;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  status_transitions: StatusTransitions;
  subscription: any;
  subtotal: number;
  tax: any;
  total: number;
  total_discount_amounts: any[];
  total_tax_amounts: any[];
  transfer_data: any;
  webhooks_delivered_at: number;
}

export interface Lines {
  data: Datum[];
  has_more: boolean;
  object: string;
  url: string;
}

export interface Datum {
  id: string;
  object: string;
  amount: number;
  currency: string;
  description: string;
  discount_amounts: any[];
  discountable: boolean;
  discounts: any[];
  livemode: boolean;
  metadata: Metadata;
  period: Period;
  price: Price;
  proration: boolean;
  quantity: number;
  subscription: string;
  subscription_item: string;
  tax_amounts: any[];
  tax_rates: any[];
  type: string;
}

export interface Metadata {}

export interface Period {
  end: number;
  start: number;
}

export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  livemode: boolean;
  lookup_key: any;
  metadata: Metadata;
  nickname: any;
  product: string;
  recurring: Recurring;
  tiers_mode: any;
  transform_quantity: any;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

export interface Recurring {
  aggregate_usage: any;
  interval: string;
  interval_count: number;
  usage_type: string;
}

export interface StatusTransitions {
  finalized_at: number;
  marked_uncollectible_at: any;
  paid_at: number;
  voided_at: any;
}
