// import React, { useState } from 'react';
// import GroupChat from './GroupChat.jsx';
// import GroupList from '../components/chat/GroupList.jsx';
// import GroupCreate from '../components/chat/GroupCreate.jsx';

// const ChatApp = () => {
//   const [groups, setGroups] = useState([]);
//   const [currentGroup, setCurrentGroup] = useState(null); 

 
//   const createGroup = (groupName) => {
//     const newGroup = { name: groupName, id: Date.now() };
//     setGroups((prevGroups) => [...prevGroups, newGroup]);
//   };

//   return (
//     <div>
//       <GroupList setCurrentGroup={setCurrentGroup} groups={groups} />
      
//       <div>
//         <h3>Current Group: {currentGroup ? currentGroup.name : 'No group selected'}</h3>

//         <ul>
//           {groups.map((group) => (
//             <li key={group.id}>{group.name}</li>
//           ))}
//         </ul>
//       </div>

    
//       {currentGroup && <GroupChat group={currentGroup} />} 
//     </div>
//   );
// };

// export default ChatApp;
