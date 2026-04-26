import _cors from "cors";

export const cors = _cors({
  origin: "http://localhost:5173",
  credentials: true,
});
