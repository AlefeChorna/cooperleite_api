export type ICategories =
  'KG' |
  'GR' |
  'UN' |
  'LT' |
  'ML';

export default interface IProductModel {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit_measurement: string | ICategories;
  company_id: string;
  operator_id: string;
  created_at: string;
  updated_at: string;
}
