module.exports = {
  query: {
    type: 'object',
    additionalProperties: false,
    properties: {
      limit: {
        type: 'integer',
        default: 10,
      },
      cursor: {
        type: 'string',
        default: 0,
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
          default: {},
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  is_active: { type: 'boolean' },
                  current_version: { type: 'number' },
                  max_attempts: { type: 'number' },
                  logs_retention: { type: 'string' },
                  created_at: { type: 'string' },
                },
                required: [
                  'id',
                  'name',
                  'is_active',
                  'current_version',
                  'max_attempts',
                  'logs_retention',
                  'created_at',
                ],
                additionalProperties: false,
              },
            },
            _sql: {
              type: 'string',
            },
          },
          required: ['items', '_sql'],
          additionalProperties: false,
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
