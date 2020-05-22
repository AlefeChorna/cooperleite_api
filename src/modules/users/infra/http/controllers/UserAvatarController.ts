import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { user, file } = request;
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);
    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: file.filename,
    });

    return response.json(classToClass(updatedUser));
  }
}
