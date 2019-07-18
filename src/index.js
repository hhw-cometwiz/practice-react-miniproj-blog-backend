const Dotenv = require("dotenv");
const Koa = require("koa");
const KoaBodyParser = require("koa-bodyparser");
const KoaSession = require("koa-session");
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
const auth = require("./api/auth");

app
    .use(
        KoaSession(
            {
                maxAge : 24 * 60 * 60 * 1000
            },
            app
        )
    )
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
    .use(
        auth.routes()
    )
    .use(
        auth.allowedMethods()
    )
;
app.keys = [envVar.COOKIE_SIGN_KEY];

app.listen(
    envVar.PORT,
    () => {
        console.log(`listening to port ${envVar.PORT}`);
    }
);
