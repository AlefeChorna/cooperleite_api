import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductModel from '../models/IProductModel';
import IProductsReposity from '../repositories/IProductsReposity';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
  product_id: number;
}

@injectable()
class ShowProductService {
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
    operator_id,
    product_id
  }: IRequest): Promise<IProductModel | undefined> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const productCacheKey =
      `product-show:${operator.company_id}:${product_id}`;

    let product = await this.cacheProvider.recover<IProductModel>(
      productCacheKey
    );

    if (!product) {
      product = await this.productsReposity.findOne({
        id: product_id,
        company_id: operator.company_id,
      });

      if (product) {
        await this.cacheProvider.save(productCacheKey, product);
      }
    }

    return product;
  }
}

export default ShowProductService;
