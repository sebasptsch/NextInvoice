import axios, { AxiosRequestConfig } from "axios";
import Stripe from "stripe";
import useSWR, { useSWRInfinite } from "swr";

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

export function useCustomers() {
  const limit = 20
  const { data, error, mutate, size, setSize } = useSWRInfinite((pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.has_more) return null
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/customers?limit=${limit}`
    // add the cursor to the API endpoint
    return `/api/customers?starting_after=${previousPageData.data[limit - 1].id}&limit=${limit}`
  }, fetcher);
  return {
    mutate,
    customers: data?.flatMap(customerLists => customerLists.data),
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isError: error,
    size,
    setSize
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

export function useInvoices(status) {
  const limit = 20
  const { data, error, mutate, size, setSize } = useSWRInfinite((pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.has_more) return null
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/invoices?limit=${limit}&status=${status}`
    // add the cursor to the API endpoint
    return `/api/invoices?starting_after=${previousPageData.data[limit - 1].id}&limit=${limit}&status=${status}`
  }, fetcher);
  // concat all items in array - not done
  return {
    mutate,
    invoices: data?.flatMap(invoiceLists => invoiceLists.data),
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isError: error,
    size,
    setSize
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
  const limit = 20
  const { data, error, mutate, size, setSize } = useSWRInfinite((pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.has_more) return null
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/products?limit=${limit}`
    // add the cursor to the API endpoint
    return `/api/products?starting_after=${previousPageData.data[limit - 1].id}&limit=${limit}`
  }, fetcher);
  return {
    mutate,
    products: data?.flatMap(productLists => productLists.data),
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isError: error,
    size,
    setSize
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
