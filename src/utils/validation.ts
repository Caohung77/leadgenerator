export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateIndustry = (industry: string): boolean => {
  return industry.length >= 2 && industry.length <= 100;
};

export const validateLocation = (location: string): boolean => {
  return location.length >= 2 && location.length <= 100;
};