const KoaRouter = require("koa-router");
const api = require("./posts.ctrl");

const router = new KoaRouter();

//RESTful API functions are treated as koa-router middlewares.

router.get("/posts", api.list);
router.get("/posts/:postId", api.testIfObjectIdIsValid, api.read);

router.post("/posts", api.testIsSignedIn, api.write);
router.patch("/posts/:postId", api.testIsSignedIn, api.testIfObjectIdIsValid, api.update);
router.delete("/posts/:postId", api.testIsSignedIn, api.testIfObjectIdIsValid, api.remove);

module.exports = router;
