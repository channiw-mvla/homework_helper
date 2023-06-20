import React from 'react'
import Header from './Header'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddQuestion = ({search, setSearch}) => {
  const {query} = useParams()
  const navigate = useNavigate()
  const handleSubmit = e => {
      e.preventDefault();
    axios.post("http://localhost:8000/api/posts/",{"post_message":e.target.question.value},{withCredentials:true})
    .then(res => res.data.success !== true ? navigate("/login"): navigate( "/question/"+res.data.post_id))
    .catch(err=>console.log(err))
  }
  return (
    <>
    
<Header search = {search} setSearch={setSearch}/>

    <div className="flex px-40">
      <div className="flex-1 bg-white rounded-md p-6 mt-5" style={{ border: "2px solid #ecf2f7" }}>
        <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
        <form onSubmit={e=>handleSubmit(e)}>
            <div className="mb-4">
              <textarea
                name="question"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200 resize-none"
                rows={6}
                placeholder="Write your question here (Keep it simple and clear to get the best answer)"
                style={{background:"#ecf2f7"}}
                defaultValue={query}
              ></textarea>
            </div>
            <div className="mb-4">
              <select
                name="category"
                className="w-64 px-4 py-2 rounded-full focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200"
                style={{background:"#ecf2f7"}}
              >
                  <option> Pick a subject </option>
                  <option data-icon="mathematics">Mathematics</option>
                  <option data-icon="history">History</option>
                  <option data-icon="literature">English</option>
                  <option data-icon="biology">Biology</option>
                  <option data-icon="chemistry">Chemistry</option>
                  <option data-icon="physics">Physics</option>
                  <option data-icon="sociology">Social Studies</option>
                  <option data-icon="pedagogics">Advanced Placement (AP)</option>
                  <option data-icon="egzam">SAT</option>
                  <option data-icon="geography">Geography</option>
                  <option data-icon="health">Health</option>
                  <option data-icon="artmusic">Arts</option>
                  <option data-icon="business">Business</option>
                  <option data-icon="informatics">Computers and Technology</option>
                  <option data-icon="french">French</option>
                  <option data-icon="german">German</option>
                  <option data-icon="spanish">Spanish</option>
                  <option data-icon="otherlanguages">World Languages</option>
                  <option data-icon="first-aid">Medicine</option>
                  <option data-icon="law">Law</option>
                  <option data-icon="technology">Engineering</option>
              </select>

            </div>
            <button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline"
            >
              ASK YOUR QUESTION
            </button>
          </form>
      </div>
      <div className="text-green-500 font-bold text-4xl p-6">
        <div className="flex flex-col">
          <span className="w-full">MILLIONS OF</span>
          <span className="w-full">QUESTIONS</span>
          <span className="w-full">ALREADY</span>
          <span className="w-full">ANSWERED.</span>
        </div>
      </div>
  </div>



    </>




  )
}

export default AddQuestion