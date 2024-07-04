import React, { useState, useEffect } from 'react';
import BlogsAdmin from "../components/blog/blogs.admin";
import BlogEdit from "../components/blog/blog.edit";
import BlogView from "../components/blog/blog.view";
import Blogs from "../components/blog/blogs.view";
import { Switch, Route } from "react-router-dom";



const Routes = () => {
    return [
        <Route exact path="/blog/admin">
            <BlogsAdmin />
        </Route>,
        <Route exact path="/blog/edit/:blogId">
            <BlogEdit />
        </Route>,
        <Route exact path="/blogs">
            <Blogs />
        </Route>,
        <Route exact path="/blog/public/:blogId">
            <BlogView />
        </Route>,
    ];
}

export default Routes;