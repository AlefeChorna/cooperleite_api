const MAX_DECIMAL_DIGITS = 2;
const DECIMAL_MONEY_SEPARATOR_BRAZIL = '.';

export default function formatToMoney(number: number): number {
  const [integerNumbers, decimalNumbers] = String(number).split(
    DECIMAL_MONEY_SEPARATOR_BRAZIL
  );

  if (!decimalNumbers?.length) {
    return Number(integerNumbers);
  }

  const formatedDecimalNumbers = decimalNumbers.slice(0, MAX_DECIMAL_DIGITS);

  return Number(`${integerNumbers}.${formatedDecimalNumbers}`);
}
