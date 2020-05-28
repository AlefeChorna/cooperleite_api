import IRuralPropertiesRepository from '../IRuralPropertiesRepository';
import IRuralPropertyModel from '../../models/IRuralPropertyModel';
import ICreateRuralProperty from '../../dtos/ICreateRuralProperty';
import RuralProperties from '../../infra/typeorm/entities/RuralProperties';

class MockRuralPropertiesRepository implements IRuralPropertiesRepository {
  private ormRepository: IRuralPropertyModel[] = [];

  public async findById(id: number): Promise<IRuralPropertyModel | undefined> {
    const ruralProperty = this.ormRepository.find(
      ruralProperty => ruralProperty.id === id
    );

    return ruralProperty;
  }

  public async create(data: ICreateRuralProperty): Promise<IRuralPropertyModel> {
    const ruralProperty = new RuralProperties();

    Object.assign(ruralProperty, {
      id: Date.now(),
      ...data,
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
