export interface Product {
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  description: null;
  images: any[];
  livemode: boolean;
  metadata: Metadata;
  name: string;
  statement_descriptor: null;
  unit_label: null;
  updated: number;
}

export interface Metadata {}
