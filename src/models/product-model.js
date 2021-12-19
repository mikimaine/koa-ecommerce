import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

/**
 *
 *
 * @export
 * @param {*} logger
 * @returns
 */
export default function createProductModel(logger) {
  var Schema = mongoose.Schema

  /**
   * ProductSchema
   */
  const ProductSchema = new Schema({
    name: { type: String, default: '' },
    slug: { type: String, default: '' },
    price: { type: Number, default: 0.0 },
    description: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    active: { type: Boolean, default: true }
  })

  /**
   * Model attributes to expose
   */
  ProductSchema.statics.attributes = {
    _id: 1,
    name: 1,
    slug: 1,
    price: 1,
    description: 1,
    user: 1,
    active: 1
  }

  ProductSchema.plugin(mongoosePaginate)

  return mongoose.model('Product', ProductSchema)
}
