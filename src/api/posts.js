const KoaRouter = require("koa-router");
const api = require("./posts.ctrl");

const router = new KoaRouter();

//RESTful API functions are treated as koa-router middlewares.

router.get("/api/posts", api.list);
router.get("/api/posts/:postId", api.testIfObjectIdIsValid, api.read);

router.post("/api/posts", api.testIsSignedIn, api.write);
router.patch("/api/posts/:postId", api.testIsSignedIn, api.testIfObjectIdIsValid, api.update);
router.delete("/api/posts/:postId", api.testIsSignedIn, api.testIfObjectIdIsValid, api.remove);

module.exports = router;
