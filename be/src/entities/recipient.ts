export type Recipient = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export type NewRecipient = Omit<Recipient, "createdAt">;
