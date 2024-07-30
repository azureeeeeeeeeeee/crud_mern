import jwt from "jsonwebtoken";

// Creating custom middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "jwt-secret-key", (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  });
};

export default authenticateUser;
