export default interface ICreateAnimalVaccineDTO {
  vaccine_id: number;
  animal_id: number;
  applied_at: Date;
  lack_at: Date;
  company_id: string;
  operator_id: string;
}
