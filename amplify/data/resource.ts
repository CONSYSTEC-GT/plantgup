import { defineData } from '@aws-amplify/backend';

export const data = defineData({
  schema: {
    Todo: {
      content: 'string',
      done: 'boolean',
    },
  },
});