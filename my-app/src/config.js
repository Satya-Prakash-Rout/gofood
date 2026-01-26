const normalizeBaseUrl = (value) => {
  if (!value) return '';
  return value.replace(/\/+$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(
  process.env.REACT_APP_API_URL || 'http://localhost:5000'
);

export const SOCKET_URL = normalizeBaseUrl(
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000'
);

