import jwt from "jsonwebtoken";
import { jwt_secret } from "../config";
import { Response, NextFunction } from "express";
import Global from "../helpers/message";
import { User } from "../services/User";

//crete token
export const createToken = (userData: any) => {
  const token = jwt.sign(userData, jwt_secret, { expiresIn: "1d" });
  return token;
};

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: Global.TOKEN_IS_MISSING });
    }

    const decoded: any = await jwt.verify(
      token.replace(/^Bearer\s+/i, ""),
      jwt_secret
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: Global.USER_NOT_REGISTERED });
    }
    if (!user.active) {
      return res.status(401).json({ error: Global.USER_NOT_ACTIVE });
    }
    req.user = user;
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: Global.INVALID_TOKEN });
  }
};
