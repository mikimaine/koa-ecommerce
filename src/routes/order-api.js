import { createController } from 'awilix-koa'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'

import '../lib/passport'
// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = orderService => ({
  findOrders: async ctx => ctx.ok(await orderService.find(ctx.query)),
  findOrder: async ctx => ctx.ok(await orderService.get(ctx.params.id)),
  createOrder: async ctx => ctx.created(await orderService.create(ctx)),
  updateOrder: async ctx =>
    ctx.ok(await orderService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/order')
  .before([passport.authenticate('jwt', { session: false })])
  .get('', 'findOrders')
  .get('/:id', 'findOrder')
  .post('/', 'createOrder', {
    before: [bodyParser()]
  })
  .put('/:id', 'updateOrder')
