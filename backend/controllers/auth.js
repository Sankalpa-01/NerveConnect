const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../lib/mongoClient");
const { ObjectId } = require("mongodb");

async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ error: "username, email and password required" });

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ $or: [{ username }, { email }] });
    if (existing)
      return res
        .status(409)
        .json({ error: "Username or email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      name: name || "",
      username,
      email,
      password: hashed,
      createdAt: new Date(),
    };
    const result = await users.insertOne(user);

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({ error: "JWT_SECRET not configured" });

    const token = jwt.sign(
      {
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
        username,
        email,
      },
      secret,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({ id: result.insertedId, username, email });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
}

async function signin(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password)
      return res
        .status(400)
        .json({ error: "usernameOrEmail and password required" });

    const db = await getDb();
    const users = db.collection("users");

    const user = await users.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({ error: "JWT_SECRET not configured" });

    const token = jwt.sign(
      {
        _id: user._id.toString(),
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      secret,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Signin failed" });
  }
}

async function logout(req, res) {
  res.clearCookie("auth_token");
  return res.json({ ok: true });
}

async function currentUser(req, res) {
  try {
    const userId = req.user.id;
    const db = await getDb();

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("currentUser error:", err);
    return res.status(500).json({ error: "Failed to fetch current user" });
  }
}

module.exports = { signup, signin, logout, currentUser };
