// api/guestbook.js
import axios from "axios";

export const list = () => axios.get("/api/guestbook");
export const insert = (data) => axios.post("/api/guestbook", data);
export const remove = (id) => axios.delete(`/api/guestbook/${id}`);
