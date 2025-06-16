
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
}

export interface SearchData {
  results: SearchResult[];
  query: string;
  totalResults?: number;
}

export interface ApiData {
  search: SearchData;
}
