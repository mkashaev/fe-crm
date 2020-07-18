export interface User {
  emal: string;
  password: string;
}

export interface Category {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}
