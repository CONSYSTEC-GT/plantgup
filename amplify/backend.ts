import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myFirstFunction } from './my-first-function/resource';

// Define el backend con los recursos principales
const backend = defineBackend({
  auth,
  data,
  myFirstFunction,
});