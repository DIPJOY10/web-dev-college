import React from "react";
import SchdeulerForm from "./SchedulerForm";

function SchdeulerFormTester() {
  const [scheduler, setScheduler] = React.useState({});

  React.useEffect(() => {
    console.log("parent scheduler", scheduler);
  });
  return (
    <div>
      <h2>SchdeulerFormTester</h2>
      <SchdeulerForm
        scheduler={scheduler}
        setScheduler={setScheduler}
        createByDefault
      />
    </div>
  );
}

export default SchdeulerFormTester;
