import bcrypt from "bcrypt";

const hashValue = async (value: string, saltRounds?: number) => {
  return bcrypt.hash(value, saltRounds || 10);
};

const compareValue = async (value: string, hashedValue: string) => {
  return bcrypt.compare(value, hashedValue).catch(() => false);
};

export { hashValue, compareValue };
