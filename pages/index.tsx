import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export type Post = {
  title: string;
  slug: string;
  html: string;
  feature_image: string;
  feature_image_caption: string;
  tags: { name: string }[];
};

type Props =
  | {
      posts: Post[];
    }
  | { error: string };

async function getPosts() {
  const res = await fetch(
    `${process.env.blog_url}/ghost/api/v3/content/posts/?key=${process.env.content_api_key}&fields=title,slug,html,feature_image,feature_image_caption&include=tags`,
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
  } else {
    const postsSortedAsArrays: Post[][] = Object.values(
      props.posts.reduce((acc, current) => {
        acc[current.tags[1].name] = acc[current.tags[1].name] ?? [];
        acc[current.tags[1].name].push(current);
        return acc;
      }, {}),
    );

    return (
      <>
        <Head>
          <title>Ann Website</title>
          <meta name="description" content="Ann's Website in 3 languages" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="grid justify-items-stretch gap-y-16">
          {postsSortedAsArrays.map((postGroup) => {
            postGroup.sort((a, b) =>
              a.tags[0].name > b.tags[0].name ? 1 : -1,
            );
            return (
              <div
                className="grid grid-cols-1 gap-x-16 lg:grid-cols-3 "
                key={postGroup[0]?.tags[1]?.name}
              >
                {postGroup.map((post) => {
                  return (
                    <div
                      key={post.slug}
                      className={
                        post.tags[0].name === 'de'
                          ? 'lg:col-start-1 '
                          : post.tags[0].name === 'en'
                          ? 'lg:col-start-2'
                          : 'lg:col-start-3'
                      }
                      lang={
                        post.tags[0].name === 'de'
                          ? 'de'
                          : post.tags[0].name === 'en'
                          ? 'en'
                          : 'ja'
                      }
                    >
                      {post.feature_image ? (
                        <img
                          alt={`Illustration for the text ${post.title}`}
                          src={post.feature_image}
                        />
                      ) : null}
                      {post.feature_image_caption ? (
                        <p className="text-xs">{post.feature_image_caption}</p>
                      ) : null}
                      <Link href="/text/[slug]" as={`/text/${post.slug}`}>
                        <h2 className="mt-4 font-bold ">{post.title}</h2>
                      </Link>
                      <div dangerouslySetInnerHTML={{ __html: post.html }} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
