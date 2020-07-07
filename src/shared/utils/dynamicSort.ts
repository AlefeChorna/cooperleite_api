
type SortDirection = 'ASC' | 'DESC';

const SORT_DIRECTION = {
  ASC: 1,
  NEUTRAL: 0,
  DESC: -1,
}

export default function dynamicSort(
  property: string,
  direction: SortDirection
) {
  const sortOrder = SORT_DIRECTION[direction];

  return function (a: any, b: any) {
    let result = SORT_DIRECTION.NEUTRAL;

    if (a[property] > b[property]) {
      result = SORT_DIRECTION.ASC;
    }

    if (a[property] < b[property]) {
      result = SORT_DIRECTION.DESC;
    }

    return result * sortOrder;
  }
}
