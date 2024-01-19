import { DB_TYPE } from "../config"
import MongoPrisma from "../../prisma/mongo/client/index";
import SqlPrisma from "../../prisma/mysql/client/index";

const prisma: any = DB_TYPE == "mongodb" ? MongoPrisma : SqlPrisma;
export const User = {
  // Objective: Find user information based on the id
  findById: async (id: any) => {
    return prisma.user.findUnique({
      where: { id: id },
    });
  },

  // Objective: Insert user
  create: async (user: any) => {
    return prisma.user.create({
      data: user,
    });
  },

  // Objective: Find user information based on the email
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Objective: Find user based on token passed
  findByToken: async (token: string) => {
    try {
      const userActivationToken = await prisma.userActivationToken.findUnique({
        where: { token },
      });
      if (!userActivationToken) {
        return null;
      }
      return userActivationToken;
    } catch (error) {
      console.error("Error finding token:", error);
      return null;
    }
  },

  // Objective: Update an account token for a user
  addAccountActivationToken: async (userId: any, token: string) => {
    const existingToken = await prisma.userActivationToken.findUnique({
      where: {
        userId: userId,
      },
    });

    if (existingToken) {
      return prisma.userActivationToken.update({
        where: {
          userId: userId,
        },
        data: {
          token: token,
        },
      });
    } else {
      return prisma.userActivationToken.create({
        data: {
          userId,
          token: token,
        },
      });
    }
  },

  // Objective: Mark user as activated and remove activation entry from the token table
  activateAccount: async (id: any, password: string) => {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: id },
        data: { active: true, password },
      }),
    ]);
  },

  // Objective: Update the user password in the user table
  resetPassword: async (userId: any, passwordHash: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  },

  // Objective: Return user information along with preferences
  getUserProfile: async (userId: any) => {
    try {
      const user: any = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          dob: true,
          active: true,
          preferences: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  },
  // Objective: Update an account token for a user
  getActivationToken: async (userId: any,) => {
    try {
      return await prisma.userActivationToken.findUnique({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      console.error("Error getting activation token:", error);
      return null;
    }
  },
};
