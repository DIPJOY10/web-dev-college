import React from "react";
import useGetActivities from "./useGetActivities";

function Test() {
  const results = useGetActivities({
    parent: "624b099e2c98fd2751fe6ca6",
    parentModelName: "Organization",
  });
  return <div>test</div>;
}

export default Test;
