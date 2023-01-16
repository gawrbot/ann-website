import Link from 'next/link';
import { Post } from '../';

type Props =
  | {
      post: Post;
    }
  | { error: string };

export default function Text(props: Props) {
  if ('error' in props) {
    return (
      <div className="bg-white">
        <p>
          <Link href="/">
            <span className="underline">Go back</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </div>
    );
  }
  return (
    <div className="lg:mx-40">
      <p className="mb-5 lg:mb-8">
        <Link href="/" scroll={false}>
          <span className="font-bold underline">Go Home</span>
        </Link>
      </p>
      <div className="bg-white px-2 py-1">
        <h1 className="mb-2 text-lg font-bold">{props.post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: props.post.html }} />
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }: any) {
  async function getPost(slug: string) {
    const res = await fetch(
      `${process.env.BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${process.env.CONTENT_API_KEY}&fields=title,slug,html`,
    ).then((resp) => resp.json());

    const posts = res.posts;

    return posts?.[0];
  }
  const post = await getPost(params.slug);
  if (typeof post === 'undefined') {
    return {
      props: {
        error: 'Text not found',
      },
    };
  }
  return {
    props: { post },
  };
}
