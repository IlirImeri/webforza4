"use strict"

module.exports = async function nextpages(fastify, opts) {
  fastify.next("/", (app, req, reply) => {
    app.render(req.raw, reply.raw, "/index", req.query, {})
  })
}
