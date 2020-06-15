import { getRepository, Repository } from 'typeorm';

import IAnimalFeedRepository from '@modules/animals/repositories/IAnimalFeedRepository';
import IAnimalFeedModel from '@modules/animals/models/IAnimalFeedModel';
import ICreateAnimalFeedDTO from '@modules/animals/dtos/ICreateAnimalFeedDTO';
import AnimalFeed from '../entities/AnimalFeed';

class AnimalFeedRepository implements IAnimalFeedRepository {
  private ormRepository: Repository<AnimalFeed>;

  constructor() {
    this.ormRepository = getRepository(AnimalFeed);
  }

  public async findById(id: number): Promise<IAnimalFeedModel | undefined> {
    const animalFeed = await this.ormRepository.findOne(id);

    return animalFeed;
  }

  public async create(data: ICreateAnimalFeedDTO): Promise<IAnimalFeedModel> {
    const animalFeed = this.ormRepository.create(data);

    await this.ormRepository.save(animalFeed);

    return animalFeed;
  }

  public async save(animalFeed: IAnimalFeedModel): Promise<IAnimalFeedModel> {
    return await this.ormRepository.save(animalFeed);
  }
}

export default AnimalFeedRepository
