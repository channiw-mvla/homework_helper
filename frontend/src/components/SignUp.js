import React, { useState } from 'react'
import Header from './Header'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = ({search,setSearch}) => {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const handleSubmit = e =>{
        e.preventDefault()
        axios.post("http://localhost:8000/api/register",{"username":e.target.username.value,"email":e.target.email.value,"password":e.target.password.value},{withCredentials:true})
        .then(res=>{
          if(res.data.success )
            navigate("/profile/")
          else
           setError(res.data.error)
          })
        .catch(err=>console.log(err))
    }
  return (
    <>
    <Header search = {search} setSearch={setSearch}/>
    <div className="flex items-center justify-center h-screen">
  <div className="bg-white rounded-xl shadow-lg px-40 py-20 text-center">
    <p className="text-3xl font-bold mb-3">Welcome Back</p>
    <p className="text-lg">
      Get answers within minutes and finish your homework faster
    </p>
    <div className="flex-1 p-6 mt-5">
    {error && <p className="text-red-500 mb-4 font-semibold text-lg">{error}</p>}
    <form onSubmit={e=>handleSubmit(e)}>
        <div className="mb-4">
            <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200"
                style={{ background: "#ecf2f7" }}
            />
        </div>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200"
          style={{ background: "#ecf2f7" }}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200"
          style={{ background: "#ecf2f7" }}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 w-full hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline"
      >
        SIGN UP
      </button>
      </form>
    </div>
    <p>Already have an account? <Link className='text-blue-800 font-semibold hover:underline' to={"/login/"}>Log in</Link></p>
  </div>
</div>

  </>
  )
}

export default SignUp