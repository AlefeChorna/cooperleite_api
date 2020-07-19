import { ValidationError } from 'joi';

export default function formatJoiError(errors: ValidationError) {
  const messages = {}

  errors.details.map((error) => {
    Object.assign(messages, { [error?.context?.key || '']: error.message });
  });

  return messages;
}
