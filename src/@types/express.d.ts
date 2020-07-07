declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    queryParams: {
      page: number | undefined;
      per_page: number | undefined;
      sort: string;
      direction: 'ASC' | 'DESC'
    }
  }
}
