import React, { useState, useEffect, useCallback } from "react";
import { BsMessenger } from "react-icons/bs";
import styles from "./ChatOnline.module.css";

const ChatOnline = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatContent, setChatContent] = useState([
    {
      sender: "admin",
      message: "Hi, how can I help you?",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const API_Key = process.env.REACT_APP_OPENAI_API_KEY;

  const handleMessengerClick = useCallback(() => {
    setIsChatVisible(!isChatVisible);
  }, [isChatVisible]);


  const sendMessageToOpenAI = async (message) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_Key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: message,
            max_tokens: 30,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      );
      const data = await response.json();
      return data.choices[0].text.trim();
    } catch (error) {
      console.error("Error:", error);
      return "Error occurred while processing the request.";
    }
  };

  const addMessageToChat = useCallback(
    (message, sender) => {
      const newMessage = {
        sender: sender,
        message: message,
        time: new Date().toLocaleTimeString(),
      };
      setChatContent(prevChatContent => [...prevChatContent, newMessage]);
    },
    [chatContent]
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = e.target.value.trim();
    addMessageToChat(message, "user");
    if (message === "") return;
    const response = await sendMessageToOpenAI(message);
    addMessageToChat(response, "admin");
    e.target.value = "";
  };


  return (
    <>
      {!isChatVisible && (
        <div>
          <BsMessenger
            className={styles.iconMessager}
            onClick={handleMessengerClick}
          />
        </div>
      )}
      {isChatVisible && (
        <div className="page-content page-container" id="page-content">
          <div className="padding">
            <div className="row container d-flex justify-content-center">
              <div className="col-md-6">
                <div className="card card-bordered">
                  <div className="card-header">
                    <h4 className="card-title">
                      <strong>Chat</strong>
                    </h4>
                    <a
                      onClick={handleMessengerClick}
                      className="btn btn-xs btn-secondary"
                      href="#"
                      data-abc="true"
                    >
                      Close
                    </a>
                  </div>
                  <div
                    className="ps-container ps-theme-default ps-active-y"
                    id="chat-content"
                  >
                    {chatContent.map((message, index) => (
                      <div
                        key={index}
                        className={`media media-chat ${
                          message.sender === "admin" ? "" : "media-chat-reverse"
                        }`}
                      >
                        {message.sender === "admin" ? (
                          <img
                            className="avatar"
                            src={`https://img.icons8.com/color/36/000000/user.png`}
                            alt="..."
                          />
                        ) : (
                          ""
                        )}
                        <div className="media-body">
                          <p>{message.message}</p>
                          <p className="meta">
                            <time dateTime={message.time}>{message.time}</time>
                          </p>
                        </div>
                      </div>
                    ))}
                    <div
                      className="ps-scrollbar-x-rail"
                      style={{ left: 0, bottom: 0 }}
                    >
                      <div
                        className="ps-scrollbar-x"
                        tabIndex={0}
                        style={{ left: 0, width: 0 }}
                      />
                    </div>
                    <div
                      className="ps-scrollbar-y-rail"
                      style={{ top: 0, height: 0, right: 2 }}
                    >
                      <div
                        className="ps-scrollbar-y"
                        tabIndex={0}
                        style={{ top: 0, height: 2 }}
                      />
                    </div>
                  </div>
                  <div className="publisher bt-1 border-light">
                    <img
                      className="avatar avatar-xs"
                      src="https://img.icons8.com/color/36/000000/user.png"
                      alt="..."
                    />
                    <input
                      className="publisher-input"
                      type="text"
                      placeholder="Write something"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage(e)
                      }
                    />
                    <span className="publisher-btn file-group">
                      <i className="fa fa-paperclip file-browser" />
                      <input type="file" />
                    </span>
                    <a className="publisher-btn" href="#" data-abc="true">
                      <i className="fa fa-smile" />
                    </a>
                    <button
                      className="publisher-btn text-info"
                      onClick={handleSendMessage}
                    >
                    Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatOnline;
