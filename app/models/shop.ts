type Shop = {
    name: string,
    imgUrl?: string,
    acceptsBSP: boolean,
    acceptsANZ: boolean,
    createdAt: number,
    createdBy?: string | null,
    lat: number,
    lng: number,
    pending: boolean,
    id?: string,
    comment?: string | null
}