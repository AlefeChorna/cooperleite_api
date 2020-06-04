import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProductsService from '@modules/products/services/ListProductsService';
import ShowProductService from '@modules/products/services/ShowProductService';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const listProductsService = container.resolve(ListProductsService);
    const products = await listProductsService.execute({
      operator_id: user.id,
    });

    return response.json(products);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { id } = request.params;
    const showProductService = container.resolve(ShowProductService);
    const product = await showProductService.execute({
      operator_id: user.id,
      product_id: Number(id),
    });

    return response.json({ ...classToClass(product) });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { name, price, quantity, unit_measurement } = request.body;
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price,
      quantity,
      unit_measurement,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(product) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { id, name, price, quantity, unit_measurement } = request.body;
    const updateProductService = container.resolve(UpdateProductService);
    const updatedProduct = await updateProductService.execute({
      id,
      name,
      price,
      quantity,
      unit_measurement,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(updatedProduct) });
  }
}
