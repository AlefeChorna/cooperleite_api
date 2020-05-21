import { ObjectID } from 'mongodb';

import INotificationsRepository from '../INotificationsRepository';
import ICreateNotificationDTO from '../../dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

class MockNotificationsRepository implements INotificationsRepository {
  private ormRepository: Notification[] = [];

  public async create({
    content,
    recipient_id
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recipient_id
    });

    this.ormRepository.push(notification);

    return notification;
  }
}

export default MockNotificationsRepository;

