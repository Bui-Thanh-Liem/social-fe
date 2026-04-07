import type { IBase } from "./base.interface";
import type { IUser } from "./user.interface";

export interface IReel extends IBase {
  videoUrl: string;
  user: IUser;
}
