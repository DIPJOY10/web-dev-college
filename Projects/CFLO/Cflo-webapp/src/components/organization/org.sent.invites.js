import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../helpers/Api";
import Invites from "../team/ManageMembers/invites.js";

function SentInvites() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;

  const [invites, setInvites] = useState([]);

  useEffect(() => {
    async function getInvites() {
      const invitesRes = await Api.post("invite/sentInvites", {
        invitedById: [profile],
        teamType: "Organization",
      });
      console.log({ invitesRes });
      setInvites(invitesRes.data);
    }
    getInvites();
  }, []);

  console.log({ invites });

  return (
    <div>
      <Invites invites={invites} />
    </div>
  );
}

export default SentInvites;
