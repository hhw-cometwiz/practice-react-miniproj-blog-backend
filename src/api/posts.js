const KoaRouter = require("koa-router");
const api = require("./posts.ctrl");

const router = new KoaRouter();

router.get("/posts", api.list);
router.post("/posts", api.write);

router.get("/posts/:postId", api.testIfObjectIdIsValid, api.read);
router.delete("/posts/:postId", api.testIfObjectIdIsValid, api.remove);
router.patch("/posts/:postId", api.testIfObjectIdIsValid, api.update);

module.exports = router;
