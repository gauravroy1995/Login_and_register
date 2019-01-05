const express = require("express");
const router = express.Router();

//@route Get api/profile/test
//@desc to test
//@access public

router.get("/test", (req, res) => res.json({ msg: "profile works" }));

module.exports = router;
