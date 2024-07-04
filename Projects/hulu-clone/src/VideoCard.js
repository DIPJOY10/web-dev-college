import React,{ forwardRef} from "react";
import "./VideoCard.css";
import TextTruncate from 'react-text-truncate';
import {ThumbUpSharp} from "@material-ui/icons";

const base_url="https://image.tmdb.org/t/p/original/";
//use of forward ref and text truncate
//react props
const VideoCard=forwardRef(({movie},ref)=>{
  return(
    <div ref={ref} className="videoCard">
    {/*string interpolation in js*/}
      <img src={`${base_url}${movie.backdrop_path || movie.poster_path}`} alt="Movie poster" />
      <TextTruncate
        line={1}
        element="p"
        truncateText="..."
        text={movie.overview}
      />
      <h2>{movie.title || movie.original_name}</h2>
      <p className="videoCard__stats">
        {/* {movie.media_type && `${movie.media_type}`} */}
        {movie.release_date || movie.first_air_date}  <ThumbUpSharp />  {movie.vote_count}
      </p>
    </div>
  );
})

export default VideoCard;
