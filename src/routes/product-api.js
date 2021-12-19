import { createController } from 'awilix-koa'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'

import '../lib/passport'
// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = productService => ({
  findProducts: async ctx => ctx.ok(await productService.find(ctx.query)),
  findProduct: async ctx => ctx.ok(await productService.get(ctx.params.id)),
  createProduct: async ctx => ctx.created(await productService.create(ctx)),
  updateProduct: async ctx =>
    ctx.ok(await productService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/product')
  .before([passport.authenticate('jwt', { session: false })])
  .get('', 'findProducts')
  .get('/:id', 'findProduct')
  .post('/', 'createProduct', {
    before: [bodyParser()]
  })
  .put('/:id', 'updateProduct')
