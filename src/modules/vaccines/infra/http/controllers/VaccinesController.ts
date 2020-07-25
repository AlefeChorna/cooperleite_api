import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListVaccinesService from '@modules/vaccines/services/ListVaccinesService';
import ShowVaccineService from '@modules/vaccines/services/ShowVaccineService';
import CreateVaccineService from '@modules/vaccines/services/CreateVaccineService';
import UpdateVaccineService from '@modules/vaccines/services/UpdateVaccineService';
import makePagination from '@shared/utils/makePagination';

export default class VaccinesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user, queryParams } = request;
    const listVaccinesService = container.resolve(ListVaccinesService);
    const vaccines = await listVaccinesService.execute({
      operator_id: user.id,
    });

    return response.json(makePagination(vaccines, queryParams));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { id } = request.params;
    const showVaccineService = container.resolve(ShowVaccineService);
    const vaccine = await showVaccineService.execute({
      operator_id: user.id,
      vaccine_id: Number(id),
    });

    return response.json({ ...classToClass(vaccine) });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { name } = request.body;
    const createVaccineService = container.resolve(CreateVaccineService);
    const vaccine = await createVaccineService.execute({
      name,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(vaccine) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { user } = request;
    const { name } = request.body;
    const updateVaccineService = container.resolve(UpdateVaccineService);
    const updatedVaccine = await updateVaccineService.execute({
      id: Number(id),
      name,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(updatedVaccine) });
  }
}
