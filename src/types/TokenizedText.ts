export type TokenizedText = {
  type: "tokipona" | "escaped" | "name" | "illegal" | "error";
  content: string;
  toki_name?: string;
};
