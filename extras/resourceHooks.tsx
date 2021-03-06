import Stripe from "stripe";
import useSWR, { useSWRInfinite } from "swr";
import { fetcher } from "./helpers";

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
    initialData ? { initialData: [initialData] } : undefined
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

export function useCustomer(id, initialData?) {
  const { data, error, mutate } = useSWR([`/api/customers/${id}`], fetcher, {
    initialData,
  });
  return {
    mutate,
    customer: data as Stripe.Customer,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePrices(limit?, initialData?) {
  const itemLimit = limit || 20;
  const { data, error, mutate, size, setSize } = useSWRInfinite(
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
    mutate,
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
  const { data, error, mutate } = useSWR([`/api/prices/${id}`], fetcher, {
    initialData,
  });
  return {
    mutate,
    price: data as Stripe.Price,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInvoices(status, limit?, initialData?) {
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
    fetcher,
    initialData ? { initialData: [initialData] } : undefined
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

export function useInvoice(id, initialData?) {
  const { data, error, mutate } = useSWR([`/api/invoices/${id}`], fetcher, {
    initialData,
  });
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
    initialData ? { initialData: [initialData] } : undefined
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

export function useProduct(id, initialData?) {
  const { data, error, mutate } = useSWR([`/api/products/${id}`], {
    initialData,
  });
  return {
    mutate,
    product: data as Stripe.Product,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useInvoiceItems(limit?, initialData?) {
  // const limit = 20
  const itemLimit = limit || 20;
  const { data, error, mutate, size, setSize } = useSWRInfinite(
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
    mutate,
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
  const { data, error, mutate } = useSWR([`/api/invoiceitems/${id}`], fetcher, {
    initialData,
  });
  return {
    mutate,
    invoiceItem: data as Stripe.InvoiceItem,
    isLoading: !error && !data,
    isError: error,
  };
}
