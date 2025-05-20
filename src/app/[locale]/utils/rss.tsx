import fs from 'fs';
import RSS from 'rss';
import FetchDataAxios from '@applocale/utils/fetchdataaxios';
import { Posts } from '@applocale/interfaces/posts';

export interface RSSPostsItems {
    title: string;
    description: string;
    url: string;
    categories: string[];
    author: string;
    date: string | Date;
}

export const getPosts = async () => {
    const posts = await FetchDataAxios({
        url: 'api/posts',
        method: 'get',
    });

    const data = posts.data.data ?? posts.data;

    return data.map((x: Posts) => ({ 
        title: x.title, 
        description: x.content, 
        url: `https://localhost:5000/paginas/noticias/${x.categoryId}/${x.postId}`, 
        categories: [""], 
        author: "Luis Carvalho", 
        date: new Date().toUTCString() 
    }));
}

export const getSiteUrl = () => {
    return process.env.NODE_ENV === "production" ? "https://localhost:3000" : "https://localhost:3000";
}

export const generateRssFeed = async (type: string = "xml") => {
    const saveToFile = true;
    const site_url = getSiteUrl();
    const posts = await getPosts();

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

    posts.forEach((post: RSSPostsItems) => {
        feed.item({
            title: post.title,
            description: post.description,
            url: post.url,
            categories: post.categories,
            author: post.author,
            date: post.date
        });
    });

    const content = type == "xml" ? feed.xml({ indent: true }) : JSON.stringify(feed, null, 4);
    
    if(saveToFile) {
        fs.writeFileSync('./public/feed.'+type, content);
    }

    return content;
};

const Rss = () => { };

export default Rss;