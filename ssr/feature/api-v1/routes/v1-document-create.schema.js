module.exports = {
  params: {
    type: 'object',
    properties: {
      queue: { type: 'string' },
    },
    additionalProperties: false,
    required: ['queue'],
  },
  body: {
    type: 'object',
    properties: {
      subject: { type: 'string', default: '' },
      next_iteration: { type: 'string', default: '' },
      priority: { type: 'string', default: 0 },
      version: { type: 'string', default: 0 },
      payload: { type: 'object', additionalProperties: true, default: {} },
    },
    additionalProperties: false,
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
            op: {
              type: 'string',
              enum: ['push', 'append'],
            },
            doc: {
              type: 'object',
              properties: {
                subject: { type: 'string' },
                status: { type: 'number' },
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
                'status',
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
            _sql: { type: 'array', items: { type: 'string' } },
          },
          required: ['op', 'doc'],
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
