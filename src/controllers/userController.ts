import { Response } from "express";
import Global from "../helpers/message";
import { User } from "../services/User";
import { Preferences } from "../services/Preference";
import { DB_TYPE } from "../config"

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.getUserProfile(req.user.id);
    return res.status(200).json({
      message: Global.USER_PROFILE,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message ? error.message : Global.SOMETHING_WENT_WRONG,
    });
  }
};

export const addUserPreference = async (req: any, res: Response) => {
  try {

    if (!req.body.preferenceIds) {
      return res.status(400).json({ error: Global.ENTER_PREFERENCE });
    }
    const preferenceIds = checkIdType(req.body.preferenceIds);
    const prefernces = await Preferences.updateUserPreferences(
      preferenceIds,
      req.user.id
    );

    return res.status(200).json({
      message: Global.PREFERENCE_UPDATE_SUCCESS,
      prefernces,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message ? error.message : Global.SOMETHING_WENT_WRONG,
    });
  }
};

const checkIdType = (data: any) => {
  if (DB_TYPE === "sql" && Array.isArray(data)) {
    return data.map((item) => {
      const parsedItem = Number(item);

      if (!parsedItem && parsedItem !== 0) {
        throw new Error(Global.PREFERENCEID_IS_MISSING);
      }

      return parsedItem;
    });
  }
}
