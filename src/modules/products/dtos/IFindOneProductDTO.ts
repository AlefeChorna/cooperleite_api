import { ICategories } from '../models/IProductModel';

export default interface IFindOneProductDTO {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  unit_measurement?: ICategories;
  company_id?: string;
  operator_id?: string;
  created_at?: string;
  updated_at?: string;
}
