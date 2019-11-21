type SearchParams = {
  mime_types?: string;
  limit?: number;
  page?: number;
  format?: "json" | "src";
  breed_id?: string;
  order?: "RANDOM" | "DESC" | "ASC";
  type?: "small" | "med" | "full";
};

type Cat = {
  id: string;
  url: string;
  height: number;
  width: number;
  breeds: [string];
};

type Dog = {
  message: [string];
  status: string;
};

type Cats = [Cat];

// export { SearchParams, Cat, Cats, Dog };
