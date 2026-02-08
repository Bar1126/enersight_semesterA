//Victoria Kicherman
//Bar Shoshana
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/user");
const pointsRoutes = require("./routes/savedpoints");
const solarRoutes = require("./routes/solarpanels");
const windRoutes = require("./routes/windturbines");
const session = require("express-session");

app.use(express.json());
app.use(express.static("frontEnd"));

app.use(
  session({
    secret: "your_secret_key",
    resave: false, //if there wasn't a change don't save
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }, // For HTTPS use true
  }),
);

app.use("/users", require("./routes/user"));
app.use("/savedpoints", require("./routes/savedpoints"));
app.use("/solar", solarRoutes);
app.use("/wind", windRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
