type SearchParams = {
  mime_types?: ["jpg"?, "png"?, "gif"?];
  limit?: number;
  page?: number;
  format?: "json" | "src";
  breed_id?: string;
  order?: "RANDOM" | "DESC" | "ASC";
};

type CatUrl = {
  id: string;
  url: string;
  height: number;
  width: number;
};

type CatUrls = [CatUrl];