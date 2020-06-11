import IAnimalVaccinesRepository from '../IAnimalVaccinesRepository';
import IAnimalVaccineModel from '../../models/IAnimalVaccineModel';
import ICreateAnimalVaccineDTO from '../../dtos/ICreateAnimalVaccineDTO';
import AnimalVaccine from '../../infra/typeorm/entities/AnimalVaccine';

class MockAnimalVaccinesRepository implements IAnimalVaccinesRepository {
  private ormRepository: IAnimalVaccineModel[] = [];

  public async findById(id: number): Promise<IAnimalVaccineModel | undefined> {
    const animalVaccine = this.ormRepository.find(
      animalVaccine => animalVaccine.id === id
    );

    return animalVaccine;
  }

  public async create(animalVaccineData: ICreateAnimalVaccineDTO): Promise<IAnimalVaccineModel> {
    const animalVaccine = new AnimalVaccine();

    Object.assign(animalVaccine, {
      id: Math.random(),
      ...animalVaccineData,
    });

    this.ormRepository.push(animalVaccine);

    return animalVaccine;
  }

  public async save(animalVaccine: IAnimalVaccineModel): Promise<IAnimalVaccineModel> {
    const animalVaccineIndex = this.ormRepository.findIndex(
      animalVaccineData => animalVaccineData.id === animalVaccine.id
    );

    this.ormRepository[animalVaccineIndex] = animalVaccine;

    return animalVaccine;
  }
}

export default MockAnimalVaccinesRepository;
