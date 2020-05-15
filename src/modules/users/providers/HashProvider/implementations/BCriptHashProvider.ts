import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCriptHashProvider implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return await hash(payload, 8);
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}

export default BCriptHashProvider;
