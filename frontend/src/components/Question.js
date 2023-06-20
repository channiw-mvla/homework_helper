import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom';
import Answer from './Answer';
import Header from './Header'
import { FaPlus, FaUserCircle } from 'react-icons/fa';


const Question = ({search,setSearch}) => {
    const {id} = useParams();
    const [question, setQuestion] = useState([])
    const [loading, setLoading] = useState(true)
    const [currUser, setCurrUser] = useState([])
    const [showForm, setShowForm] = useState(false)
    const navigate = useNavigate();
    const handleAnswerClick = e => {
      e.preventDefault();
      axios.post("http://localhost:8000/api/reply/",{"reply_message":e.target.message.value,"post":question.id},{withCredentials:true})
      .then(res => {
        const updatedQuestion = {
          ...question,
          replies: [...question.replies, res.data.reply]
        };
        setQuestion(updatedQuestion);
      })      
      .catch(err=>console.log(err))
    }
   useEffect(() => {
      const fetchData = async () => {
        await axios.get("http://localhost:8000/api/posts/"+id)
        .then(res => setQuestion(res.data))
        .catch(err => console.log(err))
        await axios.get("http://localhost:8000/api/user",{withCredentials:true})
        .then(res => setCurrUser(res.data))
        .catch(err => console.log(err))
        setLoading(false)
      }
      fetchData();
    }, [])
    
   
    
  
    
  if(loading)
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
      <Header search = {search} setSearch={setSearch} />
      <div className="bg-gray-100 min-h-screen">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              { question.user.profile_image === null ? 
                (
                  <Link to={"/profile/"+question.user.id}>
                    <FaUserCircle className='h-12 w-12 text-gray-400 ' />
                  </Link>
                ):(
                  <Link to={"/profile/"+question.user.id}>
                    <img
                      src={`http://localhost:8000${question.user.profile_image}`}
                      alt="User Avatar"
                      className="rounded-full h-12 w-12 object-cover"
                    />
                  </Link>
                )
            }
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800">{question.post_message}</h1>
                <p className="text-gray-600 mt-1">Posted by: <Link to={"/profile/"+question.user.id}>{question.user.username}</Link></p>
              </div>
            </div>
          </div>
        </div>
    
        <div className="max-w-3xl mx-auto px-4 py-8">
          {
            question.replies.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <p className="text-gray-600">No answers available.</p>
            </div>
            ) : (
              question.replies.map((answer, index) => {
                return (
                  <Answer
                    key={index}
                    answer={answer}
                    currUser={currUser}
                  />
                );
              })
              
            )
          }
            {showForm ? (
               <div className="bg-white rounded-lg shadow mb-4">
               <div className="p-4 border-b">
                   <div className="flex items-center mb-2">
                       { currUser.profile_image === null ? 
                           (
                             <div className="rounded-full h-8 w-8 bg-gray-300"></div>
                           ):(
                             <img
                               src={`http://localhost:8000${currUser.profile_image}`}
                               alt="User Avatar"
                               className="rounded-full h-8 w-8 object-cover"
                             />
                           )
                       }
                       <p className="ml-2">{currUser.username}</p>
                   </div>
                   <h2 className="text-lg font-bold mb-2">Answer:</h2>
                   <form onSubmit={e=>handleAnswerClick(e)}>
                      <textarea
                          name="message"
                          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200 resize-none"
                          rows={6}
                          placeholder="Type your answer here..."
                          style={{background:"#ecf2f7"}}
                      ></textarea>
                      <div className="flex justify-end">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white mt-1 font-semibold py-2 px-4 rounded">
                          Answer
                        </button>
                      </div>
                   </form>
               </div>
               <div>
               </div>
           </div>
            ):(

              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-2 px-4 rounded flex items-center justify-center" onClick={()=>currUser.length===0?navigate("/login"):setShowForm(true)}>
                  <FaPlus className="mr-2" />
                  Answer
                </button>
              </div>
            )
          }
        </div>
        
      </div>
      </>
    );
    

  };

export default Question;
