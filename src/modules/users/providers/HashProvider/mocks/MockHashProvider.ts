import IHashProvider from '../models/IHashProvider';

class MockHashProvider implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return payload;
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }

}

export default MockHashProvider;
