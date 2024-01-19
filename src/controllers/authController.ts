import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Global from "../helpers/message";
import { getAccountActivationToken } from "../auth/authUtils";
import { sendMail } from "../helpers/sendMail";
import { User } from "../services/User";
import { createToken } from "../middlewares/authMiddleware";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      throw new Error(Global.INVALID_CREDENTIALS);
    }
    const user: any = await User.findByEmail(email);
    if (!user) throw new Error(Global.USER_NOT_REGISTERED);

    if (!user.password) throw new Error(Global.CRED_NOT_SET);

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new Error(Global.AUTH_FAILURE);
    }

    const tokens = await createToken(user);
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: Global.SIGNUP_SUCCESS,
      user: userData,
      tokens,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message ? error.message : Global.CRED_NOT_SET });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, dob } = req.body;

    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error(Global.USER_ALREADY_REGISTERED);
    }

    // Create a new user
    const createdUser = await User.create({
      name,
      email,
      dob: dob ? new Date(dob) : new Date(),
    });

    // Generate account activation token
    const accountActivationToken = await getAccountActivationToken(createdUser);

    // Construct activation link
    const activationLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/account-activation/${accountActivationToken}`;

    // Send activation email
    await sendMail(email, "Account Activation", activationLink);

    return res.status(200).json({
      message: Global.SIGNUP_SUCCESS,
      user: createdUser,
      "account-activation-url": activationLink,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message ? error.message : Global.USER_ALREADY_REGISTERED,
    });
  }
};

export const activateAccount = async (req: Request, res: Response) => {
  try {
    const token = req.params.token.trim();
    const userToActivate: any = await User.findByToken(token);

    if (!userToActivate) {
      return res.status(400).json({ error: Global.INVALID_ACCOUNT_TOKEN });
    }
    // throw new Error(Global.INVALID_ACCOUNT_TOKEN);

    const user: any = await User.findById(userToActivate.userId);
    if (!user) {
      return res.status(400).json({ error: Global.INVALID_ACCOUNT_TOKEN });
    }
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await User.activateAccount(user.id, hashedPassword);

    return res.status(200).json({
      message: Global.ACCOUNT_SUCCESS,
    });
  } catch (error: any) {
    return res.status(500).send({
      message: error.message ? error.message : Global.SOMETHING_WENT_WRONG,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findByEmail(req.body.email);
    if (!user) {
      throw Error(Global.USER_NOT_FOUND);
    }
    if (!user.active) {
      throw Error(Global.USER_NOT_ACTIVE);
    }
    const resetPasswordTokens = await getAccountActivationToken(user);

    const resetPasswordLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/update-password/${resetPasswordTokens}`;

    // Send activation email
    await sendMail(user.email, "Reset Password Link", resetPasswordLink);
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: Global.RESET_SUCCESS,
      user: userData,
      "reset-password-url": resetPasswordLink,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message ? error.message : Global.SOMETHING_WENT_WRONG,
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findByToken(req.params.token);
    if (!user) throw new Error(Global.INVALID_ACCOUNT_TOKEN);

    let salt = bcrypt.genSaltSync(10);
    let password = bcrypt.hashSync(req.body.password, salt);

    await User.activateAccount(user.userId, password);
    return res.status(200).json({
      message: Global.PASSWORD_SUCCESS,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message ? error.message : Global.SOMETHING_WENT_WRONG,
    });
  }
};
