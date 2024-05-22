import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
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
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../../utils/apiConfig";

const UserManager = () => {
  const [user, setUser] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [show, setShow] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryValue = searchParams.get("query");
  const [idDelete, setIdDelete] = useState("");

  const searchInput = useRef(null);

  const token = getTokenFromLocalStorage();

  const getAllUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users?role=${queryValue || ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          <Link to={`/admin/user-manage/updateUser/${record.id}`}>
            <PiPencilSimpleLineFill className="icon-update" />
          </Link>
          <a>
            <MdDeleteForever
              className="icon-delete"
              onClick={() => handleShow(record.id)}
            />
            <ModalDelete
              isModalOpen={show}
              handleOk={handleDeleteUser}
              handleCancel={handleCancel}
            />
          </a>
        </span>
      ),
    },
  ];

  const handleCancel = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setIdDelete(id);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${idDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShow(false);
      getAllUser();
    } catch (error) {
      console.error("Error searching products:", error);
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

  let message;

  if (queryValue === "R2") {
    message = "Danh sách Bác sĩ";
  } else if (queryValue === "R3") {
    message = "Danh sách Bệnh nhân";
  } else {
    message = "Danh sách User";
  }

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#">
              <b>{message}</b>
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
