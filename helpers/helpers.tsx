import axios, { AxiosRequestConfig } from "axios";
import Stripe from "stripe";
import useSWR from "swr";

export const fetcher = (url) =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
export const listFetcher = (url) =>
  axios
    .get(url, { params: { limit: 100 } })
    .then((res) => res.data.data)
    .catch((error) => {
      throw error;
    });

const fetchWithStatus = (url, value) =>
  axios
    .get(url, {
      params: {
        limit: 100,
        status: value,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export function useCustomers() {
  const { data, error, mutate } = useSWR([`/api/customers`], listFetcher);
  return {
    mutate,
    customers: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useCustomer(id) {
  const { data, error, mutate } = useSWR([`/api/customers/${id}`], fetcher);
  return {
    mutate,
    customer: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePrices() {
  const { data, error, mutate } = useSWR([`/api/prices`], listFetcher);
  return {
    mutate,
    prices: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePrice(id, params?) {
  const { data, error, mutate } = useSWR(
    [`/api/prices/${id}`, params],
    fetcher
  );
  return {
    mutate,
    price: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoices(value) {
  const { data, error, mutate } = useSWR(
    [`/api/invoices`, value],
    fetchWithStatus
  );
  return {
    mutate,
    invoices: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoice(id, params?) {
  const { data, error, mutate } = useSWR(
    [`/api/invoices/${id}`, params],
    fetcher
  );
  return {
    mutate,
    invoice: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProducts() {
  const { data, error, mutate } = useSWR([`/api/products`], listFetcher);
  return {
    mutate,
    products: data,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useProduct(id, params?) {
  const { data, error, mutate } = useSWR(
    [`/api/producuts/${id}`, params],
    fetcher
  );
  return {
    mutate,
    product: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoiceItems() {
  const { data, error, mutate } = useSWR([`/api/invoiceitems`], listFetcher);
  return {
    mutate,
    invoiceItems: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoiceItem(id) {
  const { data, error, mutate } = useSWR([`/api/invoiceitems/${id}`], fetcher);
  return {
    mutate,
    invoiceItem: data,
    isLoading: !error && !data,
    isError: error,
  };
}
