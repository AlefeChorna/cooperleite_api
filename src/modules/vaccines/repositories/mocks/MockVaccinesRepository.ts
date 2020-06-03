import IVaccinesRepository from '../IVaccinesRepository';
import IVaccineModel from '../../models/IVaccineModel';
import IFindOneVaccineDTO from '../../dtos/IFindOneVaccineDTO';
import ICreateVaccineDTO from '../../dtos/ICreateVaccineDTO';
import Vaccine from '../../infra/typeorm/entities/Vaccine';

class MockVaccinesRepository implements IVaccinesRepository {
  private ormRepository: IVaccineModel[] = [];

  public async findOne(vaccineData: IFindOneVaccineDTO): Promise<IVaccineModel | undefined> {
    const vaccine = this.ormRepository.find((vaccine) => {
      let match = true;

      for (const key in vaccineData) {
        // @ts-ignore
        if (vaccineData[key] !== vaccine[key]) {
          match = false;
          break;
        }
      }

      return match;
    });

    if (!vaccine) return undefined;

    return vaccine;
  }

  public async findById(id: number): Promise<IVaccineModel | undefined> {
    const vaccine = this.ormRepository.find(
      vaccine => vaccine.id === id
    );

    return vaccine;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IVaccineModel[] | undefined> {
    const vaccines = this.ormRepository.filter(
      vaccine => vaccine.company_id === company_id
    );

    return vaccines;
  }

  public async create(vaccineData: ICreateVaccineDTO): Promise<IVaccineModel> {
    const vaccine = new Vaccine();

    Object.assign(vaccine, {
      id: Date.now(),
      ...vaccineData,
    });

    this.ormRepository.push(vaccine);

    return vaccine;
  }

  public async save(vaccine: IVaccineModel): Promise<IVaccineModel> {
    const vaccineIndex = this.ormRepository.findIndex(
      vaccineData => vaccineData.id === vaccine.id
    );

    this.ormRepository[vaccineIndex] = vaccine;

    return vaccine;
  }
}

export default MockVaccinesRepository;
