export const checkIsAdmin = (email: string) => {
  return email.includes("@e2b.dev") || email === "ben.fornefeld@gmail.com";
};

// animations

export const exponentialEasing = (t: number): number => {
  return 1 - Math.exp(-t * 4);
};

export const exponentialEaseOut = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.exp(-t * 4);
};

export const exponentialEaseInOut = (t: number): number => {
  return t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? Math.exp(4 * t - 2) / 2
        : 1 - Math.exp(-2 * (2 * t - 1)) / 2;
};
