import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

/**
 *
 *
 * @export
 * @param {*} logger
 * @returns
 */
export default function createOrderModel(logger) {
  var Schema = mongoose.Schema

  /**
   * OrderSchema
   */
  const OrderSchema = new Schema({
    total: { type: Number, default: 0.0 },
    status: { type: String, default: 'INITIALIZING' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    active: { type: Boolean, default: true },
    created_at: { type: Date },
    updated_at: { type: Date }
  })

  /**
   * Model attributes to expose
   */
  OrderSchema.statics.attributes = {
    _id: 1,
    total: 1,
    status: 1,
    products: 1,
    user: 1,
    active: 1,
    created_at: 1,
    updated_at: 1
  }

  OrderSchema.plugin(mongoosePaginate)

  return mongoose.model('Order', OrderSchema)
}
