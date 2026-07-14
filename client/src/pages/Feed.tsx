import PostContainer from "../components/features/PostContainer";
import PostContent from "../components/features/PostContent";

const Feed = () => {
  return (
    <div className="w-full md:max-w-2xl md:mx-auto">
      <div className="px-4 pt-4 md:px-0 md:pt-0">
        <PostContent />
      </div>
      <div className="mt-2 border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
        <PostContainer />
      </div>
    </div>
  );
};

export default Feed;