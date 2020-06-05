export type IGender = 'M' | 'F';

export default interface IAnimalModel {
  id: number;
  name: string;
  gender: string | IGender;
  breed: string;
  weight: number;
  earring_number: number;
  lactating: boolean;
  company_id: string;
  operator_id: string;
  date_birth: string;
  created_at: string;
  updated_at: string;
}
