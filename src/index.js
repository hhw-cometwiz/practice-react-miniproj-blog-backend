const Dotenv = require("dotenv");
const Koa = require("koa");
const KoaBodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");

Dotenv.config();

const envVar = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(envVar.MONGO_URI)
    .then(() => {
        console.log("A database has been connected.");
    })
    .catch((e) => {
        console.error(e);
    })
;

const app = new Koa();

const index = require("./api/index");
const posts = require("./api/posts");
const about = require("./api/about");
const test = require("./api/test");

app
    .use(
        KoaBodyParser()
    )
    .use(
        index.routes()
    )
    .use(
        index.allowedMethods()
    )
    .use(
        posts.routes()
    )
    .use(
        posts.allowedMethods()
    )
    .use(
        about.routes()
    )
    .use(
        about.allowedMethods()
    )
    .use(
        test.routes()
    )
    .use(
        test.allowedMethods()
    )
;

app.listen(
    envVar.PORT,
    () => {
        console.log(`listening to port ${envVar.PORT}`);
    }
);
