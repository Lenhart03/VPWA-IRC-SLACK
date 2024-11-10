export enum ChannelType {
    PRIVATE = 'private',
    PUBLIC = 'public',
}

export interface ChannelData {
    name: string
    type: ChannelType
}

export interface Channel {
    id: number
    name: string
    type: ChannelType
    createdAt: string
    updatedAt: string
}
