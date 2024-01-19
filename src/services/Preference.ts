import { DB_TYPE } from "../config"
import MongoPrisma from "../../prisma/mongo/client/index";
import SqlPrisma from "../../prisma/mysql/client/index";
const prisma: any = DB_TYPE == "mongodb" ? MongoPrisma : SqlPrisma;

export const Preferences = {
  // Objective: Find user information based on the email
  findByPreferences: async (preference: any) => {
    return prisma.preferences.findUnique({
      where: { preference },
    });
  },

  //Objective: Retrieve all preferences from the preference table
  getAllPreferences: async () => {
    return prisma.preferences.findMany({});
  },

  //Objective: Retrieve preferences of a user based on the user id provided
  getUserPreferences: async (userId: any) => {
    return prisma.userPreferences.findMany({
      where: { userId: userId },
      include: {
        preference: true,
      },
    });
  },

  // Objective: Update user preferences given preference data and user id
  updateUserPreferences: async (data: any, userId: any) => {
    try {
      // Delete existing user preferences
      await prisma.userPreferences.deleteMany({
        where: {
          userId: userId,
        },
      });

      // Map data to create an array of userPreferences objects
      const preferencesData = data.map((preferenceId: any) => {
        return {
          preferenceId: preferenceId,
          userId: userId,
        };
      });

      // Create multiple userPreferences records
      const createdPreferences = await prisma.userPreferences.createMany({
        data: preferencesData,
      });

      return createdPreferences;
    } catch (error) {
      throw new Error("Failed to update user preferences");
    }
  },


  // Objective: Update preferences given preference data
  updatePreferences: async (data: string) => {
    return prisma.preferences.create({
      data: {
        preference: data,
      },
    });
  },
};
