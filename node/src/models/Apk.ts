import mongoose, { Document, Schema } from 'mongoose';
import { Variant, Apk } from '../types';

/**
 * @name IApk
 * @description Interface for the Apk document, extending Mongoose Document and Apk type.
 */
interface IApk extends Document, Apk {}

/**
 * @name variantSchema
 * @description Mongoose schema for the Variant subdocument.
 * @property {string} variant - The variant identifier.
 * @property {string} type - The type of the variant.
 * @property {string} arch - The architecture of the variant.
 * @property {string} version - The version of the variant.
 * @property {string} dpi - The dpi of the variant.
 */
const variantSchema = new Schema<Variant>({
  variant: { type: String, required: true },
  type: { type: String, required: true },
  arch: { type: String, required: true },
  version: { type: String, required: true },
  dpi: { type: String, required: true },
});

/**
 * @name apkSchema
 * @description Mongoose schema for the Apk document.
 * @property {string} org - The organization of the APK.
 * @property {string} repo - The repository of the APK.
 * @property {string} version - The version of the APK.
 * @property {number} releaseDate - The release date of the APK.
 * @property {string} type - The type of the APK.
 * @property {Variant[]} variants - The variants of the APK.
 */
const apkSchema = new Schema<IApk>({
  org: { type: String, required: true },
  repo: { type: String, required: true },
  version: { type: String, required: true },
  releaseDate: { type: Number, required: true },
  type: { type: String, required: true },
  variants: [variantSchema],
});

/**
 * @name Apk
 * @description Mongoose model for the Apk document.
 */
const Apk = mongoose.model<IApk>('Apk', apkSchema);

export default Apk;
export { IApk, Variant };
