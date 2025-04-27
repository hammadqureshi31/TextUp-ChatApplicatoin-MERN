import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {fetchUserDetails} from "..//redux/slices/userSlice";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => { 
        dispatch(fetchUserDetails());
        setTimeout(()=>{
            navigate('/user/dashboard');
        }, 1000)


        return ()=>{
          clearTimeout();
        }
    }, [])
  
  return (
    <div>

    </div>
  )
}

export default Home