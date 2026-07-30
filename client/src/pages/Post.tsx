import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { POST_ENDPOINTS } from "../api/endpoints";

const Post = () => {
    const { postId } = useParams<{ postId: string }>();

    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const res = await apiClient.get(
                    POST_ENDPOINTS.GET_INDIVIDUAL_POST(postId)
                );

                setPost(res.data.post);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();

    }, [postId]);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-text-secondary">
                    Loading...
                </p>
            </div>
        );
    }


    if (!post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-text-secondary">
                    Post not found
                </p>
            </div>
        );
    }



    return (
        <div className="
            min-h-screen
            bg-background
            py-8
            px-4
        ">

            <div className="
                max-w-xl
                mx-auto
            ">


                {/* POST CARD */}

                <article className="
                    bg-surface
                    border
                    border-border
                    rounded-2xl
                    overflow-hidden
                    shadow-sm
                ">


                    {/* USER HEADER */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        px-5
                        py-4
                    ">


                        <div className="
                            flex
                            items-center
                            gap-3
                        ">


                            <div className="
                                w-11
                                h-11
                                rounded-full
                                bg-primary
                                flex
                                items-center
                                justify-center
                                text-white
                                font-bold
                            ">
                                K
                            </div>


                            <div>

                                <h3 className="
                                    text-text
                                    font-semibold
                                ">
                                    Kushal Poudel
                                </h3>


                                <p className="
                                    text-sm
                                    text-text-secondary
                                ">
                                    @kushalpoudel
                                </p>

                            </div>


                        </div>



                        <span className="
                            text-xs
                            text-text-secondary
                        ">
                            {new Date(post.createdAt)
                                .toLocaleDateString()}
                        </span>


                    </div>





                    {/* CONTENT */}

                    <div className="
                        px-5
                        space-y-4
                    ">


                        <h1 className="
                            text-xl
                            font-display
                            font-semibold
                            text-text
                        ">
                            {post.title}
                        </h1>



                        <p className="
                            text-text-secondary
                            leading-relaxed
                        ">
                            {post.description}
                        </p>



                    </div>





                    {/* IMAGE */}

                    {
                        post.thumbnailUrl && (

                            <div className="
                                mt-5
                                w-full
                            ">

                                <img
                                    src={post.thumbnailUrl}
                                    alt={post.title}
                                    className="
                                        w-full
                                        max-h-[450px]
                                        object-cover
                                    "
                                />

                            </div>

                        )
                    }





                    {/* TECH STACK */}

                    <div className="
                        px-5
                        pt-5
                        flex
                        flex-wrap
                        gap-2
                    ">

                        {
                            post.techStack.map((tech:string)=>(
                                <span
                                    key={tech}
                                    className="
                                        text-xs
                                        px-3
                                        py-1.5
                                        rounded-full
                                        bg-primary/10
                                        text-primary
                                        border
                                        border-primary/20
                                    "
                                >
                                    {tech}
                                </span>
                            ))
                        }


                    </div>





                    {/* TAGS */}

                    <div className="
                        px-5
                        py-4
                        flex
                        flex-wrap
                        gap-2
                    ">


                        {
                            post.tags.map((tag:any)=>(
                                <span
                                    key={tag.name}
                                    className="
                                        text-xs
                                        text-text-secondary
                                    "
                                >
                                    #{tag.name}
                                </span>
                            ))
                        }


                    </div>






                    {/* STATS */}

                    <div className="
                        px-5
                        py-3
                        border-t
                        border-border
                        flex
                        justify-between
                        text-sm
                        text-text-secondary
                    ">

                        <span>
                            ⭐ {post.starCount} stars
                        </span>


                        <span>
                            👁 {post.viewCount} views
                        </span>

                    </div>






                    {/* ACTIONS */}

                    <div className="
                        border-t
                        border-border
                        px-5
                        py-3
                        flex
                        justify-around
                    ">


                        <button className="
                            text-text-secondary
                            hover:text-primary
                            transition
                        ">
                            💬 Comment
                        </button>



                        <button className="
                            text-text-secondary
                            hover:text-warning
                            transition
                        ">
                            ⭐ Star
                        </button>



                        <button className="
                            text-text-secondary
                            hover:text-primary
                            transition
                        ">
                            🔗 Share
                        </button>


                    </div>



                </article>


            </div>

        </div>
    );
};


export default Post;