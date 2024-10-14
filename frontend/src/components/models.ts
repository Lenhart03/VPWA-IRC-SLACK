export enum UserStatus {
  Online,
  Offline,
  DND
}

export enum ChannelType {
  Private,
  Public
}

export enum UserRole {
  Owner,
  Default
}

export enum MessageStatus {
  Read,
  Unread
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  status: UserStatus;
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
}

export interface Notification {
  id: number;
  message_id: number;
  user_id: number;
}

export interface Message {
  id: number;
  message_id: number;
  user_id: number;
  message: string;
  status: MessageStatus;
}
