import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductModel from '../models/IProductModel';
import IProductsReposity from '../repositories/IProductsReposity';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
}

@injectable()
class ListProductsService {
  private productsRepository: IProductsReposity;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('ProductsReposity')
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

  public async execute(
    { operator_id }: IRequest
  ): Promise<IProductModel[] | []> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const productsCacheKey = `products-list:${operator.company_id}`;

    let products = await this.cacheProvider.recover<IProductModel[]>(
      productsCacheKey
    );

    if (!products) {
      products = await this.productsRepository.findByCompanyId(
        operator.company_id
      );

      if (products) {
        await this.cacheProvider.save(productsCacheKey, products);
      }
    }

    return products || [];
  }
}

export default ListProductsService;
