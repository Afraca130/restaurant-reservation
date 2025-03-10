export const isValidPhoneNumber = (phone: string): boolean => {
  return /^[0-9]{10,11}$/.test(phone);
};
