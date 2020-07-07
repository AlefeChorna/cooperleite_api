import { Request, Response, NextFunction } from 'express';

export interface APIQueryParams {
  page: number | undefined;
  per_page: number | undefined;
  sort: string;
  direction: 'ASC' | 'DESC';
}

export default async function pagination(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      page = 0,
      per_page = 10,
      sort = 'id',
      direction = 'desc',
    } = request.query;

    request.queryParams = {
      page: Number(page),
      per_page: Number(per_page),
      sort: String(sort),
      direction: direction === 'asc' ? 'ASC' : 'DESC',
    }

    return next();
  } catch {}
}
