import MockProductsRepository from '../repositories/mocks/MockProductsRepository';
import CreateProductService from './CreateProductService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockProductsRepository: MockProductsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let createProductService: CreateProductService;

describe('CreateProductService', () => {
  beforeEach(() => {
    mockProductsRepository = new MockProductsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    createProductService = new CreateProductService(
      mockProductsRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      createProductService.execute({
        name: 'Quirera 30KG',
        price: 20.5,
        quantity: 30,
        unit_measurement: 'KG',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the product category is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    await expect(
      createProductService.execute({
        name: 'Quirera 30KG',
        price: 20.5,
        quantity: 30,
        // @ts-ignore
        unit_measurement: 'KGs',
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to create a new product', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const product = await createProductService.execute({
      name: 'Quirera 30KG',
      price: 20.5001,
      quantity: 30,
      unit_measurement: 'KG',
      operator_id: user.id,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Quirera 30KG');
    expect(product.price).toBe(20.50);
    expect(product.quantity).toBe(30);
    expect(product.unit_measurement).toBe('KG');
    expect(product.operator_id).toBe(user.id);
    expect(product.company_id).toBe(user.company_id);
  })

  it('should be able to delete products cache when a new record is created', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await createProductService.execute({
      name: 'Quirera 30KG',
      price: 20.5,
      quantity: 30,
      unit_measurement: 'KG',
      operator_id: user.id,
    });

    expect(deleteCache).toHaveBeenCalled();
  });
})
