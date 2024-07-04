import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Api from "../../helpers/Api";
const DocusignCallBack = () => {
  const { docusignProfileId } = useSelector((state) => state.doc);
  const dispatch = useDispatch();
  const history = useHistory();

  const parseUrlForSign = () => {
    const codeFromUrl = window.location.href.split("?code=")[1];
    localStorage.setItem("codeFromUrl", codeFromUrl);
    const payload = { codeFromUrl: codeFromUrl };
    Api.post("doc/sign/authdata", payload)
      .then((res) => {
        dispatch({
          type: "SignToken",
          payload: {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
          },
        });
        window.location = `/docs/${docusignProfileId}`;
        // window.reload();
      })
      .catch((err) => console.log(err));
    dispatch({
      type: "DocSignAuth",
      payload: codeFromUrl,
    });
  };

  useEffect(() => {
    parseUrlForSign();
  }, []);
  return <h1>You are being redirected back to contractFlo Page.</h1>;
};
export default DocusignCallBack;
