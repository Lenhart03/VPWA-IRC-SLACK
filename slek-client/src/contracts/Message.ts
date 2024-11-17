import { User } from './Auth'

export type RawMessage = string

export interface SerializedMessage {
  created_by: number
  content: string
  channel_id: number,
  created_at: string,
  updated_at: string,
  id: number,
  author: User,
}
