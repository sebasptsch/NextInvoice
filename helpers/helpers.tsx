import axios from "axios";
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

export function useCustomers(limit?, initialData?) {
  const itemLimit = limit || 20;
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.has_more) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return `/api/customers?limit=${itemLimit}`;
      // add the cursor to the API endpoint
      return `/api/customers?starting_after=${
        previousPageData.data[itemLimit - 1].id
      }&limit=${itemLimit}`;
    },
    fetcher,
    { initialData }
  );
  return {
    mutate,
    customers: data?.flatMap(
      (customerLists) => customerLists.data
    ) as Array<Stripe.Customer>,
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isLoadingMore: data?.length !== size,
    isError: error,
    size,
    setSize,
  };
}

export function useCustomer(id) {
  const { data, error, mutate } = useSWR([`/api/customers/${id}`], fetcher);
  return {
    mutate,
    customer: data as Stripe.Customer,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePrices() {
  const { data, error, mutate } = useSWR([`/api/prices`], listFetcher);
  return {
    mutate,
    prices: data as Array<Stripe.Price>,
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
    price: data as Stripe.Price,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoices(status, limit?) {
  const itemLimit = limit || 20;
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.has_more) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0)
        return `/api/invoices?limit=${itemLimit}&status=${status}`;
      // add the cursor to the API endpoint
      return `/api/invoices?starting_after=${
        previousPageData.data[itemLimit - 1].id
      }&limit=${itemLimit}&status=${status}`;
    },
    fetcher
  );
  // concat all items in array - not done
  return {
    mutate,
    invoices: data?.flatMap(
      (invoiceLists) => invoiceLists.data
    ) as Array<Stripe.Invoice>,
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isLoadingMore: data?.length !== size,
    isError: error,
    size,
    setSize,
  };
}

export function useInvoice(id, params?) {
  const { data, error, mutate } = useSWR(
    [`/api/invoices/${id}`, params],
    fetcher
  );
  return {
    mutate,
    invoice: data as Stripe.Invoice,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProducts(limit?, initialData?) {
  // const limit = 20
  const itemLimit = limit || 20;
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.has_more) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return `/api/products?limit=${itemLimit}`;
      // add the cursor to the API endpoint
      return `/api/products?starting_after=${
        previousPageData.data[itemLimit - 1].id
      }&limit=${itemLimit}`;
    },
    fetcher,
    { initialData }
  );
  return {
    mutate,
    products: data?.flatMap(
      (productLists) => productLists.data
    ) as Array<Stripe.Product>,
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isLoadingMore: data?.length !== size,
    isError: error,
    size,
    setSize,
  };
}

export function useProduct(id, params?) {
  const { data, error, mutate } = useSWR(
    [`/api/producuts/${id}`, params],
    fetcher
  );
  return {
    mutate,
    product: data as Stripe.Product,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useInvoiceItems() {
  const { data, error, mutate } = useSWR([`/api/invoiceitems`], listFetcher);
  return {
    mutate,
    invoiceItems: data as Array<Stripe.InvoiceItem>,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoiceItem(id) {
  const { data, error, mutate } = useSWR([`/api/invoiceitems/${id}`], fetcher);
  return {
    mutate,
    invoiceItem: data as Stripe.InvoiceItem,
    isLoading: !error && !data,
    isError: error,
  };
}
