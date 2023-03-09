export type Post = {
  [index: string]: any;
  title: string;
  text: string;
  slug: string;
  languageTag: string;
  idTag: string;
};

export type PropsAllPosts =
  | {
      posts: Post[][];
    }
  | { error: string };

export type PropsSinglePost =
  | {
      post: Post;
    }
  | { error: string };

export type ImpressumType = {
  [index: string]: any;
  mainText: string;
};

export type PropsImpressum =
  | {
      impressum: ImpressumType[];
    }
  | { error: string };
