import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data => pick(data, ['products'])

/**
 * Order Service.
 */
export default class OrderService {
  constructor(orderStore, productStore) {
    this.store = orderStore
    this.productStore = productStore
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof OrderService
   */
  async find(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const orders = await this.store.paginate(query, options)
    if (!orders) {
      throw new Error('There was an error retrieving orders.')
    }

    return orders
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof OrderService
   */
  async filter(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const orders = await this.store.paginate(query, options)
    if (!orders) {
      throw new Error('There was an error retrieving orders by filter.')
    } else {
      return orders
    }
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof OrderService
   */
  async get(id) {
    assertId(id)
    // If `Store.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`order with id "${id}" not found`))
  }

  /**
   *
   *
   * @param {*} ctx
   * @returns
   * @memberof OrderService
   */
  async create(ctx) {
    const _id = ctx.state.user._id

    // formal file upload needs to be done
    const picked = pickProps(ctx.request.body)

    const products = await this.productStore.findMany(picked.products)
    const total = products.reduce((acc, product) => acc + product.price, 0)
    return this.store.create({
      ...picked,
      total,
      status: 'COMPLETE',
      user: _id
    })
  }

  /**
   *
   *
   * @param {*} id
   * @param {*} data
   * @returns
   * @memberof OrderService
   */
  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No order payload given')
    // Make sure the model exists by calling `get`.
    await this.get(id)

    // Prevent overposting.
    const picked = pickProps(data)
    return this.store.update(id, picked)
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof OrderService
   */
  async remove(id) {
    // Make sure the model exists by calling `get`.
    return this.store.remove(await this.get(id))
  }
}
