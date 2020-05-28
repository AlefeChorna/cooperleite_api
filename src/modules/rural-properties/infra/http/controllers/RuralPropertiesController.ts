import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass, classToPlain } from 'class-transformer';

import CreateRuralPropertyService from '@modules/rural-properties/services/CreateRuralPropertyService';
import UpdateRuralPropertyService from '@modules/rural-properties/services/UpdateRuralPropertyService';
import ListRuralPropertiesService from '@modules/rural-properties/services/ListRuralPropertiesService';

export default class RuralPropertiesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const listRuralPropertiesService = container.resolve(ListRuralPropertiesService);
    const ruralProperties = await listRuralPropertiesService.execute({
      operator_id: user.id,
    });

    return response.json(ruralProperties);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { name, city, state } = request.body;
    const createRuralPropertyService = container.resolve(CreateRuralPropertyService);
    const ruralProperty = await createRuralPropertyService.execute({
      name,
      city,
      state,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(ruralProperty) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, city, state, operator_id } = request.body;
    const updateRuralPropertyService = container.resolve(UpdateRuralPropertyService);
    const updatedRuralProperty = await updateRuralPropertyService.execute({
      id,
      name,
      city,
      state,
      operator_id,
    });

    return response.json({ ...classToClass(updatedRuralProperty) });
  }
}
