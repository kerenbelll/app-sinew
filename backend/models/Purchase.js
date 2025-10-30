// backend/models/Purchase.js (ESM)
import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookId: String,
  purchaseDate: { type: Date, default: Date.now },
  price: Number,
  currency: { type: String, default: 'EUR' },  // <-- agregado
  status: { type: String, default: 'paid' },
  orderId: { type: String, index: true, unique: true }, // <-- agregado para idempotencia
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', PurchaseSchema);
export default Purchase;
