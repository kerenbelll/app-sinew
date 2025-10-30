// backend/models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },
  filePath: { type: String, required: true }, // ruta al PDF protegido
}, { timestamps: true });

const Book = mongoose.model('Book', BookSchema);
export default Book;
