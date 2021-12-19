import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data => pick(data, ['name', 'slug', 'price', 'description'])

/**
 * Product Service.
 */
export default class ProductService {
  constructor(productStore) {
    this.store = productStore
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof ProductService
   */
  async find(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const products = await this.store.paginate(query, options)
    if (!products) {
      throw new Error('There was an error retrieving products.')
    }

    return products
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof ProductService
   */
  async filter(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const products = await this.store.paginate(query, options)
    if (!products) {
      throw new Error('There was an error retrieving products by filter.')
    } else {
      return products
    }
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof ProductService
   */
  async get(id) {
    assertId(id)
    // If `Store.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`Product with id "${id}" not found`))
  }

  /**
   *
   *
   * @param {*} ctx
   * @returns
   * @memberof ProductService
   */
  async create(ctx) {
    const _id = ctx.state.user._id

    const picked = pickProps(ctx.request.body)
    return this.store.create({ ...picked, user: _id })
  }

  /**
   *
   *
   * @param {*} id
   * @param {*} data
   * @returns
   * @memberof ProductService
   */
  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No product payload given')
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
   * @memberof ProductService
   */
  async remove(id) {
    // Make sure the model exists by calling `get`.
    return this.store.remove(await this.get(id))
  }
}
