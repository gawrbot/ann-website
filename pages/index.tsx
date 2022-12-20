import Head from 'next/head';
import Link from 'next/link';

const { BLOG_URL, CONTENT_API_KEY } = process.env;

export type Post = {
  title: string;
  slug: string;
  html: string;
};

type Props =
  | {
      posts: Post[];
    }
  | { error: string };

async function getPosts() {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,html`,
  ).then((resp) => resp.json());

  const posts = res.posts;

  return posts;
}

// async function getTags() {
//   const res = await fetch(
//     `${BLOG_URL}/ghost/api/v3/content/tags/?key=${CONTENT_API_KEY}`,
//   ).then((resp) => resp.json());

//   const tags = res.tags;

//   return tags;
// }

export const getStaticProps = async () => {
  const posts = await getPosts();
  if (typeof posts === 'undefined') {
    return {
      props: {
        error: 'Nothing to see here',
      },
    };
  }
  return {
    revalidate: 300,
    props: { posts },
  };
};

export default function Home(props: Props) {
  if ('error' in props) {
    return (
      <>
        <p>
          <Link href="/">
            <span className="underline">Go back</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ann Website</title>
        <meta name="description" content="Ann's Website in 3 languages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid justify-items-center">
        <div className="grid grid-cols-1 gap-x-32 gap-y-16 lg:grid-cols-3 ">
          {props.posts.reverse().map((post) => {
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
      </div>
    </>
  );
}
