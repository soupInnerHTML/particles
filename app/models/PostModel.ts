export interface IPostModelWithoutId {
  text?: string;
  images?: string[];
  videos?: string[];
  likes: string[];
  author: string;
  date: number;
}

export type IPostModel = IWithId<IPostModelWithoutId>;

class PostModel implements IPostModel {
  public text!: string;
  public images = [];
  public videos = [];
  public likes!: string[];
  public author!: string;
  public id!: string;
  public date!: number;

  constructor(params: IPostModel) {
    let key: keyof IPostModel;
    for (key in params) {
      // @ts-ignore
      this[key] = params[key];
    }
  }
}

export default PostModel;
