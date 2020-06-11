import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import { parseISO } from 'date-fns';

import ListAnimalsService from '@modules/animals/services/ListAnimalsService';
import ShowAnimalService from '@modules/animals/services/ShowAnimalService';
import CreateAnimalService from '@modules/animals/services/CreateAnimalService';
import UpdateAnimalService from '@modules/animals/services/UpdateAnimalService';

export default class AnimalsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const listAnimalsService = container.resolve(ListAnimalsService);
    const animals = await listAnimalsService.execute({
      operator_id: user.id,
    });

    return response.json(animals);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { id } = request.params;
    const showAnimalService = container.resolve(ShowAnimalService);
    const animal = await showAnimalService.execute({
      operator_id: user.id,
      animal_id: Number(id),
    });

    return response.json({ ...classToClass(animal) });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const {
      name,
      earring_number,
      gender,
      breed,
      weight,
      lactating,
      date_birth,
    } = request.body;
    const createAnimalService = container.resolve(CreateAnimalService);
    const animal = await createAnimalService.execute({
      name,
      earring_number,
      gender,
      breed,
      weight,
      lactating,
      date_birth : date_birth ? parseISO(date_birth) : undefined,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(animal) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const {
      id,
      name,
      earring_number,
      gender,
      breed,
      weight,
      lactating,
      date_birth,
    } = request.body;
    const updateAnimalService = container.resolve(UpdateAnimalService);
    const updatedAnimal = await updateAnimalService.execute({
      id: Number(id),
      name,
      earring_number,
      gender,
      breed,
      weight,
      lactating,
      date_birth : date_birth ? parseISO(date_birth) : undefined,
      operator_id: user.id,
    });

    return response.json({ ...classToClass(updatedAnimal) });
  }
}
