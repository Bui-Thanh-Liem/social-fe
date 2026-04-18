import type { FieldErrors, Path } from "react-hook-form";

export function getNestedError<T extends object>(
  errors: FieldErrors<T>,
  name: Path<T>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return name.split(".").reduce<any>((acc, key) => acc?.[key], errors);
}
