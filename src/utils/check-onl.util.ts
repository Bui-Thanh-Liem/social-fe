export function checkOnl(onlIds: string[], userIds: string[]): boolean {
  const set2 = new Set(userIds);
  return onlIds.some((item) => set2.has(item));
}
