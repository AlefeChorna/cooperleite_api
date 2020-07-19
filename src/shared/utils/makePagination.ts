import dynamicSort from './dynamicSort';

interface Metadata {
  dataLength: number,
  pagination: Pagination,
}

interface MakeMetadataReturn {
  total: number;
  page: number;
  per_page: number;
  sort: string;
  direction: string;
}

interface Pagination {
  page: number | undefined;
  per_page: number | undefined;
  sort: string;
  direction: 'ASC' | 'DESC';
}

interface MakePaginationReturn {
  data: Array<any>;
  meta: MakeMetadataReturn;
}

function makeMetadata({ dataLength, pagination }: Metadata): MakeMetadataReturn {
  return {
    total: dataLength,
    page: pagination.page ?? 0,
    per_page: pagination.per_page ?? 0,
    sort: pagination.sort,
    direction: pagination.direction,
  }
}

export default function makePagination(
  data: Array<any>, pagination: Pagination
): MakePaginationReturn {
  const page = pagination.page ?? 0;
  const perPage = pagination.per_page ?? 0;

  if (!data.length) {
    return {
      data: [],
      meta: makeMetadata({ dataLength: data.length, pagination }),
    };
  }

  const initialPos = page * perPage;
  const endPos = initialPos + perPage;
  const sortedData = data.sort(
    dynamicSort(pagination.sort, pagination.direction)
  );
  const formattedData = sortedData.slice(initialPos, endPos);

  return {
    data: formattedData,
    meta: makeMetadata({ dataLength: data.length, pagination }),
  };
}
