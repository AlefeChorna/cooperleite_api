import IProductsReposity from '../IProductsReposity';
import IProductModel from '../../models/IProductModel';
import IFindOneProductDTO from '../../dtos/IFindOneProductDTO';
import ICreateProductDTO from '../../dtos/ICreateProductDTO';
import Product from '../../infra/typeorm/entities/Product';

class MockProductsRepository implements IProductsReposity {
  private ormRepository: IProductModel[] = [];

  public async findOne(
    productData: IFindOneProductDTO
  ): Promise<IProductModel | undefined> {
    const product = this.ormRepository.find((product) => {
      let match = true;

      for (const key in productData) {
        // @ts-ignore
        if (productData[key] !== product[key]) {
          match = false;
          break;
        }
      }

      return match;
    });

    if (!product) return undefined;

    return product;
  }

  public async findById(id: number): Promise<IProductModel | undefined> {
    const product = this.ormRepository.find(
      product => product.id === id
    );

    return product;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IProductModel[] | undefined> {
    const products = this.ormRepository.filter(
      product => product.company_id === company_id
    );

    return products;
  }

  public async create(productsData: ICreateProductDTO): Promise<IProductModel> {
    const product = new Product();

    Object.assign(product, {
      id: Date.now(),
      ...productsData,
    });

    this.ormRepository.push(product);

    return product;
  }

  public async save(product: IProductModel): Promise<IProductModel> {
    const productIndex = this.ormRepository.findIndex(
      productData => productData.id === product.id
    );

    this.ormRepository[productIndex] = product;

    return product;
  }
}

export default MockProductsRepository;
