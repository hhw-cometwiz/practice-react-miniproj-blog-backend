const KoaRouter = require("koa-router");
const api = require("./auth.ctrl");

const router = new KoaRouter();

router.get("/api/auth/isSignedIn", api.isSignedIn);
router.post("/api/auth/signIn", api.signIn);
router.post("/api/auth/signOut", api.signOut);

module.exports = router;
