import { getRepository, Repository } from 'typeorm';

import IProductsReposity from '@modules/products/repositories/IProductsReposity';
import IProductModel from '@modules/products/models/IProductModel';
import IFindOneProductDTO from '@modules/products/dtos/IFindOneProductDTO';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '../entities/Product';

class ProductsRepository implements IProductsReposity {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findOne(
    data: IFindOneProductDTO
  ): Promise<IProductModel | undefined> {
    const product = await this.ormRepository.findOne(data);

    return product;
  }

  public async findById(id: number): Promise<IProductModel | undefined> {
    const product = await this.ormRepository.findOne(id);

    return product;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IProductModel[] | undefined> {
    const products = await this.ormRepository.find({ company_id });

    return products;
  }

  public async create(data: ICreateProductDTO): Promise<IProductModel> {
    const product = this.ormRepository.create(data);

    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: IProductModel): Promise<IProductModel> {
    return await this.ormRepository.save(product);
  }
}

export default ProductsRepository
