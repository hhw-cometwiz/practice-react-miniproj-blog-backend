const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get(
    "/about/:name?",
    (ctx) => {
        if(ctx.params.name) {
            ctx.body = `My name is ${ctx.params.name}.`;
        }
        else {
            ctx.body = "About us...";
        }
    }
);

module.exports = router;
