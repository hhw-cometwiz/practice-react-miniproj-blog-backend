const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get(
    "/",
    (ctx) => {
        ctx.body = "Home...";
    }
);

module.exports = router;
