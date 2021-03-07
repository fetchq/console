module.exports = {
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      id: { type: 'number' },
    },
    additionalProperties: false,
    required: ['name', 'id'],
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
            log: {
              type: 'object',
              // properties: {
              //   subject: { type: 'string' },
              //   version: { type: 'number' },
              //   priority: { type: 'number' },
              //   attempts: { type: 'number' },
              //   iterations: { type: 'number' },
              //   next_iteration: { type: 'string' },
              //   lock_upgrade: { type: 'string' },
              //   created_at: { type: 'string' },
              //   last_iteration: { type: 'string' },
              //   payload: {
              //     type: 'object',
              //     additionalProperties: true,
              //   },
              // },
              // required: [
              //   'subject',
              //   'version',
              //   'priority',
              //   'attempts',
              //   'iterations',
              //   'next_iteration',
              //   'lock_upgrade',
              //   'created_at',
              //   'last_iteration',
              //   'payload',
              // ],
              additionalProperties: true,
            },
            prevLog: { type: 'number', nullable: true },
            nextLog: { type: 'number', nullable: true },
            _sql: { type: 'string' },
          },
          required: ['log'],
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
