import Head from 'next/head';
import Link from 'next/link';
import { server } from './';

export type PostForLink = {
  title: string;
  slug: string;
  tags: { name: string }[];
};

type Props =
  | {
      posts: PostForLink[];
    }
  | { error: string };

async function getPosts() {
  const res = await fetch(
    `${process.env.blog_url}/ghost/api/v3/content/posts/?key=${process.env.content_api_key}&fields=title,slug&include=tags`,
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

export default function Browse(props: Props) {
  if ('error' in props) {
    return (
      <>
        <p>
          <Link href="/">
            <span className="underline">Go to home</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  } else {
    const postsSortedAsArrays: PostForLink[][] = Object.values(
      props.posts.reduce((acc, current) => {
        acc[current.tags[1].name] = acc[current.tags[1].name] ?? [];
        acc[current.tags[1].name].push(current);
        return acc;
      }, {}),
    );

    return (
      <>
        <Head>
          <title>Browse</title>
          <meta name="description" content="Browse Ann's texts" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center">
          {postsSortedAsArrays.map((postGroup) => {
            postGroup.sort((a, b) =>
              a.tags[0].name > b.tags[0].name ? 1 : -1,
            );
            return (
              <ul className="list-disc" key={postGroup[0]?.tags[1]?.name}>
                {postGroup.map((post) => {
                  return (
                    <li
                      key={post.slug}
                      lang={
                        post.tags[0].name === 'de'
                          ? 'de'
                          : post.tags[0].name === 'en'
                          ? 'en'
                          : 'ja'
                      }
                    >
                      <Link href={`${server}/text/${post.slug}`}>
                        <h2 className="mt-4 font-bold text-black hover:text-blue-600">
                          {post.title}
                        </h2>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      </>
    );
  }
}
