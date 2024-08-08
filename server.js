import express from "express";
import route from "./routes/routes.js";
const app = express();
const port =3000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(route);
app.listen(port,()=>{
    console.log('app is listening');
})