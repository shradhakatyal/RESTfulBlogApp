const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// App configuration
app.use(express.static('public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/blog_app");

// Mongo schema set up
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1542916514-3e2119eefeb7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3b228e491844cd3221bfae1932f76515&auto=format&fit=crop&w=1400&q=60",
//     body: "This is blog post"
// });

// Routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(!err) {
            res.render("index", {blogs});
        }
    });
});

app.get("/blogs/new", (req, res) => {
    res.render("form");
});

app.post("/blogs", (req, res) => {
    let title = req.body.title;
    let image = req.body.image;
    let body = req.body.body;
    Blog.create({title, image, body}, (err, blog) => {
        if(!err) {
            console.log(blog);
        }
    });
});

app.listen(port, () => console.log(`Server running on http:127.0.0.1:${port}`));
