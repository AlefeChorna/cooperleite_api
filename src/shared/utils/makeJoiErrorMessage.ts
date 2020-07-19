import { ValidationErrorItem, ValidationErrorFunction } from 'joi';

interface ErrorMessage {
  required: string;
  empty: string;
  numberBase: string;
}

export default function makeJoiErrorMessage(
  errorMessage?: ErrorMessage
): ValidationErrorFunction {
  return function (errors: ValidationErrorItem[]) {
    errors.forEach(error => {
      // @ts-ignore
      switch (error.code) {
        case 'any.empty': {
          error.message = errorMessage?.empty ?? 'Campo não pode ficar vazio';
          break;
        }
        case 'any.required': {
          error.message = errorMessage?.required ?? 'Campo Obrigatório';
          break;
        }
        case 'number.base': {
          error.message =
            errorMessage?.numberBase ?? 'Campo preenchido incorretamente';
          break;
        }
        default: {
          error.message = 'Campo Obrigatório';
          break;
        }
      }
    });

    return errors;
  }
}
