import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import {useQuery} from "@tanstack/react-query"
import { useEffect } from "react";

// const Posts = ({feedType, username , userId}) => {
	
//   console.log(feedType)
// 	const getPostEndpoint = () => {
//        switch(feedType) {
// 				case "forYou":  
// 				return "/api/posts/all";    
// 				case "following":
// 				return "/api/posts/following";
// 				case "posts":
// 					return `/api/posts/user/${username}`;
// 				case "likes": 
// 					return `/api/posts/alllikes/${userId}`;	
// 				default: 
// 				return "/api/posts/all"	
					
// 		}
		
// 	} 
 
// 	console.log("All likes are",userId)
// 	console.log("All usernname are", username)

	

// const POST_ENDPOINT = getPostEndpoint();

// const {data:posts, isLoading, error, isError, refetch, isRefetching} = useQuery({ 
//    queryKey: ["posts"],
// 	queryFn: async () => {
// 		try {
// 			const res = await fetch(POST_ENDPOINT);
// 			const data  = await res.json();
//       console.log("Data from Posts.jsx", data)
// 			if(!res.ok) {
// 				throw new Error(data.error || "Something went wrong")
// 			}
// 			return data;
// 		} catch (error) {
//  throw new Error(error)	
// 		}
// 	}
   

// })

// if(isError) {
// 	console.error(error.message)
// }

// useEffect(() => {
// 	refetch()
// }, [feedType, refetch, username])

// console.log("This is Posts infomation from posts.jsx", posts)

// 	return (
// 		<>
// 			{(isLoading || isRefetching) && (
// 				<div className='flex flex-col justify-center'>
// 					<PostSkeleton />
// 					<PostSkeleton />
// 					<PostSkeleton />
// 				</div>
// 			)}
// 			{!isLoading && !isRefetching && postspos?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
// 			{!isLoading && !isRefetching && posts && (
// 				<div>
// 					{posts.posts?.map((post) => (
// 						<Post key={post?._id} post={post} />
// 					))}
// 				</div>
// 			)}
// 		</>
// 	);
// };
// export default Posts;



const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/alllikes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();
  console.log("POST_ENDPOINT:", POST_ENDPOINT);

  const {
    data: posts,
    isLoading,
    error,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType, username, userId],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        console.log("Fetched data:", data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  if (isError) {
    console.error(error.message);
  }

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.posts?.map((post) => (
            <Post key={post?._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
