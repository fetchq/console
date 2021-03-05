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
          default: {},
          properties: {
            doc: {
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
            _sql: { type: 'string' },
          },
          required: ['doc'],
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
