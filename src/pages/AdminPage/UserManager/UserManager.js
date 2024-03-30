import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../../../styles/mainAdmin.css";
import axios from "axios";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { MdDeleteForever } from "react-icons/md";
import UpdateUser from "./UpdateUser";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import { FiPlusCircle } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import ModalDelete from "../../../component/ModalDelete";

const UserManager = () => {
  const [user, setUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [roleId, setRole] = useState("");
  const [positionId, setPosition] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const searchInput = useRef(null);

  const token = getTokenFromLocalStorage();

  const getAllUser = async () => {
    try {
      const response = await axios.get("http://localhost:3333/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "FirstName",
      dataIndex: "firstName",
      key: "firstName",
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "LastName",
      dataIndex: "lastName",
      key: "lastName",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (text, record) => (
        <span>
          <a>
            <PiPencilSimpleLineFill className="icon-update" 
             onClick={() => {
              handleShow();
              setFirstName(record.firstName);
              setLastName(record.lastName);
              setPhoneNumber(record.phoneNumber);
              setEmail(record.email);
              setAddress(record.address);
              setRole(record.roleId);
              setGender(record.gender);
              setPosition(record.positionId);
            }}
            />
            <UpdateUser
              handleSubmitUpdate={() => {
                handleSubmitUpdate(record.id);
              }}
              show={show}
              handleClose={handleClose}
              firstName={firstName}
              lastName={lastName}
              phoneNumber={phoneNumber}
              email={email}
              address={address}
              roleId={roleId}
              gender={gender}
              positionId={positionId}
              setEmail={setEmail}
              setLastName={setLastName}
              setPhoneNumber={setPhoneNumber}
              setFirstName={setFirstName}
              setAddress={setAddress}
              handleRoleChange={handleRoleChange}
              handleGenderChange={handleGenderChange}
              handlePositionChange={handlePositionChange}
            />
          </a>
          <a
            onClick={() => {
              showModal();
              /* handleDeleteUser(record.id); */
            }}
            >
            <MdDeleteForever className="icon-delete" />
            <ModalDelete
             isModalOpen = {isModalOpen}
             handleCancel = {handleCancel}
             handleOk = {handleOk}
            />
          </a>
        </span>
      ),
    },
  ];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3333/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Đã xóa thành công");
      getAllUser();
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleSubmitUpdate = async (idUpdate) => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/users/${idUpdate}`,
        {
          firstName,
          lastName,
          email,
          address,
          phoneNumber,
          gender: gender,
          positionId: positionId,
          roleId: roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShow(false);
      getAllUser();
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error:", error);
      alert('Có lỗi thông tin muốn cập nhật')
      setShow(false);
    }
  };

  useEffect(() => {
    const $ = window.$;
    const DataTable = window.DataTable;
    // Khởi tạo DataTables
    $("#example").DataTable();
    // Đảm bảo DataTables sẽ được giải phóng khi component bị hủy
    return () => {
      $("#example").DataTable().destroy();
    };
  }, []);

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  const handlePositionChange = (e) => {
    const selectedPosition = e.target.value;
    setPosition(selectedPosition);
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#">
              <b>Danh sách User</b>
            </a>
          </li>
        </ul>
        <div id="clock"></div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <div className="row element-button">
                <div className="add-user">
                  <NavLink to="/admin/user-manage/addUser" className="active1">
                    <FiPlusCircle style={{ marginRight: "5px" }} />
                    Tạo mới User
                  </NavLink>
                </div>
                <div className="table-data">
                  <Table columns={columns} dataSource={user} />;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserManager;
