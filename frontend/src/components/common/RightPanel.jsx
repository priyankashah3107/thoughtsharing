import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
// import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner"
const RightPanel = () => {
	// const isLoading = false;
  const {data, isLoading, isError, error} = useQuery({
     queryKey: ["suggestUsers"],
		 queryFn: async () => { 
				const res = await fetch("/api/users/suggest");
				const data = await res.json()
				console.log(data)
				if(!res.ok) {
					throw  new Error(data.error || "Something went wrong!")
				}
				return data;
		 }
	})

	const suggestUsers = data?.suggestUsers || [];

	if(isError) {
	 return <div>Error: {error.message}</div>
	}

const {follow, isPending} =	useFollow()

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullname}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size="sm"/> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;

