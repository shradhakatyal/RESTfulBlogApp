const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 3000;

// App configuration
app.use(express.static('public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// This line should be after body parser line.
app.use(expressSanitizer());
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

// New Form Route
app.get("/blogs/new", (req, res) => {
    res.render("form");
});

// Create Route
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let newBlog = req.body.blog;
    Blog.create(newBlog, (err, blog) => {
        if(!err) {
            console.log(blog);
            res.redirect("/blogs");
        } else {
            res.render("form");
        }
    });
});

// Show Route
app.get("/blogs/:id", (req, res) => {
    let id = req.params.id;
    Blog.findById(id, (err, blog) => {
        if(!err) {
            console.log("blog", blog);
            res.render("details", {blog});
        } else {
            res.redirect("/blogs");
        }
    });
});

//Edit Form Route
app.get("/blogs/:id/edit", (req, res) => {
    let id = req.params.id;
    Blog.findById(id, (err, blog) => {
        if(!err) {
            res.render("edit", {blog});
        } else {
            res.redirect("/blogs");
        }
    });
});

// Update Route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
        if(!err) {
            res.redirect(`/blogs/${req.params.id}`);
        } else {
            res.redirect("/blogs");
        }
    });
});

// Delete Route
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, deletdBlog) => {
        if(!err) {
            res.redirect("/blogs");
        }
    });
});

app.listen(port, () => console.log(`Server running on http:127.0.0.1:${port}`));
