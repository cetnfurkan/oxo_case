export interface Apk {
    _id: string;
    org: string;
    repo: string;
    version: string;
    releaseDate: number;
    type: string;
    variants: Variant[];
}

export interface Variant {
    variant: string;
    type: string;
    arch: string;
    version: string;
    dpi: string;
}