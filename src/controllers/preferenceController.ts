import { Request, Response } from "express";
import Global from "../helpers/message";
import { Preferences } from "../services/Preference";

export const getPreference = async (req: Request, res: Response) => {
  try {
    const preferences = await Preferences.getAllPreferences();
    res.status(200).json({
      message: Global.PREFERENCE_LIST,
      preferences,
    });
  } catch (error: any) {
    console.error("Error in preferences endpoint:", error);
    res.status(500).json({
      error: error.message ? error.message : Global.SOMETHING_WENT_WRONG,
    });
  }
};
export const createPreference = async (req: Request, res: Response) => {
  try {
    const { preference } = req.body;

    // Check if preference is missing
    if (!preference) {
      return res.status(400).json({ error: Global.ENTER_PREFERENCE });
    }

    // Check if preference already exists
    const existingPreference = await Preferences.findByPreferences(
      preference
    );
    if (existingPreference) {
      return res.status(409).json({ error: Global.PREFERENCE_ALREADY_EXISTS });
    }

    const updatedPreference = await Preferences.updatePreferences(
      preference
    );

    return res.status(200).json({
      message: Global.PREFERENCE_UPDATE_SUCCESS,
      preference: updatedPreference,
    });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || Global.SOMETHING_WENT_WRONG });
  }
};
