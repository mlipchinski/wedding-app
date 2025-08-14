import { env } from "process";
import { initApp } from "./app";

const app = initApp();

app.listen(env.port, () => {
    console.log(`Server listening at PORT: ${env.port}`);
});