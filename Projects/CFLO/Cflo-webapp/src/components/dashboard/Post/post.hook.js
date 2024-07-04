import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import Api from '../../../helpers/Api';
import {setPosts} from './post.utils';

export const usePost = function(postId) {
  const location = useLocation();
  const pathname = location['pathname'];
  // console.log(pathname,' is the pathname')

  const isFeed = pathname.slice(1, 5)=='feed'||pathname=='/';
  const dispatch = useDispatch();
  const explore = useSelector((state) => state.explore);
  const dashboard = useSelector((state)=>state.dashboard);
  const {postDictionary: exploreMap} = explore;
  const {postDictionary: dashboardMap, postCatDictionary} = dashboard;
  const postDictionary = isFeed?exploreMap:dashboardMap;
  const post = postDictionary[postId];
  return {post, isFeed};
};
