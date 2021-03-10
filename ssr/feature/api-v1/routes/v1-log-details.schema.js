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
              properties: {
                id: { type: 'number' },
                created_at: { type: 'string' },
                subject: { type: 'string' },
                message: { type: 'string' },
                ref_id: { type: 'string' },
                details: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              required: [
                'id',
                'created_at',
                'subject',
                'message',
                'ref_id',
                'details',
              ],
              additionalProperties: false,
            },
            prevLog: { type: 'number', nullable: true },
            nextLog: { type: 'number', nullable: true },
            _sql: { type: 'string' },
          },
          required: ['log'],
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
