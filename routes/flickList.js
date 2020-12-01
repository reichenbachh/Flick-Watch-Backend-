const app = require("express");
const router = app.Router();
const {
  trackFlick,
  deleteFromFlickList,
  resetFlickList,
  getFlickList,
} = require("../controllers/trackListController");

router.get("/getMyFlickList/:user", getFlickList);
router.post("/newFlickTrack", trackFlick);
router.delete(
  "/removefromFlickList/:user/:flick_id/:type",
  deleteFromFlickList
);
router.delete("/resetFlickList/:id", resetFlickList);

module.exports = router;
