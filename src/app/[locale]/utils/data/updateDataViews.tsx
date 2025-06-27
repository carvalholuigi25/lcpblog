import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import { PostsViews } from "@applocale/interfaces/posts";

export const updateDataViews = async (data: PostsViews) => {
    return await FetchDataAxios({
        url: `api/posts/views/${data.postId}`,
        method: 'put',
        reqAuthorize:  process.env.NODE_ENV === "production" ? true : false,
        data: data
    });
}