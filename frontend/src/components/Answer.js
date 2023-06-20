import axios from 'axios';
import React, { useState } from 'react'
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';

const Answer = ({answer,currUser}) => {
    let [startRating,total_ratings,num_of_rating] = answer.average_rating
    const [totalRatings, setTotalRatings] = useState(total_ratings)
    const [ratingCount, setRatingCount] = useState(num_of_rating)
    const userRating = () =>{
        if(currUser.length===0)
            return startRating;
        let reply = currUser.user_ratings.find(rate => rate.reply === answer.id);
        if(!reply)
            return 0;
        return reply.rating
    }
    const [favored, setFavored] = useState(currUser.length !== 0 ? currUser.liked_replies.includes(answer.id) : false)
    const [rating, setRating] = useState(userRating())
    const [numberAverage, setNumberAverage] = useState(startRating)
    const navigate = useNavigate ()
    const [numberLikes, setNumberLikes] = useState(answer.likes.length)
    const [showButton, setShowButton] = useState(false)
    const [comments, setComments] = useState(answer.comments)
    const handleStarClick = (newrating) =>{ 
        let updatedRatingCount =  ratingCount
        if(rating===0)
            updatedRatingCount = ratingCount+1
        setRatingCount(updatedRatingCount)
        const updatedTotalRatings = totalRatings - rating + newrating;
        const updatedAverage = parseFloat((updatedTotalRatings/updatedRatingCount).toFixed(1)).toString()
        setTotalRatings(updatedTotalRatings)
        setRating(newrating)
        setNumberAverage(updatedAverage)
        axios.patch("http://localhost:8000/api/reply/"+answer.id+"/",{"stars":newrating},{withCredentials: true})
        .then(res => {
            if(res.data.success===false)
                navigate("/login")
        } )
        .catch(err => console.log(err))
    };
    const handleFavoriteClick = () => {
        setFavored(favored => !favored)
        favored ? setNumberLikes(numberLikes-1): setNumberLikes(numberLikes+1)
        axios.patch("http://localhost:8000/api/reply/"+answer.id+"/",{"likes":""},{withCredentials: true})
        .then(res => {
            if(res.data.success===false)
                navigate("/login")
        } )
        .catch(err => console.log(err))
    } 
    const handleComment = e => {
        e.preventDefault();
        axios.post("http://localhost:8000/api/comment/",{"comment_message":e.target.message.value,"reply":answer.id},{withCredentials: true})
        .then(res=>setComments([...comments,res.data]))
        .catch(res=>console.log(res))
        e.target.message.value=""
        setShowButton(false)
    }
        return (

        <div className="bg-white rounded-lg shadow mb-4">
    <div className="p-4 border-b">
        <div className="flex items-center mb-2">
            { answer.user.profile_image === null ? 
                (   
                <Link to={"/profile/"+answer.user.id}>
                    <FaUserCircle className='h-8 w-8 text-gray-400 ' />
                </Link>
                ):(
                    <Link to={"/profile/"+answer.user.id}>
                        <img
                          src={`http://localhost:8000${answer.user.profile_image}`}
                          alt="User Avatar"
                          className="rounded-full h-8 w-8 object-cover"
                        />
                    </Link>
                )
            }
            <Link to={"/profile/"+answer.user.id}>
                <p className="ml-2">{answer.user.username}</p>
            </Link>
        </div>
        <h2 className="text-lg font-bold mb-2">Answer:</h2>
        <p>{answer.reply_message}</p>

        <div className="flex items-center mt-4">
            <div className="flex space-x-2 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div
                        key={star}
                        className="cursor-pointer"
                        onClick={() => handleStarClick(star)}
                    >
                        {rating >= star ? (
                            <FaStar className="text-yellow-500 text-lg" />
                        ) : (
                            <FaRegStar className="text-yellow-500 text-lg" />
                        )}
                    </div>
                ))}
                <p className="text-lg">
                    {numberAverage} ({ratingCount} votes)
                </p>
            </div>
            <div className="ml-auto flex items-center space-x-1">
                <p className="text-lg">{numberLikes}</p>
                <div className="cursor-pointer" onClick={handleFavoriteClick}>
                    {favored ? (
                        <FaHeart className="text-red-500 text-lg" />
                    ) : (
                        <FaRegHeart className="text-red-500 text-lg" />
                    )}
                </div>
            </div>
        </div>
    </div>
    <div>
    </div>
    <form className="p-4" onSubmit={e=>handleComment(e)}>
      {comments.map(comment => (
        <div key={comment.id} className="flex items-center space-x-2 mb-4">
            { comment.user.profile_image === null ? 
                (
                    <Link to={"/profile/"+comment.user.id}>
                        <FaUserCircle className='h-7 w-7 text-gray-400 ' />
                    </Link>
                  
                ):(
                    <Link to={"/profile/"+comment.user.id}>
                        <img
                          src={`http://localhost:8000${comment.user.profile_image}`}
                          alt="User Avatar"
                          className="rounded-full h-7 w-7 object-cover"
                        />
                    </Link>
                )
            }
            <p className="text-gray-500 text-center">{comment.comment_message}</p>
        </div>
      ))}
        <input
            id="comment"
            name='message'
            className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200"
            rows={4}
            placeholder={currUser.length!==0?"Type your comment here...":"Log in to add comment"}
            style={{background:"#ecf2f7"}}
            onClick={()=> currUser.length!==0 ? setShowButton(!showButton):navigate("/login")}
        />
        {showButton && 
            <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md dis"
            >
                Post Comment
            </button>
        }
    </form>
</div>

        )
}

export default Answer