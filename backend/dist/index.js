import express from "express";
import userRouter from "./routers/user.routes.js";
const app = express();
app.use(express.json());
app.use("/api/v1/user/", userRouter);
app.get("/", (req, res) => {
    return res.json({
        message: "this is working"
    });
});
app.listen(8080, () => {
    console.log("hi");
});
//# sourceMappingURL=index.js.map