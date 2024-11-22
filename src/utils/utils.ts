export const checkIsAdmin = (email: string) => {
  return email.includes("@e2b.dev") || email === "ben.fornefeld@gmail.com";
};
