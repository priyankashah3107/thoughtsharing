import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import {useQuery} from "@tanstack/react-query"

const Posts = ({feedType}) => {
	
  console.log(feedType)

	const getPostEndpoint = () => {
       switch(feedType) {
				case "forYou":  // yaha se data fetch ho rha h 
				  return "/api/posts/all";    
				case "following":
				  return "/api/posts/following";
				default: 
				  return "/api/posts/all"	
			 }
	} // ab error aayega thik h

	

const POST_ENDPOINT = getPostEndpoint();

const {data:posts, isLoading, error, isError} = useQuery({  // mei yaha se dummy POST ko Replace krna chahti hu thik h 
   queryKey: ["posts"],
	 queryFn: async () => {
		try {
			const res = await fetch(POST_ENDPOINT);
			const data  = await res.json();

			if(!res.ok) {
				throw new Error(data.error || "Something went wrong")
			}
			return data;
		} catch (error) {
		   throw new Error(error)	
		}
	 }
   
	 
})

if(isError) {
	console.error(error.message)
}


console.log(posts)

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;



