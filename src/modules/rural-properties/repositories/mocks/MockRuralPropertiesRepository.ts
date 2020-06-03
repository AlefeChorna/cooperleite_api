import IRuralPropertiesRepository from '../IRuralPropertiesRepository';
import IRuralPropertyModel from '../../models/IRuralPropertyModel';
import IFindOneRuralPropertyDTO from '../../dtos/IFindOneRuralPropertyDTO';
import ICreateRuralPropertyDTO from '../../dtos/ICreateRuralPropertyDTO';
import RuralProperty from '../../infra/typeorm/entities/RuralProperty';

class MockRuralPropertiesRepository implements IRuralPropertiesRepository {
  private ormRepository: IRuralPropertyModel[] = [];

  public async findOne(
    ruralPropertyData: IFindOneRuralPropertyDTO
  ): Promise<IRuralPropertyModel | undefined> {
    const ruralProperty = this.ormRepository.find((ruralProperty) => {
      let match = true;

      for (const key in ruralPropertyData) {
        // @ts-ignore
        if (ruralPropertyData[key] !== ruralProperty[key]) {
          match = false;
          break;
        }
      }

      return match;
    });

    if (!ruralProperty) return undefined;

    return ruralProperty;
  }

  public async findById(id: number): Promise<IRuralPropertyModel | undefined> {
    const ruralProperty = this.ormRepository.find(
      ruralProperty => ruralProperty.id === id
    );

    return ruralProperty;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IRuralPropertyModel[] | undefined> {
    const ruralProperties = this.ormRepository.filter(
      ruralProperty => ruralProperty.company_id === company_id
    );

    return ruralProperties;
  }

  public async create(ruralPropertyData: ICreateRuralPropertyDTO): Promise<IRuralPropertyModel> {
    const ruralProperty = new RuralProperty();

    Object.assign(ruralProperty, {
      id: Date.now(),
      ...ruralPropertyData,
    });

    this.ormRepository.push(ruralProperty);

    return ruralProperty;
  }

  public async save(ruralProperty: IRuralPropertyModel): Promise<IRuralPropertyModel> {
    const ruralPropertyIndex = this.ormRepository.findIndex(
      ruralPropertyData => ruralPropertyData.id === ruralProperty.id
    );

    this.ormRepository[ruralPropertyIndex] = ruralProperty;

    return ruralProperty;
  }
}

export default MockRuralPropertiesRepository;
