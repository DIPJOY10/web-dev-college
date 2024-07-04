//most important part to understand for using the api using axios
import React,{ useEffect,useState } from "react";
import "./Results.css";
import VideoCard from "./VideoCard";
import axios from "./axios";
import FlipMove from 'react-flip-move';

function Results({selectedOption}){
  const [movies,setMovies]=useState([]);
  //a hook
  useEffect(()=>{
    //asynchronous function with axios
    async function fetchData(){
      //this requests the data from tmdb api
      const request=await axios.get(selectedOption);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  },[selectedOption]);
  return(
    <div className="results">
    {/*react flip move library*/}
      <FlipMove>
        {movies.map((movie)=>(
          <VideoCard
            key={movie.id}
            movie={movie}/>
        ))}
      </FlipMove>
    </div>
  );
}

export default Results;
