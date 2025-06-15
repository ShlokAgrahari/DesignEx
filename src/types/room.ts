export interface RoomType {
  _id: string;
  ownerId: string;
  title: string;
  roomInvites: string[];
  createdAt: string | Date;
}
