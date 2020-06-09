import MockProductsRepository from '../repositories/mocks/MockProductsRepository';
import ShowProductService from './ShowProductService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockProductsRepository: MockProductsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let showProductService: ShowProductService;

describe('ShowProductService', () => {
  beforeEach(() => {
    mockProductsRepository = new MockProductsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    showProductService = new ShowProductService(
      mockProductsRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      showProductService.execute({
        operator_id: 'non-existing-operator',
        product_id: 1
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return undefined if a product is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const product = await showProductService.execute({
      operator_id: user.id,
      product_id: 1
    });

    expect(product).toBe(undefined);
  })

  it('should be able to show a product', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const product = await mockProductsRepository.create({
      name: 'Quirera 10KG',
      price: 32.99,
      quantity: 20.50,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const productFound = await showProductService.execute({
      operator_id: user.id,
      product_id: product.id,
    });

    expect(productFound?.id).toBe(product.id);
    expect(productFound?.name).toBe('Quirera 10KG');
    expect(productFound?.price).toBe(32.99);
    expect(productFound?.quantity).toBe(20.50);
    expect(productFound?.unit_measurement).toBe('KG');
    expect(productFound?.operator_id).toBe(product.operator_id);
    expect(productFound?.company_id).toBe(product.company_id);
  })

  it('should be able to recover the cache of product when the record is showed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await showProductService.execute({
      operator_id: user.id,
      product_id: 1,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `product-show:${user.company_id}:1`
    );
  });

  it('should be able to save the cache of product', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    const product = await mockProductsRepository.create({
      name: 'Quirera 10KG',
      price: 32.99,
      quantity: 20.50,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await showProductService.execute({
      operator_id: user.id,
      product_id: product.id,
    });

    expect(saveCache).toHaveBeenCalled();
  });
})
