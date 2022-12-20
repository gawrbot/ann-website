import Head from 'next/head';
import Link from 'next/link';

const { BLOG_URL, CONTENT_API_KEY } = process.env;

export type Post = {
  title: string;
  slug: string;
  html: string;
};

type Props = {
  posts: Post[];
};

async function getPosts() {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,html`,
  ).then((resp) => resp.json());

  const posts = res.posts;

  return posts;
}

export const getStaticProps = async () => {
  const posts = await getPosts();
  return {
    revalidate: 10,
    props: { posts },
  };
};

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>Ann Website</title>
        <meta name="description" content="Ann's Website in 3 languages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        {props.posts.map((post) => {
          return (
            <div key={post.slug}>
              <Link href="/text/[slug]" as={`/text/${post.slug}`}>
                <h2 className="font-bold">{post.title}</h2>
              </Link>
              <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
          );
        })}
      </div>
    </>
  );
}
