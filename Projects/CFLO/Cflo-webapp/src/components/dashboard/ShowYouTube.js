import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import YoutubeTuts from "../youtubeTuts/index";

export default function ShowYouTube(props) {
    return (
        <div style={{ marginRight: "20px" }} >
            <YoutubeTuts
                name={'Project'}
            />
        </div>
    );
}
