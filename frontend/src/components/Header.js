import React, { useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {AiOutlineCloseCircle } from "react-icons/ai";
import axios from 'axios';
import Cookies from 'js-cookie';
const Header = ({search,setSearch,hide}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState("")
  const [login, setLogin] = useState(true)
  const {query} = useParams();
  useEffect(() => {
      if(query!==undefined)
        setSearch(query)
    }, [])
  const handleSubmit = e =>{
    e.preventDefault()
    if(login)
      axios.post("http://localhost:8000/api/login",{"email":e.target.email.value,"password":e.target.password.value},{withCredentials:true})
      .then(res=>{
        if(res.data.success )
          navigate("/profile")
      else
       setError(res.data.error)
      })
      .catch(err=>console.log(err))
    else 
      axios.post("http://localhost:8000/api/register",{"username":e.target.username.value,"email":e.target.email.value,"password":e.target.password.value},{withCredentials:true})
        .then(res=>{
          if(res.data.success )
            navigate("/login/")
          else
           setError(res.data.error)
          })
          
          
        .catch(err=>console.log(err))
  }
  return (
    <>
    <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold"> <Link to={"/"}>Brainly</Link></h1>
        { hide !== true && 
        
        <form className='w-full mx-20' onSubmit={e=>{e.preventDefault();navigate("/search/"+e.target.question.value)}}>
          <input
            type="text"
            name="question"
            placeholder="Search for an answer to any question..."
            className="px-4 py-2 w-full rounded-full focus:outline-none focus:ring-blue-200 focus:ring focus:border-blue-200 text-black"
            style={{ background: "#ecf2f7" }}
            onChange={e => {
              if(e.target.value!==undefined)
                setSearch(e.target.value)
            }}
            defaultValue={search}
          />
        </form>
        }
        <nav>
            <ul className="flex space-x-4 whitespace-nowrap">
              <li>  <Link to={"/question/add"} className="hover:text-blue-200 text-xl">Ask a Question</Link> </li>  
              {Cookies.get("jwt")?
              <>
                <li>  <Link to={"/profile"} className="hover:text-blue-200 text-xl">Profile</Link> </li>  
                <li className="hover:text-blue-200 text-xl hover:cursor-pointer" onClick={()=>axios.post("http://localhost:8000/api/logout",null,{withCredentials:true})}> Logout</li>
              </>
              :
              <>
                <li className="hover:text-blue-200 text-xl hover:cursor-pointer" onClick={()=>setShowModal(true)}> Login</li>
                <li className="hover:text-blue-200 text-xl hover:cursor-pointer" onClick={()=>{setShowModal(true);setLogin(false)}}> Sign Up</li>
              </>
            }
            </ul>
        </nav>
        </div>
    </header>
    {showModal &&
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="relative bg-white rounded-xl shadow-lg px-40 py-20 text-center">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={()=>setShowModal(false)}
        >
          <AiOutlineCloseCircle className="w-6 h-6" />
        </button>
              <p className='text-3xl font-bold mb-3'>Welcome Back </p>
              <p className='text-lg'>Get answers within minutes and finish your homework faster</p>
              <div className="flex-1 p-6 mt-5" >
              {error && <p className="text-red-500 mb-4 font-semibold text-lg">{error}</p>}
                <form onSubmit={e=>handleSubmit(e)}>
                  {login ? (
                    <>
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
                        LOGIN
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )
                  
                }
                </form>
              </div>
                {
                  login ? 
                  <p>Don't have an account? <Link className='text-blue-800 font-semibold hover:underline' onClick={()=>setLogin(false )}>Sign up</Link></p>:
                  <p>Already have an account? <Link className='text-blue-800 font-semibold hover:underline' onClick={()=>setLogin(true )}>Log in</Link></p>
                }
        </div>
      </div>
    }
  </>
  )
}

export default Header