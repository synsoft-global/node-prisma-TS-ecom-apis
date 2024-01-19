import { User } from "../services/User";

// Objective: This function generates account activation token
export const getAccountActivationToken = async (user: any) => {
  let token = generateAccountActivationToken();
  await User.addAccountActivationToken(user.id, token);
  return token;
};

// Objective: This function returns a random token based on calculation
export const generateAccountActivationToken = () => {
  const tokenLength = 32;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return Array.from(
    { length: tokenLength },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};
