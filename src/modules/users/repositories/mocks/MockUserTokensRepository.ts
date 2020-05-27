import { uuid } from 'uuidv4';

import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '../../infra/typeorm/entities/UserToken';

class MockUserTokensRepository implements IUserTokensRepository {
  private ormRepository: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    });

    this.ormRepository.push(userToken);

    return userToken;
  }

  public async save(userToken: UserToken): Promise<UserToken> {
    const userIndex = this.ormRepository.findIndex(user => user.id === userToken.id);

    this.ormRepository[userIndex] = userToken;

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.ormRepository.find(
      userToken => userToken.token === token
    );

    return userToken;
  }
}

export default MockUserTokensRepository;
