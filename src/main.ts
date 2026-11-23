import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { NODE_ENV, SERVER_PORT, SERVER_URL } from "./common/configs/keys";
import mainRouter from "./apis/router";
import { ErrorMiddleware } from "./common/middlewares/errorMiddleware";
import corsConfig from "./common/middlewares/cors.config";
import type { HttpError } from "http-errors";

const app = express();
const port = SERVER_PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(corsConfig);

app.use("/api", mainRouter);

app.use(
  (err: HttpError, req: Request, res: Response, next: NextFunction) =>
    ErrorMiddleware(err, req, res) as ErrorRequestHandler,
);

app.listen(port, "0.0.0.0", () => {
  if (NODE_ENV === "prod") {
    console.log(`Server is running at ${SERVER_URL}`);
  } else {
    console.log(`Server is running at ${SERVER_URL}:${port}`);
  }
});
