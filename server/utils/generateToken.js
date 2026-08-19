import jwt from "jsonwebtoken";

const generateToken = (user) => {
  if (!user?._id) {
    throw new Error(
      "User ID is required to generate token"
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing from .env"
    );
  }

  return jwt.sign(
    {
      id: user._id.toString(),

      role: user.role || "customer",
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;