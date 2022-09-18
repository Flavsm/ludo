const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
  getHome: async (req, res) => { //changed getProfile to getHome
    try {
      const posts = await Post.find({ user: req.user.id });
      const post = await Post.findById(req.params.id);
      const url = await req.originalUrl;
      res.render("home.ejs", { posts: posts, user: req.user, post: post, url: url }); //changed from profile.ejs to home.ejs //changes req.user to req.email

    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => { //changed getProfile to getHome
    try {
      const posts = await Post.find({ user: req.user.id });
      const url = await req.originalUrl;
      res.render("profile.ejs", { posts: posts, user: req.user, url: url }); //changed from profile.ejs to home.ejs //changes req.user to req.email

    } catch (err) {
      console.log(err);
    }
  },
 /*  getSettings: async (req, res) => { //changed getProfile to getHome
    try {
      const posts = await Post.find({ user: req.user.id });
      const url = await req.originalUrl;
      res.render("settings.ejs", { posts: posts, user: req.user, url: url }); //changed from profile.ejs to home.ejs //changes req.user to req.email

    } catch (err) {
      console.log(err);
    }
  }, */
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      const post = await Post.findById(req.params.id);
      const url = await req.originalUrl;
      res.render("feed.ejs", { posts: posts, user: req.user, post: post, url: url});
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const url = await req.originalUrl;
      res.render("post.ejs", { post: post, user: req.user, url: url }); //changes req.user to req.email
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary

      /* const result = await cloudinary.uploader.upload(req.file.path); */

      
       const pattern = await cloudinary.uploader
      .upload(req.file.path, 
        { eager: [
          { width: 400, height: 300, crop: "pad" }, 
          { width: 220, height: 220, crop: "pad"}, ]}) 

      /* let img = cloudinary.image("LUDO/prof_dhezb9.jpg", {height: 300, width: 400, crop: "pad"}) */
      /* let img_default = "https://res.cloudinary.com/dprkasf7b/image/upload/c_pad,h_300,w_400/v1663434846/LUDO/prof_dhezb9.jpg" */

      await Post.create({
        team: req.body.team,
        player: req.body.player,
        position: req.body.position,
        win: req.body.win,
        loss: req.body.loss,
        notes: req.body.notes,
        user: req.user.id,
        image: {
          feed: pattern.eager[0].secure_url,
          profile: pattern.eager[1].secure_url
        },
        cloudinaryId: pattern.public_id
      });
      console.log("Post has been added!");
      res.redirect("/home"); //changed from profile to home
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed"); //changed from profile to feed
    } catch (err) {
      res.redirect("/feed"); //changed from profile to home
    }
  },
};
