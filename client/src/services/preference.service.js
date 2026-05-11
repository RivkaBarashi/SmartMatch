import { register } from './auth.service';

export const completeRegistration = (data) => {
  return register(data);
};
