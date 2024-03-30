import React,{useEffect,useState} from "react";
import { Outlet,Link, } from 'react-router-dom';
import "../../styles/sidebarAdmin.css";
import SideBar from "../../component/SidebarAdmin";
import { FiMenu } from "react-icons/fi";
import { getTokenFromLocalStorage,getIdUser,removeTokenFromLocalStorage } from "../../utils/tokenUtils";
import jwt_decode from "jwt-decode";
import SideBarDoctor from "../../component/SidebarDoctor";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const LayoutAdmin = () => {
  const [role, setRole] = useState('');
  const [id, setId] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const IdUser = getIdUser();


  
  useEffect(() => {
    const token = getTokenFromLocalStorage();

    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const { roleId : roleId, id: id } = decodedToken;
        setRole(roleId);
        setId(id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
      const getUser = async () => {
        try {
          const response = await axios.get(`http://localhost:3333/users/${IdUser}`);
          setUser(response.data.payload);
        } catch (error) {
          console.error("Error searching products:", error);
        }
      };
      getUser();
  }, []);

  const handleLogout = () => {
    navigate("/login");
    removeTokenFromLocalStorage();
  };

  return (
    <>
      <div>
        <input type="checkbox" id="nav-toggle" />
        <div className="sidebar">
          {role === 'R1' ? (
            <SideBar />
          ):(
            <SideBarDoctor/>
          )}
        </div>
        <div className="main-content">
          <header>
            <h4>
              <label htmlFor="nav-toggle">
                <FiMenu className="menu-admin-icon"/>
              </label>{" "}
            </h4>
            <div className="user-wrapper">
              <div className="btn-group">
              <div className="has-dropdown">
                <img className="avatar" src={`http://localhost:3333/${user.image}`} />
                <ul className="sub-menu">
                    <li>
                      <p onClick={handleLogout}>
                        Đăng xuất
                      </p>
                    </li>
                  </ul>
            </div>
            </div>
            </div>
          </header>
            <main>
            <Outlet/>
          </main>
        </div>
      </div>

    </>
  );
};

export default LayoutAdmin;
