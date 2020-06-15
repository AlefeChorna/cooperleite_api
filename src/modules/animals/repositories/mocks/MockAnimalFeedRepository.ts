import IAnimalFeedRepository from '../IAnimalFeedRepository';
import IAnimalFeedModel from '../../models/IAnimalFeedModel';
import ICreateAnimalFeedDTO from '../../dtos/ICreateAnimalFeedDTO';
import AnimalFeed from '../../infra/typeorm/entities/AnimalFeed';

class MockAnimalFeedRepository implements IAnimalFeedRepository {
  private ormRepository: IAnimalFeedModel[] = [];

  public async findById(id: number): Promise<IAnimalFeedModel | undefined> {
    const animalFeed = this.ormRepository.find(
      animalFeed => animalFeed.id === id
    );

    return animalFeed;
  }

  public async create(animalFeedData: ICreateAnimalFeedDTO): Promise<IAnimalFeedModel> {
    const animalFeed = new AnimalFeed();

    Object.assign(animalFeed, {
      id: Math.random(),
      ...animalFeedData,
    });

    this.ormRepository.push(animalFeed);

    return animalFeed;
  }

  public async save(animalFeed: IAnimalFeedModel): Promise<IAnimalFeedModel> {
    const animalFeedIndex = this.ormRepository.findIndex(
      animalFeedData => animalFeedData.id === animalFeed.id
    );

    this.ormRepository[animalFeedIndex] = animalFeed;

    return animalFeed;
  }
}

export default MockAnimalFeedRepository;
