export interface CourierRegistration {
  firstName: string;
  lastName: string;
  gender: string;
  birthYear: number;
  nationality: string;
  licenseType: string; // A1 | A2 | A
  phone: string; // +90 formatted
  province: string;
  district: string;
  workingHours: string; // gunduz | gece | 24
  workingDays: string[]; // selected days
  workingType: string; // tam | yari | serbest
  motoModel: string;
  motoCc: number;
  avatarFile?: FileList; // file input list
}

export interface BusinessRegistration {
  businessName: string;
  managerFirstName: string;
  managerLastName: string;
  phone: string;
  address: string;
  workingType: string;
  workingHours: string; // gunduz | gece | 24
  avatarFile?: FileList;
}

export type RoleType = "kurye" | "isletme";
