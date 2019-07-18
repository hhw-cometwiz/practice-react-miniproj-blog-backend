const KoaRouter = require("koa-router");
const api = require("./auth.ctrl");

const router = new KoaRouter();

router.get("/auth/isSignedIn", api.isSignedIn);
router.post("/auth/signIn", api.signIn);
router.post("/auth/signOut", api.signOut);

module.exports = router;
