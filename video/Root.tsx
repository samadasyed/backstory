import { Composition } from "remotion";
import { feedPosts } from "../server/data";
import { BackstoryPost } from "./BackstoryPost";
import { demoVideoPostIds } from "./posts";

export function RemotionRoot() {
  return (
    <>
      {demoVideoPostIds.map((postId) => {
        const post = feedPosts.find((candidate) => candidate.id === postId);
        if (!post) throw new Error(`Missing video post ${postId}`);
        return (
          <Composition
            key={postId}
            id={postId}
            component={BackstoryPost}
            durationInFrames={post.durationSeconds * 30}
            fps={30}
            width={720}
            height={1280}
            defaultProps={{ postId }}
          />
        );
      })}
    </>
  );
}
