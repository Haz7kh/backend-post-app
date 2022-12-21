const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//setup mongoose connection:
//this line to handel a warning !!!
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/postDB");
// Create Schema :
const postSchema = {
  title: String,
  content: String,
};
//Create a model :: our collection will be in plural COZ we used post as model posts:
const Post = mongoose.model("Post", postSchema);

//TODO1: requests targeting all posts:
//Chain Route Handlers

app
  .route("/posts")

  //1.GET

  .get((req, res) => {
    Post.find((err, foundPosts) => {
      if (!err) {
        res.send(foundPosts);
      } else {
        res.send(err);
      }
    });
  })
  //2.POST
  .post((req, res) => {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    newPost.save((err) => {
      if (!err) {
        res.send("A new Post has been added successfully");
      } else {
        res.send(err);
      }
    });
  })
  //3.DELETE
  .delete((req, res) => {
    Post.deleteMany((err) => {
      if (!err) {
        res.send("All Posts deleted successfully");
      } else {
        res.send(err);
      }
    });
  });
///////////////////////////////////////////////// single: post with id ////////////////////////////////////////

app
  .route("/posts/:postTitle")
  .get((req, res) => {
    Post.findOne({ title: req.params.postTitle }, (err, foundPost) => {
      if (foundPost) {
        res.send(foundPost);
      } else {
        res.send("No post matching that title was found");
      }
    });
  })
  .put((req, res) => {
    const postTitle = req.params.postTitle;

    Post.replaceOne(
      { title: postTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated the content of the selected post.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    const postTitle = req.params.postTitle;
    //Post here I mean the model in 27:js
    Post.findOneAndDelete({ title: postTitle }, (err) => {
      if (!err) {
        res.send("Successfully the selected post deleted.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
