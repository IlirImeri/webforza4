"use strict"
// import AutoLoad from "fastify-autoload"
// import Sensible from "fastify-sensible"
// import Env from "fastify-env"
// import UnderPressure from "under-pressure"
// import S from "fluent-json-schema"
// import { join } from "desm"
// import fastifyNext from "fastify-nextjs"

const AutoLoad = require("fastify-autoload")
const Sensible = require("fastify-sensible")
const Env = require("fastify-env")
const UnderPressure = require("under-pressure")
const S = require("fluent-json-schema")
const path = require("path")
const fastifyNext = require("fastify-nextjs")

module.exports = async function (fastify, opts) {
  // It's very common to pass secrets and configuration
  // to you application via environment variables.
  // The `fastify-env` plugin will expose those configuration
  // under `fastify.config` and validate those at startup.
  fastify.register(Env, {
    schema: S.object()
      .prop("NODE_ENV", S.string().required())
      .prop("COOKIE_SECRET", S.string().required())
      .valueOf(),
  })

  // Fastify is an extremely lightweight framework, it does very little for you.
  // Every feature you might need, such as cookies or database coonnectors
  // is provided by external plugins.
  // See the list of recognized plugins  by the core team! https://www.fastify.io/ecosystem/
  // `fastify-sensible` adds many  small utilities, such as nice http errors.
  fastify.register(Sensible)

  // This plugin is especially useful if you expect an high load
  // on your application, it measures the process load and returns
  // a 503 if the process is undergoing too much stress.
  fastify.register(UnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
  })

  // This plugin allows to execute the react server side rendering with NextJS Framework
  // you must declare your routes inside the after callback or with the fastify.next
  fastify.register(fastifyNext, { dev: true })

  // Normally you would need to load by hand each plugin. `fastify-autoload` is an utility
  // we wrote to solve this specific problems. It loads all the content from the specified
  // folder, even the subfolders. Take at look at its documentation, as it's doing a lot more!
  // First of all, we require all the plugins that we'll need in our application.
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  })

  // Then, we'll load all of our routes.
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts),
  })
}
