const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const HomeContent = "This is Daily Jornal Website Which will give your Daily Upadate and Allow to post your post on various Topices";
const ContactContent = "This is Contact Page You can contact and link with Developer of this website.";
const AboutContent = "This is About page Where You can get details of Developer";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postSchema = { title: String, Content: String };

const Post = mongoose.model("Post", postSchema);

app.get("/", async(req, res) => {
    try {
        const posts = await Post.findOne({});
        res.render("Home", { HomeContent: HomeContent, posts: posts });
    } catch (err) {
        // Handle error here
        console.error(err);
        // Send an error response or render an error page
    }
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    post.save(function(err) {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.get("/posts:postId", (req, res) => {
    const requestId = req.params.postId;
    Post.findOne({ _id: requestId }, function(err, post) {
        res.render("post", { title: post.title, content: post.content });
    });
});

app.get("/About", (req, res) => {
    res.render("About", { Aboutcontent: AboutContent });
});

app.get("/contact", (req, res) => {
    res.render("contact", { ContactContent: ContactContent });
});

app.listen("3000", () => {
    console.log("Your Server is ready at port 3000");
});