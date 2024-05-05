import React, { useState, useEffect, useMemo, useCallback } from "react";
import io from "socket.io-client";
import "../../../styles/chatOnline.scss";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import { BASE_URL } from "../../../utils/apiConfig";
import { BsFillSendFill } from "react-icons/bs";

const ChatOnline = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [customerDataArray, setCustomerDataArray] = useState([]);
  const adminSocket = io(`${BASE_URL}/`);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const token = getTokenFromLocalStorage();

  useEffect(() => {
    adminSocket.emit("getRooms");
    adminSocket.on("roomList", (rooms) => {
      setRoomList(rooms);
    });

    return () => {
      adminSocket.off("roomList");
    };
  }, [loadCustomer]);

  useEffect(() => {
    const handleReceiveMessage = ({ roomId }) => {
      setLoadCustomer((prevMessages) => [...prevMessages, { roomId }]);
    };
    adminSocket.on("update", handleReceiveMessage);
    return () => {
      adminSocket.off("update", handleReceiveMessage);
    };
  }, [adminSocket]);

  useEffect(() => {
    if (selectedRoom) {
      adminSocket.emit("joinRoom", { roomId: selectedRoom });
    }
  }, [selectedRoom]);

  useEffect(() => {
    adminSocket.on("messageHistory", (history) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedRoom]: history,
      }));
    });
  }, [adminSocket]);

  useEffect(() => {
    const handleReceiveMessage = ({ content, roomId }) => {
      setRoomId(roomId);
      if (selectedRoom && roomId === selectedRoom) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [roomId]: [...(prevMessages[roomId] || []), { content }],
        }));
      }
    };
    adminSocket.on("message", handleReceiveMessage);
    return () => {
      adminSocket.off("message", handleReceiveMessage);
    };
  }, [selectedRoom]);

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() !== "") {
      const message = {
        content: messageInput,
        senderId: "admin",
        receiverId: selectedRoom.split("-")[0],
      };
      adminSocket.emit("chat", { roomId: selectedRoom, message });
      setMessageInput("");
    }
  }, [messageInput, selectedRoom]);

  const handleRoomSelect = (roomId, customerData) => {
    setSelectedRoom(roomId);
    setSelectedCustomer(customerData);
  };
  useEffect(() => {
    const fetchCustomerData = async () => {
      const customerIds = roomList.map((room) => room.split("-")[0]);
      const fetchPromises = customerIds.map(async (customerId) => {
        try {
          const response = await axios.get(`${BASE_URL}/users/${customerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data.payload;
        } catch (error) {
          console.error("Error fetching customer data:", error);
          return null;
        }
      });

      const customerDataArray = await Promise.all(fetchPromises);
      setCustomerDataArray(
        customerDataArray.filter((customer) => customer !== null)
      );
    };

    fetchCustomerData();
  }, [roomList, token]);

  return (
    <>
      <div id="frame">
        <div id="sidepanel">
          <div id="profile">
            <div className="wrap">
              <img
                id="profile-img"
                src="http://emilcarlsson.se/assets/mikeross.png"
                className="online"
                alt=""
              />
              <p>Admin</p>
              <i
                className="fa fa-chevron-down expand-button"
                aria-hidden="true"
              />
              <div id="status-options">
                <ul>
                  <li id="status-online" className="active">
                    <span className="status-circle" /> <p>Online</p>
                  </li>
                  <li id="status-away">
                    <span className="status-circle" /> <p>Away</p>
                  </li>
                  <li id="status-busy">
                    <span className="status-circle" /> <p>Busy</p>
                  </li>
                  <li id="status-offline">
                    <span className="status-circle" /> <p>Offline</p>
                  </li>
                </ul>
              </div>
              <div id="expanded">
                <label htmlFor="twitter">
                  <i className="fa fa-facebook fa-fw" aria-hidden="true" />
                </label>
                <input name="twitter" type="text" defaultValue="mikeross" />
                <label htmlFor="twitter">
                  <i className="fa fa-twitter fa-fw" aria-hidden="true" />
                </label>
                <input name="twitter" type="text" defaultValue="ross81" />
                <label htmlFor="twitter">
                  <i className="fa fa-instagram fa-fw" aria-hidden="true" />
                </label>
                <input name="twitter" type="text" defaultValue="mike.ross" />
              </div>
            </div>
          </div>
          <div id="search">
            <label htmlFor="">
              <i className="fa fa-search" aria-hidden="true" />
            </label>
            <input type="text" placeholder="Search contacts..." />
          </div>
          <div id="contacts">
            <ul>
              {roomList.map((roomId, index) => {
                const customerData = customerDataArray[index];
                if (customerData) {
                  return (
                    <li
                      key={roomId}
                      onClick={() => handleRoomSelect(roomId, customerData)}
                      className="contact"
                    >
                      <div className="wrap">
                        <span className="contact-status online" />
                        <img src={`${BASE_URL}/${customerData.image}`} alt="" />
                        <div className="meta">
                          <p className="name">
                            {customerData.firstName} {customerData.lastName}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
          <div id="bottom-bar">
            <button id="addcontact">
              <i className="fa fa-user-plus fa-fw" aria-hidden="true" />{" "}
              <span>Add contact</span>
            </button>
            <button id="settings">
              <i className="fa fa-cog fa-fw" aria-hidden="true" />{" "}
              <span>Settings</span>
            </button>
          </div>
        </div>
        <div className="content">
          <div className="contact-profile">
            {selectedCustomer && (
              <>
                <img src={`${BASE_URL}/${selectedCustomer.image}`} alt="" />
                <p>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </p>
              </>
            )}
            <div className="social-media">
              <i className="fa fa-facebook" aria-hidden="true" />
              <i className="fa fa-twitter" aria-hidden="true" />
              <i className="fa fa-instagram" aria-hidden="true" />
            </div>
          </div>
          <div className="messages">
            <ul>
              {messages[selectedRoom]?.map((message, index) => (
                <li
                  key={index}
                  className={`${
                    message.content.senderId === "admin" ? "replies" : "sent"
                  }`}
                >
                  {message.content.senderId === "admin" ? (
                    <img
                      src="http://emilcarlsson.se/assets/mikeross.png"
                      alt=""
                    />
                  ) : (
                    <>
                      {selectedCustomer && (
                        <img
                          src={`${BASE_URL}/${selectedCustomer.image}`}
                          alt=""
                        />
                      )}
                    </>
                  )}
                  <p>{message.content.content}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="message-input">
            <div className="wrap">
              <input
                type="text"
                placeholder="Write your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
              />
              <button onClick={handleSendMessage} className="submit">
                <BsFillSendFill />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatOnline;
