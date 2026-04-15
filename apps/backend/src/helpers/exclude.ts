export function exclude<User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> {
  const result = { ...user };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}
