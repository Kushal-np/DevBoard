import PostContainer from "../components/features/PostContainer";
import PostContent from "../components/features/PostContent";

const Feed = () =>{
    return(
        <div className="w-full md:max-w-2xl md:mx-auto">
        
            <PostContent/>
            <PostContainer/>
        </div>
    )
}


export default Feed;