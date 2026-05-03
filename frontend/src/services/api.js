import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Upload parsed rows to backend
export async function uploadRows(rows, uploadId) {
  const response = await axios.post(`${BASE_URL}/upload`, { rows, uploadId });
  return response.data;
}

// Fetch paginated/searched/sorted data
export async function fetchData({ uploadId, page, pageSize, search, sortKey, sortDir }) {
  const response = await axios.get(`${BASE_URL}/data`, {
    params: { uploadId, page, pageSize, search, sortKey, sortDir },
  });
  return response.data;
}