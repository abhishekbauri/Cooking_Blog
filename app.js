const express = require("express");
const expressLayouts = require("express-ejs-layouts");
//for uploading from form
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("cookingBlogSecure"));
app.use(
  session({
    secret: "cookingBlogSecretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

const routes = require("./server/routes/recipeRoutes.js");
// const cookieParser = require('cookie-parser');
app.use("/", routes);

app.listen(port, () => {
  console.log(`listenig to port ${port}`);
});
