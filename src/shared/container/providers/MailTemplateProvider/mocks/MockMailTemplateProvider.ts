import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class MockMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ file }: IParseMailTemplateDTO): Promise<string> {
    return 'Mock Mail content';
  }
}

export default MockMailTemplateProvider
