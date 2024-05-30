/**
 * @name Apk
 * @description Interface for the Apk document.
 * @property {string} org - The organization of the APK.
 * @property {string} repo - The repository of the APK.
 * @property {string} version - The version of the APK.
 * @property {number} releaseDate - The release date of the APK.
 * @property {string} type - The type of the APK.
 * @property {Variant[]} variants - The variants of the APK.
 */
export interface Apk {
    org: string;
    repo: string;
    version: string;
    releaseDate: number;
    type: string;
    variants: Variant[];
}

/**
 * @name Variant
 * @description Interface for the Variant subdocument.
 * @property {string} variant - The variant identifier.
 * @property {string} type - The type of the variant.
 * @property {string} arch - The architecture of the variant.
 * @property {string} version - The version of the variant.
 * @property {string} dpi - The dpi of the variant.
 */
export interface Variant {
    variant: string;
    type: string;
    arch: string;
    version: string;
    dpi: string;
}
