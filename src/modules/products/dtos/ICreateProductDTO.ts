import { ICategories } from '../models/IProductModel';

export default interface ICreateProductDTO {
  name: string;
  price: number;
  quantity: number;
  unit_measurement: ICategories;
  company_id: string;
  operator_id: string;
}
