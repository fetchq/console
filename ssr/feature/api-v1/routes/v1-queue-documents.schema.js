module.exports = {
  query: {
    type: 'object',
    additionalProperties: false,
    properties: {
      limit: {
        type: 'integer',
        default: 10,
      },
      offset: {
        type: 'number',
        default: 0,
      },
      order: {
        type: 'string',
        default: 'created_at',
        enum: ['created_at', 'next_iteration'],
      },
      direction: {
        type: 'string',
        default: 'desc',
        enum: ['desc', 'asc'],
      },
    },
  },
  response: {
    '2xx': {
      type: 'object',
      required: ['success'],
      properties: {
        success: {
          type: 'boolean',
        },
        data: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                count: { type: 'number' },
                limit: { type: 'number' },
                offset: { type: 'number' },
                order: { type: 'string' },
                direction: { type: 'string' },
              },
              required: ['count', 'limit', 'offset', 'order', 'direction'],
              additionalProperties: false,
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  subject: { type: 'string' },
                  version: { type: 'number' },
                  priority: { type: 'number' },
                  attempts: { type: 'number' },
                  iterations: { type: 'number' },
                  next_iteration: { type: 'string' },
                  lock_upgrade: { type: 'string' },
                  created_at: { type: 'string' },
                  last_iteration: { type: 'string' },
                  payload: {
                    type: 'object',
                    additionalProperties: true,
                  },
                },
                required: [
                  'subject',
                  'version',
                  'priority',
                  'attempts',
                  'iterations',
                  'next_iteration',
                  'lock_upgrade',
                  'created_at',
                  'last_iteration',
                  'payload',
                ],
                additionalProperties: false,
              },
            },
            _sql: { type: 'string' },
          },
          // required: ['pages', 'items'],
          additionalProperties: true,
        },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            required: ['message'],
            properties: {
              message: {
                type: 'string',
              },
            },
          },
          default: [],
        },
      },
    },
  },
};
