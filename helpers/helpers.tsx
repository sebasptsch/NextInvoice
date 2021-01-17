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
  const { data, error, trigger, size, setSize } = useSWRInfinite(
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
    initialData ? { initialData: [initialData] } : undefined
  );
  return {
    trigger,
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

export function useCustomer(id, initialData?) {
  const { data, error, trigger } = useSWR([`/api/customers/${id}`], fetcher, {
    initialData,
  });
  return {
    trigger,
    customer: data as Stripe.Customer,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePrices(limit?, initialData?) {
  const itemLimit = limit || 20;
  const { data, error, trigger, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.has_more) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return `/api/prices?limit=${itemLimit}`;
      // add the cursor to the API endpoint
      return `/api/prices?starting_after=${
        previousPageData.data[itemLimit - 1].id
      }&limit=${itemLimit}`;
    },
    fetcher,
    initialData ? { initialData: [initialData] } : undefined
  );
  return {
    trigger,
    prices: data?.flatMap(
      (priceLists) => priceLists.data
    ) as Array<Stripe.Price>,
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isLoadingMore: data?.length !== size,
    isError: error,
    size,
    setSize,
  };
}

export function usePrice(id, initialData?) {
  const { data, error, trigger } = useSWR([`/api/prices/${id}`], fetcher, {
    initialData,
  });
  return {
    trigger,
    price: data as Stripe.Price,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoices(status, limit?, initialData?) {
  const itemLimit = limit || 20;
  const { data, error, trigger, size, setSize } = useSWRInfinite(
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
    fetcher,
    initialData ? { initialData: [initialData] } : undefined
  );
  // concat all items in array - not done
  return {
    trigger,
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

export function useInvoice(id, initialData?) {
  const { data, error, trigger } = useSWR([`/api/invoices/${id}`], fetcher, {
    initialData,
  });
  return {
    trigger,
    invoice: data as Stripe.Invoice,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProducts(limit?, initialData?) {
  // const limit = 20
  const itemLimit = limit || 20;
  const { data, error, trigger, size, setSize } = useSWRInfinite(
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
    initialData ? { initialData: [initialData] } : undefined
  );
  return {
    trigger,
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

export function useProduct(id, initialData?) {
  const { data, error, trigger } = useSWR([`/api/producuts/${id}`], {
    initialData,
  });
  return {
    trigger,
    product: data as Stripe.Product,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useInvoiceItems(limit?, initialData?) {
  // const limit = 20
  const itemLimit = limit || 20;
  const { data, error, trigger, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.has_more) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return `/api/invoiceitems?limit=${itemLimit}`;
      // add the cursor to the API endpoint
      return `/api/invoiceitems?starting_after=${
        previousPageData.data[itemLimit - 1].id
      }&limit=${itemLimit}`;
    },
    fetcher,
    initialData ? { initialData: [initialData] } : undefined
  );
  return {
    trigger,
    products: data?.flatMap(
      (productLists) => productLists.data
    ) as Array<Stripe.InvoiceItem>,
    has_more: data && data[data?.length - 1]?.has_more,
    isLoading: !error && !data,
    isLoadingMore: data?.length !== size,
    isError: error,
    size,
    setSize,
  };
}

export function useInvoiceItem(id, initialData?) {
  const { data, error, trigger } = useSWR(
    [`/api/invoiceitems/${id}`],
    fetcher,
    {
      initialData,
    }
  );
  return {
    trigger,
    invoiceItem: data as Stripe.InvoiceItem,
    isLoading: !error && !data,
    isError: error,
  };
}
