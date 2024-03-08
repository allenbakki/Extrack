import React, { useState } from "react";
import Groups from "./Groups";
import CreateGroup from "./CreateGroup";
import GroupExpenses from "../groups/GroupExpenses";

export default function GroupDisplay() {
  const [displayState, setDisplayState] = useState(0);
  const [groupId, setGroupId] = useState({
    groupId: "",
    groupName: "",
  });

  function Displayfun() {
    console.log("displayState:", displayState);

    switch (displayState) {
      case 1:
        return (
          <CreateGroup
            displayState={displayState}
            setDisplayState={setDisplayState}
          />
        );
      case 2:
        return (
          <GroupExpenses
            displayState={displayState}
            setDisplayState={setDisplayState}
            groupId={groupId}
          />
        );

      default:
        return (
          <Groups
            displayState={displayState}
            setDisplayState={setDisplayState}
            setGroupId={setGroupId}
          />
        );
    }
  }

  return <div>{Displayfun()}</div>;
}
