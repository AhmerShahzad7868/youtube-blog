const {Router} = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/users"); // Assuming you have a User model

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage })


router.get("/add-new", (req, res) => {
    return res.render("addblog", {
        user: req.user
    });
});

router.get("/:id", async(req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdby", "name email");
    console.log(blog);
    return res.render("blog", {
      user: req.user,
      blog,
    });
});

// router.post('/comment/:BlogId', async (req, res) => {
//   const comment = await Comment.create({

// });
router.post("/", upload.single("coverImage"), async(req, res) => {
    const { title , body } = req.body;
    const blog =  await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;