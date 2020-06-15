import IAnimalFeedModel from '../models/IAnimalFeedModel';
import ICreateAnimalFeedDTO from '../dtos/ICreateAnimalFeedDTO';

export default interface IAnimalFeedRepository {
  findById(id: number): Promise<IAnimalFeedModel | undefined>;
  create(data: ICreateAnimalFeedDTO): Promise<IAnimalFeedModel>;
  save(animalFeed: IAnimalFeedModel): Promise<IAnimalFeedModel>;
}
