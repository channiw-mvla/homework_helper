import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle,FaStar,FaRegStar ,FaHeart } from 'react-icons/fa';
import axios from 'axios'
import Header from './Header';
const UserProfile = ({search,setSearch}) => {
    const {pk} =  useParams();
    const [currentUser, setCurrentUser] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      const getUser = async () =>{
        await axios.get("http://localhost:8000/api/user/"+pk)
        .then(res=>setCurrentUser(res.data))
        .catch(err=>err)
      setLoading(false)
      }
      getUser()
    
        
    }, [])
if (loading)
  return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-md p-6">
                <div className="h-6 w-20 bg-gray-300 mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 mb-2"></div>
                <div className="h-4 w-24 bg-gray-300"></div>
              </div>
            </div>
        </div>
    );
else
  return (
    <>
    <Header search={search} setSearch={setSearch}/>
    <div className="bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {currentUser.profile_image === null ? 
              (
                <FaUserCircle className="text-4xl text-gray-500 h-12 w-12" />
              ):(
                <img
                  src={`http://localhost:8000${currentUser.profile_image}`}
                  alt="User Avatar"
                  className="rounded-full h-12 w-12 object-cover"
                />
              )
            }
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-x-1">
              {currentUser.username}
            </h1>
            <div className="flex items-center text-sm">
              <div className="mr-2">
                <span className="text-gray-800">{currentUser.average_rating}</span>
                <span className="text-gray-600"> / 5</span>
              </div>
              <div>
                <span className="text-gray-800">{currentUser.total_likes}</span>
                <span className="text-gray-600"> Likes</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {currentUser.answers.map((answer, index) => {
            return (
                <div className="bg-white rounded-lg shadow mb-4" key={index}>
                  <div className="p-4 border-b">
                    <div className="flex items-center mb-2 gap-x-2">
                      {answer.user.profile_image === null ? (
                        <Link to={"/profile/" + answer.user.id}>
                          <FaUserCircle className="h-8 w-8 text-gray-400" />
                        </Link>
                      ) : (
                        <Link to={"/profile/" + answer.user.id}>
                          <img
                            src={`http://localhost:8000${answer.user.profile_image}`}
                            alt="User Avatar"
                            className="rounded-full h-8 w-8 object-cover"
                          />
                        </Link>
                      )}
                      <Link to={"/profile/" + answer.user.id}>
                        <p className="font-semibold">{answer.user.username}</p>
                      </Link>
                      <p>answered</p>
                      <Link to={"/question/"+answer.post.id}>
                        <p className='font-semibold hover:underline'>{answer.post.post_message}</p>
                      </Link>
                    </div>
                    <h2 className="text-lg font-bold mb-2">Answer:</h2>
                    <p>{answer.reply_message}</p>

                    <div className="flex items-center mt-4">
                      <div className="flex space-x-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        answer.average_rating[0] >= star ? (
                          <FaStar className="text-yellow-500 text-lg" key={star} />
                        ) : (
                          <FaRegStar className="text-yellow-500 text-lg" key={star} />
                        )
                      ))}
                        <p className="text-lg">
                          {answer.average_rating[0]} ({answer.average_rating[2]} votes)
                        </p>
                      </div>
                      <div className="ml-auto flex items-center space-x-1">
                        <p className="text-lg">{answer.likes.length}</p>
                        <FaHeart className="text-red-500 text-lg" />
                      </div>
                    </div>
                  </div>
                </div>
                        )
                  })}
        </div>
      </div>
    </div>
    </>
  )
}

export default UserProfile