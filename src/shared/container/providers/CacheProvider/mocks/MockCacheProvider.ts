import ICacheProvider from '../models/ICacheProvider';

interface IClientCache {
  [key: string]: string;
}

class MockCacheProvider implements ICacheProvider {
  private client: IClientCache = {};

  public async save(key: string, value: any): Promise<void> {
    this.client[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | undefined> {
    const data = this.client[key];

    if (!data) return undefined;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async delete(key: string): Promise<void> {
    delete this.client[key];
  }

  public async deleteByPrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.client).filter(key =>
      key.startsWith(`${key}:`)
    );

    keys.forEach(this.delete);
  }

}

export default MockCacheProvider;
