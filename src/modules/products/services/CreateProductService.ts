import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductModel, { ICategories } from '../models/IProductModel';
import IProductsReposity from '../repositories/IProductsReposity';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import categories from '../utils/categories';
import formatToMoney from '@shared/utils/number/formatToMoney';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
  unit_measurement: ICategories;
  operator_id: string;
}

@injectable()
class CreateProductService {
  private productsRepository: IProductsReposity;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('ProductsRepository')
    productsRepository: IProductsReposity,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.productsRepository = productsRepository;
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
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

    const categoryExists = categories.hasOwnProperty(unit_measurement);
    if (!categoryExists) {
      throw new AppError('Product category not found', 422);
    }

    const product = await this.productsRepository.create({
      name,
      price: formatToMoney(price),
      quantity,
      unit_measurement,
      operator_id,
      company_id: operator.company_id
    });

    await this.cacheProvider.delete(
      `products-list:${operator.company_id}`
    );

    return product;
  }
}

export default CreateProductService;
