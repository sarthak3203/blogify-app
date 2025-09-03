const User = require("../Models/user");
const { Router } = require("express");

const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res.cookie("Token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Incorrect Email or password" });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/user/signin");
});

router.get("/logout", (req, res) => {
  res.clearCookie("Token").redirect("/");
});

module.exports = router;
