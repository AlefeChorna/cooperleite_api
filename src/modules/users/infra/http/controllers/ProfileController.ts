import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const showProfileService = container.resolve(ShowProfileService);
    const profile = await showProfileService.execute({ user_id: user.id });

    return response.json(classToClass(profile));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const { name, email, old_password, new_password } = request.body;
    const updateProfileService = container.resolve(UpdateProfileService);
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name,
      email,
      old_password,
      new_password
    });

    return response.json(classToClass(updatedUser));
  }
}
