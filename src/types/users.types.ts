export interface EditUserForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "ADMIN" | "USER" | "COORDINATOR";
  isVerified: boolean;
}
