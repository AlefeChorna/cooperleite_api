import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { user } = request;
    const showProfileService = container.resolve(ShowProfileService);
    const profile = await showProfileService.execute({ user_id: user.id });

    delete profile.password;

    return response.json(profile);
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

    delete updatedUser.password;

    return response.json(updatedUser);
  }
}
