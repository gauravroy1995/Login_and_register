const express = require("express");
const router = express.Router();

//@route Get api/users/test
//@desc to test
//@access public

router.get("/test", (req, res) => res.json({ msg: "users works" }));

module.exports = router;
