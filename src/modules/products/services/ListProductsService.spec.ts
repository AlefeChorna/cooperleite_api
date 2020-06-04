import MockProductsRepository from '../repositories/mocks/MockProductsRepository';
import ListProductsService from './ListProductsService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockProductsRepository: MockProductsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let listProductsService: ListProductsService;

describe('ListProductsService', () => {
  beforeEach(() => {
    mockProductsRepository = new MockProductsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    listProductsService = new ListProductsService(
      mockProductsRepository,
      mockUsersRepository,
      mockCacheProvider,
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      listProductsService.execute({
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return an empty array if the user does not have registered products', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const products = await listProductsService.execute({
      operator_id: user.id,
    });

    expect(products).toStrictEqual([]);
  })

  it('should be able to list products', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await mockProductsRepository.create({
      name: 'Quirera 10KG',
      price: 12.12,
      quantity: 10,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const products = await listProductsService.execute({
      operator_id: user.id,
    });

    expect(products[0]).toHaveProperty('id');
    expect(products[0].name).toBe('Quirera 10KG');
    expect(products[0].price).toBe(12.12);
    expect(products[0].quantity).toBe(10);
    expect(products[0].unit_measurement).toBe('KG');
    expect(products[0].operator_id).toBe(user.id);
    expect(products[0].company_id).toBe(user.company_id);
  })

  it('should be able to recover the cache of products when records are listed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await listProductsService.execute({
      operator_id: user.id,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `products-list:${user.company_id}`
    );
  })

  it('should be able to save the cache of products', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    await mockProductsRepository.create({
      name: 'Quirera 10KG',
      price: 12.12,
      quantity: 10,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await listProductsService.execute({
      operator_id: user.id,
    });

    expect(saveCache).toHaveBeenCalled();
  });
})
