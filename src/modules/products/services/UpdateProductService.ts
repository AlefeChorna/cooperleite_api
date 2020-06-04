import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductModel, { ICategories } from '../models/IProductModel';
import IProductsReposity from '../repositories/IProductsReposity';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import formatToMoney from '@shared/utils/number/formatToMoney';
import categories from '../utils/categories';

interface IRequest {
  id: number;
  name?: string;
  price?: number;
  quantity?: number;
  unit_measurement?: ICategories;
  operator_id: string;
}

@injectable()
class UpdateProductService {
  private productsReposity: IProductsReposity;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('ProductsReposity')
    productsReposity: IProductsReposity,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.productsReposity = productsReposity;
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    id,
    name,
    price,
    quantity,
    unit_measurement,
    operator_id,
  }: IRequest): Promise<IProductModel> {
    const operator = await this.usersRepository.findById(operator_id);
    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const product = await this.productsReposity.findById(id);
    if (!product) {
      throw new AppError('Product not found', 422);
    }

    const categoryExists = categories.hasOwnProperty(unit_measurement || '');
    if (!categoryExists && unit_measurement) {
      throw new AppError('Product category not found', 422);
    }

    Object.assign(product, {
      name: name ?? product.name,
      quantity: quantity ?? product.quantity,
      unit_measurement: unit_measurement ?? product.unit_measurement,
    });

    if (price) {
      Object.assign(product, { price: formatToMoney(price) });
    }

    const updatedProduct = await this.productsReposity.save(product);

    await this.cacheProvider.delete(
      `products-list:${operator.company_id}`
    );
    await this.cacheProvider.delete(
      `product-show:${operator.company_id}:${updatedProduct.id}`
    );

    return updatedProduct;
  }
}

export default UpdateProductService;
