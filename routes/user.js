const express = require("express");
const router = express.Router();
const db = require("../databases/db");
const bcrypt = require("bcrypt");
const session = require("express-session");

const checkIfExist = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("username and password are required");
  }

  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Server error1");
    }

    if (results.length === 0) {
      return res.status(401).send("invalid username or password");
    }
    const hashedPassword = results[0].Password;
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        console.error("bcrypt error:", err);
        return res.status(500).send("Server error2");
      }

      if (!isMatch) {
        return res.status(401).send("invalid username or password");
      }

      req.session.user = {
        username: results[0].UserName,
      };

      next();
    });
  });
};

router.post("/login", checkIfExist, (req, res) => {
  res.cookie("username", req.session.user.username, {
    maxAge: 36000000,
    httpOnly: true,
  });
  return res.send("login successfull");
});

router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Server error");
    }
    if (results.length !== 0) {
      return res
        .status(401)
        .send("username alredy exists. choose a different username");
    }
    try {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) throw err;
          const isManeger = false;
          const status = true;
          const insertQuery =
            "INSERT INTO users (username, password, email, isManager, status) VALUES (?, ?, ?, ?, ?)";
          db.query(
            insertQuery,
            [username, hashedPassword, email, isManeger, status],
            (err, insertResults) => {
              if (err) {
                return res.status(500).send("error registering");
              }
              res.status(201).send("user registered!");
            },
          );
        });
      });
    } catch (error) {
      res.status(500).send("error registering");
    }
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error terminating session.");
    }
    return res.send("Session ended.");
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next(); // User is authorized, continue
  } else {
    return res.status(401).send("must be logged in!");
  }
};

// Get current logged-in user
router.get("/me", isAuthenticated, (req, res) => {
  res.json({
    username: req.session.user.username,
  });
});

router.post("/update", isAuthenticated, (req, res) => {
  const { password, email } = req.body;
  const username = req.session.user.username;
  console.log(username);
  const selectQuery = "SELECT * FROM users WHERE username = ?";

  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).send("DB error ", err);
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    const currentUser = results[0];
    const newEmail = email ? email : currentUser.Email;

    if (!password) {
      const updateEmailQuery = "UPDATE users SET email = ? WHERE username = ?";

      return db.query(updateEmailQuery, [newEmail, username], (err) => {
        if (err) {
          return res.status(500).send("DB error");
        }
        res.send("User updated successfully.");
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).send("Error generating salt");
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500).send("Error hashing password");
        }
        const updateQuery =
          "UPDATE users SET password = ?, email = ? WHERE username = ?";

        db.query(updateQuery, [hashedPassword, newEmail, username], (err) => {
          if (err) {
            return res.status(500).send("DB error");
          }
          res.send("User updated successfully.");
        });
      });
    });
  });
});

router.delete("/delete/:username", isAuthenticated, (req, res) => {
  const { username } = req.params;
  const query = "DELETE FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err || !results) {
      return res.status(400).send("DB error. Unable to delete");
    }
    return res.status(200).send("user deleted successfully");
  });
});

//Get all users
router.get("/", (req, res) => {
  const sql = `
    SELECT
      UserName as username,
      Email as email
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET USERS ERROR:", err);

      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
});

module.exports = router;
