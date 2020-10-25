const app = require("express");
const router = app.Router();
const { trackFlick } = require("../controllers/trackListController");

router.post("/newFlickTrack", trackFlick);

module.exports = router;
