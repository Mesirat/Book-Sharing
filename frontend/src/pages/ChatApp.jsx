import React, { useState } from 'react';
import GroupChat from '../components/chat/GroupChat.jsx';
import GroupList from '../components/chat/GroupList.jsx';
import GroupCreate from '../components/chat/GroupCreate.jsx';

const ChatApp = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null); // State to track the selected group

  // Create a new group
  const createGroup = (groupName) => {
    const newGroup = { name: groupName, id: Date.now() }; // Unique ID for each group
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  return (
    <div>
      <GroupList setCurrentGroup={setCurrentGroup} groups={groups} /> {/* Pass setCurrentGroup to GroupList */}
      
      <div>
        <h3>Current Group: {currentGroup ? currentGroup.name : 'No group selected'}</h3>

        <ul>
          {groups.map((group) => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      </div>

      {/* Pass currentGroup to GroupChat as a prop */}
      {currentGroup && <GroupChat group={currentGroup} />} 
    </div>
  );
};

export default ChatApp;
