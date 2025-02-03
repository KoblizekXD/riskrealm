// Utilities not related to anything else

export const loginBackground = Array.from({ length: 100 }).fill(
  Array.from({ length: 100 }).fill("🎰💸", 0).join(""),
  0,
) as string[];

// https://stackoverflow.com/a/75605707/13388463
export const removeAttrFromObject = <O extends object, A extends keyof O>(
  object: O,
  attr: A,
): Omit<O, A> => {
  const newObject = { ...object };

  if (attr in newObject) {
    delete newObject[attr];
  }

  return newObject;
};
