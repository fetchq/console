module.exports = {
  query: {
    type: 'object',
    additionalProperties: false,
    properties: {
      limit: {
        type: 'integer',
        default: 10,
      },
      order: {
        type: 'string',
        default: 'created_at',
        enum: ['created_at', 'next_iteration'],
      },
      dir: {
        type: 'string',
        default: 'desc',
        enum: ['desc', 'asc'],
      },
      cursor: {
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
            pages: {
              type: 'object',
              properties: {
                itemsCount: { type: 'number' },
                pagesCount: { type: 'number' },
                pageSize: { type: 'number' },
                cursorStart: { type: 'string' },
                cursorEnd: { type: 'string' },
                hasNext: { type: 'boolean' },
              },
              required: [
                'pagesCount',
                'itemsCount',
                'pageSize',
                'cursorStart',
                'cursorEnd',
                'hasNext',
              ],
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
          required: ['pages', 'items'],
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
