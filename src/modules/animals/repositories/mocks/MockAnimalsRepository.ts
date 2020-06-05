import IAnimalsRepository from '../IAnimalsRepository';
import IAnimalModel from '../../models/IAnimalModel';
import IFindOneAnimalDTO from '../../dtos/IFindOneAnimalDTO';
import ICreateAnimalDTO from '../../dtos/ICreateAnimalDTO';
import Animal from '../../infra/typeorm/entities/Animal';

class MockAnimalsRepository implements IAnimalsRepository {
  private ormRepository: IAnimalModel[] = [];

  public async findOne(
    animalData: IFindOneAnimalDTO
  ): Promise<IAnimalModel | undefined> {
    const animal = this.ormRepository.find((animal) => {
      let match = true;

      for (const key in animalData) {
        // @ts-ignore
        if (animalData[key] !== animal[key]) {
          match = false;
          break;
        }
      }

      return match;
    });

    if (!animal) return undefined;

    return animal;
  }

  public async findById(id: number): Promise<IAnimalModel | undefined> {
    const animal = this.ormRepository.find(
      animal => animal.id === id
    );

    return animal;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IAnimalModel[] | undefined> {
    const animals = this.ormRepository.filter(
      animal => animal.company_id === company_id
    );

    return animals;
  }

  public async create(animalData: ICreateAnimalDTO): Promise<IAnimalModel> {
    const animal = new Animal();

    Object.assign(animal, {
      id: Date.now(),
      ...animalData,
    });

    this.ormRepository.push(animal);

    return animal;
  }

  public async save(animal: IAnimalModel): Promise<IAnimalModel> {
    const animalIndex = this.ormRepository.findIndex(
      animalData => animalData.id === animal.id
    );

    this.ormRepository[animalIndex] = animal;

    return animal;
  }
}

export default MockAnimalsRepository;
