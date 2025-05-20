/* eslint-disable @typescript-eslint/no-explicit-any */
import RSS from 'rss';

const site_url = process.env.NODE_ENV === "production" ? "https://localhost:3000" : "https://localhost:3000";

export const getPosts = () => {
    return [
        {
            title: "Welcome to LCPBlog!",
            description: "Welcome to LCPBlog!",
            url: `${site_url}/pt-PT/paginas/noticias/1/1`,
            categories: ["Geral"],
            author: "Luis Carvalho",
            date: new Date().toUTCString(),
        }
    ];
}

export const generateRssFeed = async (type: string = "xml") => {
    const posts = getPosts();

    const feed = new RSS({
        title: "LCPBlog",
        description: "LCPBlog",
        generator: "LCP",
        site_url: site_url,
        feed_url: `${site_url}/rss.xml`,
        managingEditor: 'luiscarvalho239@gmail.com (Luis Carvalho)',
        webMaster: 'luiscarvalho239@gmail.com (Luis Carvalho)',
        copyright: `Criado por Luis Carvalho LCP ©${new Date().getFullYear()}`,
        language: 'pt-PT',
        pubDate: new Date().toUTCString(),
        ttl: 60,
    });

    posts.forEach((post: any) => {
        feed.item({
            title: post.title,
            description: post.description,
            url: post.url,
            categories: post.categories,
            author: post.author,
            date: post.date
        });
    });

    return type == "xml" ? feed.xml({ indent: true }) : JSON.stringify(feed, null, 4);
};

const Rss = () => { };

export default Rss;