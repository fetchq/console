module.exports = {
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    additionalProperties: false,
    required: ['name'],
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
            was_dropped: { type: 'boolean' },
            _sql: { type: 'string' },
          },
          required: ['was_dropped'],
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
