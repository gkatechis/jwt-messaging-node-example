import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import { signAccessToken } from "./jwt.js";
import cookieParser from "cookie-parser";

const dbFile = "./data/users.db";

export const authLogin = async (req, res, next) => {
  const udb = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY);
  const userLookup = "SELECT * FROM Users WHERE Email = ?";

  try {
    const user = await new Promise((resolve, reject) => {
      udb.all(userLookup, req.body.email, (err, rows) => {
        if (err) {
          console.error("Error in database call:", err);
          reject(err);
        } else {
          if (rows.length === 0) {
            reject(new Error("User not found"));
          } else {
            resolve(rows);
          }
        }
      });
    });

    const match = await bcrypt.compare(req.body.password, user[0].Password);
    if (!match) {
      if (!match) {
        return res
          .status(401)
          .json({ message: "Incorrect email or password." });
      }
    }
    
    const name = `${user[0].FirstName} ${user[0].LastName}`;

    const payload = {
      external_id: `${user[0].Id}`,
      name: name,
      email: user[0].Email,
      scope: "user",
      email_verified: true,
    };
    const signedToken = await signAccessToken(payload);
    const username = name;
    res.cookie("username", name, { sameSite: "strict" });
    res.cookie("loggedIn", "true", { sameSite: 'strict' });
    return res.json({
      message: "Login successful",
      signedToken: signedToken,
      username: name
    });
  } catch (err) {
    return res.status(401).json({ message: "Login failed" });
  } finally {
    udb.close();
  }
};
