export interface Customer {
  id: string;
  object: string;
  address: Address;
  balance: number;
  created: number;
  currency: string;
  default_source: null;
  delinquent: boolean;
  description: string;
  discount: null;
  email: string;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Metadata;
  name: string;
  next_invoice_sequence: number;
  phone: string;
  preferred_locales: string[];
  shipping: Shipping;
  tax_exempt: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface InvoiceSettings {
  custom_fields: null;
  default_payment_method: null;
  footer: null;
}

export interface Metadata {}

export interface Shipping {
  address: Address;
  name: string;
  phone: string;
}
