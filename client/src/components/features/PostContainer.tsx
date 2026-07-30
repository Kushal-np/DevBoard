// src/components/features/PostContainer.tsx

import { useEffect, useState, useRef } from "react";
import { useFeed } from "../../hooks/useFeed";
import {
    ExternalLink,
    Layers,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Clock,
    MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmark } from "../../hooks/useBookmark";
import CommentModal from "../Comment/Comment";

export interface IPost {
    _id: string;
    userId: string;
    title: string;
    description: string;
    liveUrl?: string;
    repoUrl?: string;
    techStack: string[];
    tags: Array<{ name: string; category: string }> | string[];
    thumbnailUrl?: string;
    stars: string[];
    starCount: number;
    viewCount: number;
    status: "draft" | "published" | "archived";
    featured: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    author?: {
        username: string;
        profile_url?: string;
    };
}

const PostContainer = () => {
    const { posts, getPosts, isLoading, Likepost } = useFeed();
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [visiblePosts, setVisiblePosts] = useState<number>(5);
    const [isCommentOpen , setIsCommentOpen] = useState<boolean>(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastPostRef = useRef<HTMLDivElement | null>(null);
    const {toggle} = useBookmark();
    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && visiblePosts < (posts?.length || 0)) {
                setVisiblePosts((prev) => Math.min(prev + 3, posts?.length || 0));
            }
        });

        if (lastPostRef.current) {
            observerRef.current.observe(lastPostRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [posts, visiblePosts]);

    const getPostId = (post: any): string => {
        if (!post) return `post-${Math.random()}`;
        return post._id || post.id || `post-${Math.random()}`;
    };
    if (isCommentOpen == true){
        return(
            <div className="h-[100vh]">
                <CommentModal/>
            </div>
        )
    }
    const getThumbnailUrl = (post: any): string | null => {
        if (!post) return null;
        const thumbnail = post.thumbnail || post.thumbnailUrl || post.thumbnail_url;
        if (!thumbnail) return null;
        if (typeof thumbnail === "string") return thumbnail;
        if (thumbnail instanceof File) {
            try {
                return URL.createObjectURL(thumbnail);
            } catch {
                return null;
            }
        }
        return null;
    };

    const handleImageError = (postId: string) => {
        setImageErrors((prev) => ({ ...prev, [postId]: true }));
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diff < 60) return `${diff}s`;
            if (diff < 3600) return `${Math.floor(diff / 60)}m`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
            if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

            return new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }).format(date);
        } catch {
            return "";
        }
    };

    const getStatusStyles = (status?: string) => {
        switch (status) {
            case "draft":
                return "bg-warning/10 text-warning border-warning/20";
            case "archived":
                return "bg-danger/10 text-danger border-danger/20";
            default:
                return "";
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const safePosts = Array.isArray(posts)
        ? posts.filter((post) => post?.title && post.title.trim() !== "")
        : [];

    const displayedPosts = safePosts.slice(0, visiblePosts);

    if (isLoading) {
        return (
            <div className="flex flex-col divide-y divide-border/60">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3 px-4 py-5 md:px-1">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-surface-hover" />
                        <div className="flex-1 space-y-2.5">
                            <div className="h-3 w-32 animate-pulse rounded bg-surface-hover" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-hover" />
                            <div className="h-3 w-full animate-pulse rounded bg-surface-hover" />
                            <div className="h-32 w-full animate-pulse rounded-xl bg-surface-hover" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (safePosts.length === 0) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
                    <Layers size={26} className="text-text-secondary/50" strokeWidth={1.5} />
                </div>
                <div>
                    <p className="font-display text-lg font-semibold text-text">
                        Nothing here yet
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                        Projects shared by the community will show up in this feed.
                    </p>
                </div>
            </div>
        );
    }
return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

        {displayedPosts.map((post:any,index:number)=>{

            const postId = getPostId(post);
            const thumbnailUrl = getThumbnailUrl(post);
            const hasImageError = imageErrors[postId];
            const showThumbnail = thumbnailUrl && !hasImageError;

            return (

            <article
                key={postId}
                ref={index === displayedPosts.length - 1 ? lastPostRef : null}
                className="
                    bg-surface
                    border border-border
                    rounded-2xl
                    overflow-hidden
                    transition
                    hover:border-primary/30
                "
            >


                {/* USER HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    px-5
                    pt-5
                ">


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <Link to={`/profile/${post.userId?._id}`}>

                            {
                                post.userId?.profile_url ?

                                <img
                                    src={post.userId.profile_url}
                                    className="
                                        h-11
                                        w-11
                                        rounded-full
                                        object-cover
                                        border border-border
                                    "
                                />

                                :

                                <div className="
                                    h-11
                                    w-11
                                    rounded-full
                                    bg-primary/15
                                    text-primary
                                    flex
                                    items-center
                                    justify-center
                                    font-semibold
                                ">
                                    {getInitials(post.userId?.name)}
                                </div>

                            }

                        </Link>



                        <div>

                            <p className="
                                text-sm
                                font-semibold
                                text-text
                            ">
                                {post.userId?.name || "Anonymous"}
                            </p>


                            <p className="
                                text-xs
                                text-text-secondary
                            ">
                                @{post.userId?.username}
                                {" · "}
                                {formatDate(post.createdAt)}
                            </p>

                        </div>


                    </div>



                    <MoreHorizontal
                        size={18}
                        className="
                            text-text-secondary
                        "
                    />

                </div>





                {/* POST CONTENT */}


                <div className="
                    px-5
                    pt-4
                ">


                    <Link to={`/post/${post._id}`}>

                        <h2 className="
                            text-lg
                            font-display
                            font-semibold
                            text-text
                            hover:text-primary
                            transition
                        ">
                            {post.title}
                        </h2>

                    </Link>



                    <p className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-text-secondary
                    ">
                        {post.description}
                    </p>



                </div>





                {/* IMAGE */}


                {
                    showThumbnail &&

                    <div className="
                        mt-4
                        px-5
                    ">

                        <img
                            src={thumbnailUrl}
                            onError={()=>handleImageError(postId)}
                            className="
                                w-full
                                max-h-[420px]
                                rounded-xl
                                object-cover
                                border border-border
                            "
                        />

                    </div>

                }





                {/* STACK */}


                <div className="
                    px-5
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                ">

                    {
                        post.techStack?.slice(0,6)
                        .map((tech:string)=>(
                            <span
                                key={tech}
                                className="
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-background
                                    border border-border
                                    text-xs
                                    text-text-secondary
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
                    mt-3
                    flex
                    gap-3
                    flex-wrap
                ">

                    {
                        post.tags?.map((tag:any)=>(
                            <span
                                key={tag.name}
                                className="
                                    text-xs
                                    text-primary
                                "
                            >
                                #{tag.name}
                            </span>
                        ))
                    }

                </div>







                {/* ACTION BAR */}


                <div className="
                    mt-5
                    px-5
                    py-3
                    border-t border-border
                    flex
                    items-center
                    justify-between
                ">



                    <div className="
                        flex
                        items-center
                        gap-1
                    ">



                        <button
                            onClick={()=>Likepost(post._id)}
                            className="
                                flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-full
                                text-sm
                                text-text-secondary
                                hover:bg-danger/10
                                hover:text-danger
                            "
                        >

                            <Heart size={17}/>

                            {post.starCount}

                        </button>




                        <button
                            onClick={()=>setIsCommentOpen(true)}
                            className="
                                flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-full
                                text-sm
                                text-text-secondary
                                hover:bg-primary/10
                                hover:text-primary
                            "
                        >

                            <MessageCircle size={17}/>

                        </button>





                        <button
                            className="
                                p-2
                                rounded-full
                                text-text-secondary
                                hover:bg-primary/10
                                hover:text-primary
                            "
                        >

                            <Share2 size={17}/>

                        </button>



                    </div>






                    <div className="
                        flex
                        items-center
                        gap-3
                    ">


                        <span className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            text-text-secondary
                        ">

                            <Eye size={15}/>

                            {post.viewCount}

                        </span>





                        {
                            post.liveUrl &&

                            <a
                                href={post.liveUrl}
                                target="_blank"
                                className="
                                    px-3
                                    py-1.5
                                    rounded-lg
                                    bg-primary
                                    text-white
                                    text-xs
                                    hover:bg-primary-hover
                                "
                            >
                                Demo
                            </a>

                        }



                    </div>



                </div>



            </article>

            )

        })}

    </div>
);
};

export default PostContainer;