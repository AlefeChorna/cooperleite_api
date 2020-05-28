import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateRuralPropertyService from '@modules/rural-properties/services/CreateRuralPropertyService';

export default class RuralPropertiesController {
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
}
