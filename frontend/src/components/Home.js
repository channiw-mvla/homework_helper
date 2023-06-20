import React from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
const Home = ({search,setSearch}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100">
            <Header search = {search} setSearch={setSearch} hide={true}/>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              <div className="flex justify-center">
                <div className="max-w-lg w-full">
                  <h2 className="text-3xl font-bold mb-4">Get Homework Help from Experts</h2>
                  <p className="text-gray-600 mb-6">Join our community of students and educators to get instant answers to your homework questions.</p>
                  <form className="flex space-x-2" onSubmit={e=>{e.preventDefault();navigate("/search/"+e.target.question.value);}}>
                        <input type="text" name='question' placeholder="Enter your question" className="flex-grow py-2 px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500">Ask</button>
                  </form>
                </div>
              </div>
            </main>
        </div>
        
  )
}

export default Home