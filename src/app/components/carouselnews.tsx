import Link from "next/link";
import Image from "next/image";
import styles from "@/app/page.module.scss";
import { Posts } from "@/app/interfaces/posts";

export default function CarouselNews({ news, pathname }: { news: Posts[], pathname: string }) {
    const items = [];
    const itemsinds = [];
    const nmitems = news.length;
    let isactive = "";

    for (let i = 0; i < nmitems; i++) {
        isactive = i == 0 ? 'active' : '';

        itemsinds.push(
            <button type="button" data-bs-target="#carouselNews" data-bs-slide-to={i} className={isactive} aria-current="true" aria-label={"Slide " + (i + 1)} key={i}></button>
        );

        items.push(
            <div className={"carousel-item " + isactive + " " + styles.drk} key={i}>
                <Link href={"/pages/news/" + news[i].categoryId + "/" + news[i].postId}>
                    <Image
                        src={"/images/" + (news[i].image ?? 'blog.jpg')}
                        className={styles.carimg + " rounded"}
                        width={800}
                        height={400}
                        priority={true}
                        alt={news[i].title ?? "blog image"} 
                    />
                    <div className="carousel-caption carcentered">
                        <h5>{news[i].title ?? 'N/A'}</h5>
                    </div>
                </Link>
            </div>
        );
    }

    return (
        (pathname == "/" || pathname == "/pages/news") && (
            <div className={"container"}>
                <div id="carouselNews" className="carousel slide carousel-fade shadow rounded mt-3 mb-3" data-bs-ride="false">
                    <div className="carousel-indicators">
                        {itemsinds}
                    </div>
                    <div className="carousel-inner">
                        {items}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselNews" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselNews" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        )
    );

}