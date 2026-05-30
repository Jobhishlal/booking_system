import express from "express";
import dotenv from "dotenv";
import teacherRoutes from "./routes/teacher.routes";
import parentRoutes from "./routes/parent.routes";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { globalErrorHandler } from "./middlewares/errorHandler";

// Load environment variables
dotenv.config();

const app = express();


app.use(express.json());


app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
