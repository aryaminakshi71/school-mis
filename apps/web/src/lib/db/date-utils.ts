export const toPgDate = (date: Date): string => date.toISOString().slice(0, 10);

export const fromPgDate = (
  value: string | Date | null | undefined,
): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  return new Date(`${value}T00:00:00.000Z`);
};
