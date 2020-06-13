import { getRepository, Repository } from 'typeorm';

import IAnimalsRepository from '@modules/animals/repositories/IAnimalsRepository';
import IAnimalModel from '@modules/animals/models/IAnimalModel';
import IFindOneAnimalDTO from '@modules/animals/dtos/IFindOneAnimalDTO';
import ICreateAnimalDTO from '@modules/animals/dtos/ICreateAnimalDTO';
import Animal from '../entities/Animal';

class AnimalsRepository implements IAnimalsRepository {
  private ormRepository: Repository<Animal>;

  constructor() {
    this.ormRepository = getRepository(Animal);
  }

  public async findOne(
    data: IFindOneAnimalDTO
  ): Promise<IAnimalModel | undefined> {
    const product = await this.ormRepository.findOne(data);

    return product;
  }

  public async findById(id: number): Promise<IAnimalModel | undefined> {
    const product = await this.ormRepository.findOne({
      where: { id },
      relations: ['animal_vaccines']
    });

    return product;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IAnimalModel[] | undefined> {
    const products = await this.ormRepository.find({
      where: { company_id },
      relations: ['animal_vaccines']
    });

    return products;
  }

  public async create(data: ICreateAnimalDTO): Promise<IAnimalModel> {
    const product = this.ormRepository.create(data);

    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: IAnimalModel): Promise<IAnimalModel> {
    return await this.ormRepository.save(product);
  }
}

export default AnimalsRepository
