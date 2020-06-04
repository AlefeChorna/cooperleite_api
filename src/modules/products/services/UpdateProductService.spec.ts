import MockProductsRepository from '../repositories/mocks/MockProductsRepository';
import UpdateProductService from './UpdateProductService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockProductsRepository: MockProductsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let updateProductService: UpdateProductService;

describe('UpdateProductService', () => {
  beforeEach(() => {
    mockProductsRepository = new MockProductsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    updateProductService = new UpdateProductService(
      mockProductsRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      updateProductService.execute({
        id: 1,
        name: 'Quirera 20 KG',
        price: 50.9999,
        quantity: 35,
        unit_measurement: 'LT',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the product is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await expect(
      updateProductService.execute({
        id: 1,
        name: 'Quirera 20 KG',
        price: 50.9999,
        quantity: 35,
        unit_measurement: 'LT',
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the product category is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const product = await mockProductsRepository.create({
      name: 'Quirera 30KG',
      price: 20.5,
      quantity: 30,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await expect(
      updateProductService.execute({
        id: product.id,
        name: 'Quirera 30KG',
        price: 20.5,
        quantity: 30,
        // @ts-ignore
        unit_measurement: 'KGs',
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update a product', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const product = await mockProductsRepository.create({
      name: 'Quirera 30KG',
      price: 20.5,
      quantity: 30,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const updatedProduct = await updateProductService.execute({
      id: product.id,
      name: 'Quirera 20 KG',
      price: 50.9999,
      quantity: 35.5,
      unit_measurement: 'LT',
      operator_id: user.id,
    });

    expect(updatedProduct.id).toBe(product.id);
    expect(updatedProduct.name).toBe('Quirera 20 KG');
    expect(updatedProduct.price).toBe(50.99);
    expect(updatedProduct.quantity).toBe(35.5);
    expect(updatedProduct.unit_measurement).toBe('LT');
    expect(updatedProduct.operator_id).toBe(product.operator_id);
    expect(updatedProduct.company_id).toBe(product.company_id);

    const updatedProduct2 = await updateProductService.execute({
      id: product.id,
      price: 120.2,
      operator_id: user.id,
    });

    expect(updatedProduct2.id).toBe(updatedProduct.id);
    expect(updatedProduct2.name).toBe(updatedProduct.name);
    expect(updatedProduct2.price).toBe(120.2);
    expect(updatedProduct2.quantity).toBe(updatedProduct.quantity);
    expect(updatedProduct2.unit_measurement).toBe(updatedProduct.unit_measurement);

    const updatedProduct3 = await updateProductService.execute({
      id: product.id,
      quantity: 2.4565,
      operator_id: user.id,
    });

    expect(updatedProduct3.id).toBe(updatedProduct2.id);
    expect(updatedProduct3.name).toBe(updatedProduct2.name);
    expect(updatedProduct3.price).toBe(updatedProduct2.price);
    expect(updatedProduct3.quantity).toBe(2.4565);
    expect(updatedProduct3.unit_measurement).toBe(updatedProduct2.unit_measurement);
  })

  it('should be able to delete products cache when a record is updated', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const product = await mockProductsRepository.create({
      name: 'Quirera 30KG',
      price: 20.5,
      quantity: 30,
      unit_measurement: 'KG',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await updateProductService.execute({
      id: product.id,
      name: 'Quirera 20 KG',
      price: 50.9999,
      quantity: 35.5,
      unit_measurement: 'LT',
      operator_id: user.id,
    });

    expect(deleteCache).toHaveBeenCalledTimes(2);
  })
})
