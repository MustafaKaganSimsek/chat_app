"use client";
import styles from "./page.module.css";
import { io } from "socket.io-client";
import { useState,useEffect } from "react";
import ChatPage from "@/components/page";


const users = [{name:"user1"},
{name:"user2"},
{name:"user3"},
{name:"user4"},
{name:"user5"}
]


export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [userName, setUserName] = useState("");
  const [toName, setToName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setRoomId] = useState("");

  var socket: any;
  socket = io("http://localhost:3001");
  
  useEffect(() => {
    chooseUser()
    console.log(toName);
    
}, [toName]);
useEffect(() => {
  handleJoin();
}, [roomId]);
  const chooseUser = ()=>{
    console.log(toName);
    let arr = [toName,userName];
    let sorted = arr.sort();
    setRoomId(sorted[0]+sorted[1]);
    console.log(roomId);
    
  }

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", roomId);
      setShowSpinner(true);
// You can remove this setTimeout and add your own logic
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      console.log("Please fill in Username and Room Id");
    }
  };

  return (<>
    <div className={`${showConsole?'hidden':'flex'} justify-center items-center flex-col gap-5 h-[100vh]`}>
      <h1 className="text-5xl uppercase"> chat demo</h1>
      <p>select user</p>
      {users.map(user =>{
          return (<button className="p-3 border rounded-lg w-[200px]" key={user.name} onClick={() => (setUserName(user.name),setShowConsole(true))}>{user.name}</button>)
      })}
    </div>
    <div className={`grid-cols-12 ${showConsole?'grid':'hidden'} overflow-hidden`}>
      <div
        className={`${styles.main_div} lg:col-span-2 border-r px-5 py-12 col-span-3 relative`}
        
      >
        <div className="fixed bg-[#1597ce] text-white uppercase top-0 left-0 w-full h-12 flex justify-start items-center px-5">{userName}</div>
        {users.map(user =>{
          if(user.name != userName){
          return (<button className="flex items-center w-full " key={user.name}  onClick={() => setToName(user.name)}> <span className="rounded-full text-white text-xl uppercase bg-[#02acf6] w-10 h-10 flex justify-center items-center">U</span> <span className="p-3">{user.name}</span> </button>)
          }else{
            return
          }
        })}
              <button onClick={()=> setShowConsole(false)} className="absolute bg-[#1597ce] text-white uppercase bottom-0 left-0 w-full h-12 flex justify-end items-center px-5">{'<-'}çıkış</button>

      </div>

      <div className={`lg:col-span-10 col-span-9`}>
        <ChatPage socket={socket} roomId={roomId} username={userName} toName={toName} />
      </div>
    </div>
  </>
  );
}