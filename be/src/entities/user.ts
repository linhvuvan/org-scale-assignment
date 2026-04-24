export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
};

export type NewUser = Omit<User, "createdAt">;
