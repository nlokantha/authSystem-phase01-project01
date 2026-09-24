import bcrypt from "bcrypt"

const BCRYPT_SALT_ROUNDS = 12

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password,BCRYPT_SALT_ROUNDS)
}

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash)
}
