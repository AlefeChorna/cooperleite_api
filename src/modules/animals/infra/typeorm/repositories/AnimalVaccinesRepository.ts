import { getRepository, Repository } from 'typeorm';

import IAnimalVaccinesRepository from '@modules/animals/repositories/IAnimalVaccinesRepository';
import IAnimalVaccineModel from '@modules/animals/models/IAnimalVaccineModel';
import ICreateAnimalVaccineDTO from '@modules/animals/dtos/ICreateAnimalVaccineDTO';
import AnimalVaccine from '../entities/AnimalVaccine';

class AnimalsRepository implements IAnimalVaccinesRepository {
  private ormRepository: Repository<AnimalVaccine>;

  constructor() {
    this.ormRepository = getRepository(AnimalVaccine);
  }

  public async findById(id: number): Promise<IAnimalVaccineModel | undefined> {
    const animalVaccine = await this.ormRepository.findOne(id);

    return animalVaccine;
  }

  public async create(data: ICreateAnimalVaccineDTO): Promise<IAnimalVaccineModel> {
    const animalVaccine = this.ormRepository.create(data);

    await this.ormRepository.save(animalVaccine);

    return animalVaccine;
  }

  public async save(animalVaccine: IAnimalVaccineModel): Promise<IAnimalVaccineModel> {
    return await this.ormRepository.save(animalVaccine);
  }
}

export default AnimalsRepository
