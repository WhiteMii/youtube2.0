export default class VideoDto {
  id;
  userId;
  title;
  desc;
  imgUrl;
  videoUrl;
  //   preview;
  views;
  tags;
  likes;
  dislikes;
  comments;
  createdAt;
  updatedAt;
  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.title = model.title;
    this.desc = model.desc;
    this.imgUrl = model.imgUrl;
    this.videoUrl = model.videoUrl;
    // this.preview = model.preview;
    this.views = model.views;
    this.tags = model.tags;
    this.likes = model.likes;
    this.dislikes = model.dislikes;
    this.comments = model.comments;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
