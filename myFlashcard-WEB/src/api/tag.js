import axios from "./axios";

export const getAllTags = async () => {
  const res = await axios.get("/api/tags");
  return res.data.tags;
};

export const createTag = async (name) => {
  const res = await axios.post("/api/tags", { name });
  return res.data.tag;
};
