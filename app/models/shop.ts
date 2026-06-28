type Shop = {
    name: string | null,
    imgUrl?: string,
    acceptsBSP: boolean | null,
    acceptsANZ: boolean | null,
    createdAt: number,
    uid: string,
    lat: number,
    lng: number,
    pending: boolean,
    id?: string,
    comment?: string | null,
    type: string
}