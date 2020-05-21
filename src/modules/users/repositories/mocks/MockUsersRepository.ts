import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';

class MockUsersRepository implements IUsersRepository {
  private ormRepository: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.find(user => user.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.find(user => user.email === email);

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      ...userData
    });

    this.ormRepository.push(user);

    return user;
  }

  public async save(userData: User): Promise<User> {
    const userIndex = this.ormRepository.findIndex(user => user.id === userData.id);

    this.ormRepository[userIndex] = userData;

    return userData;
  }
}

export default MockUsersRepository;
