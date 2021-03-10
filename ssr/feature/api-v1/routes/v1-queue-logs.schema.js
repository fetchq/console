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
        default: 'id',
        enum: ['id', 'created_at', 'subject'],
      },
      direction: {
        type: 'string',
        default: 'desc',
        enum: ['desc', 'asc'],
      },
      subject: {
        type: 'string',
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
                  id: { type: 'number' },
                  created_at: { type: 'string' },
                  subject: { type: 'string' },
                  message: { type: 'string' },
                  ref_id: { type: 'string' },
                },
                required: ['id', 'created_at', 'subject', 'message', 'ref_id'],
                additionalProperties: false,
              },
            },
            _sql: { type: 'string' },
          },
          required: ['pagination', 'items'],
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
