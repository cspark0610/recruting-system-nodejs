// data that is saved into the JWT
export default interface TokenData {
  token: string;
  expiresIn?: number;
  short_url?: string;
}
