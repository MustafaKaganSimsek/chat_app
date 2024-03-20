"use client"
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ socket, username, roomId , toName}: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  var preUser = toName;

  if(preUser != toName){
    setChat([]);
  }

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };


  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);


  return (<div>
            <div className=" w-28 h-full bg-slate-600 relative block">
              
            </div>
            <div style={{ marginBottom: "1rem" }} className="fixed top-0  bg-[#02acf6] w-full px-5 uppercase h-12 flex justify-start items-center text-white">
                  <p className="bg-[]">
                    {toName}
                  </p>
                </div>
            <div className={style.chat_div}>
             
              <div className={style.chat_border}>
                
                <div className=" py-10">
                  {chat.map(({ roomId, user, msg, time }, key) => (
                    <div
                      key={key}
                      className={
                        user == username
                          ? style.chatProfileRight
                          : style.chatProfileLeft
                      }
                    >
                      <span
                        className={style.chatProfileSpan}
                        style={{ textAlign: user == username ? "right" : "left" }}
                      >
                        {user.charAt(0)}
                      </span>
                      <h3 className="bg-[#02acf6] rounded-lg p-2 text-white" style={{ textAlign: user == username ? "right" : "left" }}>
                        {msg}<span style={{ textAlign: user == username ? "right" : "left" }} className="text-xs px-2" >{time}</span>
                      </h3>
                    </div>
                  ))}
                </div>
                <div>
                  <form onSubmit={(e) => sendData(e)} >
                    <input
                      className={style.chat_input}
                      type="text"
                      value={currentMsg}
                      placeholder="Mesajınız..."
                      onChange={(e) => setCurrentMsg(e.target.value)}
                    />
                    <button className={style.chat_button}>Gönder</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
    
  );
};

export default ChatPage;