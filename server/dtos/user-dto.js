export default class UserDto {
  id;
  email;
  name;
  isActivated;
  img;
  subscribers;
  subscribedUsers;
  fromGoogle;
  videos;
  constructor(model) {
    this.email = model.email;
    this.name = model.name;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.img = model.img;
    this.subscribers = model.subscribers;
    this.subscribedUsers = model.subscribedUsers;
    this.fromGoogle = model.fromGoogle;
    this.videos = model.videos;
  }
}
