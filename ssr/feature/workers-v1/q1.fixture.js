/**
 * Each of those fixtures exposes a "task" and a "handler".
 *
 * The "handler" is setup as route only during testing.
 * (in the future we need to figure out a better way to solve this)
 *
 *
 */

exports.f1 = {
  task: {
    subject: 'foo__t1',
    payload: {
      group_name: 'foo',
      task_name: 't1',
      schedule: {
        value: '+1s',
        method: 'delay',
      },
      action: {
        method: 'webhook',
        request: {
          type: 'rest',
          url: '{{TEST_SERVER_ROOT}}/test/worker/v1/q1/foo__t1',
        },
      },
      payload: {
        count: 1,
      },
    },
  },
  handler: {
    method: 'GET',
    url: '/worker/v1/q1/foo__t1',
    handler: async () => ({ success: true }),
  },
};

exports.f2 = {
  task: {
    subject: 'foo__t2',
    payload: {
      group_name: 'foo',
      task_name: 't1',
      schedule: {
        value: '+1s',
        method: 'delay',
      },
      action: {
        method: 'webhook',
        request: {
          type: 'rest',
          url: '{{TEST_SERVER_ROOT}}/test/worker/v1/q1/foo__t2',
        },
      },
      payload: {
        count: 1,
      },
    },
  },
  handler: {
    method: 'GET',
    url: '/worker/v1/q1/foo__t2',
    handler: async () => ({
      success: true,
      schedule: {
        method: 'delay',
        value: '+1m',
      },
      payload: {
        foo: 'abc',
      },
      logs: [
        {
          message: 'log1',
          details: { a: 123 },
        },
        {
          message: 'log2',
          refId: 'xxx',
        },
      ],
    }),
  },
};

/**
 * Uses a POST webhook that receives variables from the
 * document's payload.
 *
 * The test handler's increases a counter and decorates
 * the payload with more informations.
 *
 * The handler is also responsible for changing the schedule
 * plan
 */
exports.f3 = {
  task: {
    subject: 'foo__t3',
    payload: {
      group_name: 'foo',
      task_name: 't1',
      schedule: {
        method: 'delay',
        value: '+1s',
      },
      action: {
        method: 'webhook',
        request: {
          type: 'rest',
          method: 'POST',
          url: '{{TEST_SERVER_ROOT}}/test/worker/v1/q1/foo__t3',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            payload: 'payload',
          },
        },
      },
      payload: {
        untouched: 'this prop will not be affected by the handler',
        count: 1,
      },
    },
  },
  handler: {
    method: 'POST',
    url: '/worker/v1/q1/foo__t3',
    handler: async (request) => {
      const { payload } = request.body;
      return {
        success: true,
        schedule: {
          method: 'delay',
          value: '+1m',
        },
        payload: {
          ...payload,
          count: payload.count + 1,
          now: new Date(),
        },
      };
    },
  },
};

/**
 * This task's handler returns the payload that was set into the task.
 * it is used to run multiple tests on webhook's response handling & validation.
 */
exports.f4 = {
  task: {
    subject: 'foo__t4',
    payload: {
      group_name: 'foo',
      task_name: 't4',
      schedule: {
        method: 'delay',
        value: '+1s',
      },
      action: {
        method: 'webhook',
        request: {
          type: 'rest',
          method: 'POST',
          url: '{{TEST_SERVER_ROOT}}/test/worker/v1/q1/foo__t4',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            payload: 'payload',
          },
        },
      },
      payload: {},
    },
  },
  handler: {
    method: 'POST',
    url: '/worker/v1/q1/foo__t4',
    handler: async (request, reply) => {
      // Honors the request to spit out a custom
      // response code
      if (request.body.payload.status) {
        const { status, payload = {} } = request.body.payload;
        return reply.code(status).send(payload);
      }

      return request.body.payload;
    },
  },
};

exports.f5 = {
  task: {
    subject: 'foo__t5',
    payload: {
      group_name: 'foo',
      task_name: 't5',
      schedule: {
        method: 'delay',
        value: '+1ms',
      },
      action: {
        method: 'webhook',
        request: {
          type: 'rest',
          method: 'POST',
          url: '{{TEST_SERVER_ROOT}}/test/worker/v1/q1/foo__t5',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            payload: 'payload',
          },
        },
      },
      payload: {},
    },
  },
  handler: {
    method: 'POST',
    url: '/worker/v1/q1/foo__t5',
    handler: async (request, reply) => {
      const { iterations = 0, iterationsLimit = 1 } = request.body || {};
      console.info({ iterations, iterationsLimit });

      // When hits iteration limit, try to complete the process
      // TODO: return a "schedule.method: 'complete'"
      if (iterations >= iterationsLimit) {
        return {
          success: true,
          schedule: {
            method: 'delay',
            value: '+100y',
          },
        };
      }

      return {
        success: true,
        logs: [
          {
            message: `log for iteration: ${iterations}`,
            details: request.body,
          },
        ],
      };
    },
  },
};
