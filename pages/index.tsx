import Head from 'next/head';
import Link from 'next/link';

export type Post = {
  title: string;
  slug: string;
  html: string;
  tags: { name: string }[];
};

type Props =
  | {
      posts: Post[];
    }
  | { error: string };

async function getPosts() {
  const res = await fetch(
    `${process.env.BLOG_URL}/ghost/api/v3/content/posts/?key=${process.env.CONTENT_API_KEY}&fields=title,slug,html&include=tags`,
  ).then((resp) => resp.json());

  const posts = res.posts;

  return posts;
}

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
    revalidate: 10,
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

  const sortedPosts = props.posts.sort((a, b) =>
    a.tags[1].name > b.tags[1].name
      ? 1
      : a.tags[1].name === b.tags[1].name
      ? a.tags[0].name > b.tags[0].name
        ? 1
        : -1
      : -1,
  );

  return (
    <>
      <Head>
        <title>Ann Website</title>
        <meta name="description" content="Ann's Website in 3 languages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid justify-items-center">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-3">
          {sortedPosts.map((post) => {
            return (
              <div
                key={post.slug}
                className={
                  post.tags[0].name === 'de'
                    ? 'lg:col-start-1'
                    : post.tags[0].name === 'en'
                    ? 'lg:col-start-2'
                    : 'lg:col-start-3'
                }
              >
                <Link href="/text/[slug]" as={`/text/${post.slug}`}>
                  <h2 className="font-bold">{post.title}</h2>
                </Link>
                {/* <p>{post.tags[0].name}</p>
                <p>{post.tags[1].name}</p> */}
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
