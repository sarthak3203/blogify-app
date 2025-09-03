const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");

const Blog = require("../Models/blog");
const Comment = require("../Models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title: title,
    body: body,
    createdBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });

  res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  res.render("blog", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
