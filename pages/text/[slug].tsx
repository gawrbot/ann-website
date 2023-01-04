import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Post } from '../';

type Props =
  | {
      post: Post;
    }
  | { error: string };

async function getPost(slug: string) {
  const res = await fetch(
    `${process.env.blog_url}/ghost/api/v3/content/posts/slug/${slug}?key=${process.env.content_api_key}&fields=title,slug,html`,
  ).then((resp) => resp.json());

  const posts = res.posts;

  return posts?.[0];
}

// Ghost CMS Request
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
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
    revalidate: 300,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default function Text(props: Props) {
  const router = useRouter();

  if ('error' in props) {
    return (
      <>
        <p>
          <Link href="/">
            <span className="underline">Go Home</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  }

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="lg:mx-40">
      <p className="lg:mb-8">
        <Link href="/">
          <span className="underline">Go Home</span>
        </Link>
      </p>
      <h1 className="mb-2 text-lg font-bold">{props.post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: props.post.html }} />
    </div>
  );
}
