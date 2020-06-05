import { IGender } from '../models/IAnimalModel';

export default interface ICreateAnimalDTO {
  name: string;
  gender: string | IGender;
  breed?: string;
  weight: number;
  earring_number: number;
  lactating?: boolean;
  company_id: string;
  operator_id: string;
  date_birth?: string;
}
