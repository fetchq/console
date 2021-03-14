module.exports = {
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      subject: { type: 'string' },
    },
    additionalProperties: false,
    required: ['name', 'subject'],
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
            _sql: { type: 'string' },
          },
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
