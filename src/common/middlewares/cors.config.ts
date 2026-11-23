import cors from "cors";
import { SERVER_URL } from "../configs/keys";

const corsOption = {
  origin: SERVER_URL,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default cors(corsOption);
