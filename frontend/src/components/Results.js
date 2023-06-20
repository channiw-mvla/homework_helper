import React, {  useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios'
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
const Results = ({search,setSearch}) => {
  const [results, setResults] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
        axios.get("http://localhost:8000/api/posts/search/"+search)
        .then(res => setResults(res.data))
        .catch(err => console.log(err))
  }, [search])
  
  return (
    <>
      <Header search = {search} setSearch={setSearch}/>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {
            results.length === 0 ?
            (
              <div className="bg-white rounded-md shadow-md p-6 mb-4">
                <p className="text-gray-600">No results found.</p>
              </div>
            ):(
              results.map((result, index) => (
                    <div
                    key={index}
                    className="bg-white rounded-md shadow-md p-6 mb-4  flex flex-col"
                  >
                  <h2 className="text-lg font-semibold mb-7 hover:underline hover:cursor-pointer" onClick={() => navigate("/question/" + result.id)}>{result.post_message}</h2>
                  <div className="flex justify-between items-end mt-auto">
                    <div className="text-sm text-blue-500 hover:underline hover:cursor-pointer" onClick={() => navigate("/question/" + result.id)}>See answers ({result.replies.length})</div>
                    <div className="flex items-center space-x-2">
                      <div className='text-sm text-gray-500'>{result.replies[0] ? result.replies[0].average_rating[0]:0}</div>
                      <div className='flex space-x-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star}>
                            {result.replies[0]&&result.replies[0].average_rating[0] >= star ? (
                              <FaStar className="text-yellow-500 text-lg" />
                              ) : (
                                <FaRegStar className="text-yellow-500 text-lg" />
                              )
                            }
                          </div>
                        ))}
                      </div>
                      <div className='text-sm text-gray-500'>{result.replies[0] ? result.replies[0].average_rating[2]:0} votes</div>
                      <div className="text-red-500 text-lg">
                         <FaHeart />
                      </div>
                      <div className="text-sm text-red-500">{result.replies[0] ?result.replies[0].likes.length:0} </div>
                    </div>
                  </div>
                </div>
              ))
            ) 
          }



<div className="bg-white rounded-md p-6 mx-60 mt-5" style={{ border: "2px solid #ecf2f7" }}>
        <h2 className="text-xl font-medium mb-4">If you still can't find what you're looking for, ask a new question</h2>
            <div className="mb-4">
              <textarea
                name="question"
                className="w-full px-4 py-2 rounded-lg focus:outline-none resize-none"
                rows={4}
                placeholder="Type your question here..."
                style={{background:"#ecf2f7"}}
                defaultValue={search}
                readOnly
                onClick={()=>navigate("/question/add/"+search)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline"
              onClick={()=>navigate("/question/add/"+search)}
            >
              ASK YOUR QUESTION
            </button>
      </div>



        </div>
      </div>
    </>
  )
}

export default Results