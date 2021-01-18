import axios from "axios";

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
