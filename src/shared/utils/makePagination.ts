import dynamicSort from './dynamicSort';

interface Pagination {
  page: number | undefined;
  per_page: number | undefined;
  sort: string;
  direction: 'ASC' | 'DESC';
}

export default function makePagination(
  data: Array<any>, pagination: Pagination
): Array<any> {
  if (!data.length) return [];

  const page = pagination.page ?? 0;
  const perPage = pagination.per_page ?? 0;
  const initialPos = page * perPage;
  const endPos = initialPos + perPage;
  const formattedData = data.slice(initialPos, endPos);
  const sortedData = formattedData.sort(
    dynamicSort(pagination.sort, pagination.direction)
  );

  return sortedData;
}
