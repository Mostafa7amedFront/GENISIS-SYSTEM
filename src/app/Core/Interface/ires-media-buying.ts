export interface IResMediaBuying {
  mediaBuyingFieldStats: MediaBuyingFieldStat[]
}

export interface MediaBuyingFieldStat {
  mediaBuyingFielStatsdId: string
  name: string
  value: number
}

export interface GetMediaBuyingFields {
  name: string
  id: number
}
