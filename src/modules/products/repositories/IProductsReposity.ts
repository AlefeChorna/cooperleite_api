import IProductModel from '../models/IProductModel';
import IFindOneProductDTO from '../dtos/IFindOneProductDTO';
import ICreateProductDTO from '../dtos/ICreateProductDTO';

export default interface IProductsReposity {
  findOne(product: IFindOneProductDTO): Promise<IProductModel | undefined>;
  findById(id: number): Promise<IProductModel | undefined>;
  findByCompanyId(company_id: string): Promise<IProductModel[] | undefined>;
  create(data: ICreateProductDTO): Promise<IProductModel>;
  save(product: IProductModel): Promise<IProductModel>;
}
