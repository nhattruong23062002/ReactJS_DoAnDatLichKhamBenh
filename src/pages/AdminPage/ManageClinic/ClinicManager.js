import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../../../styles/mainAdmin.css";
import { FiPlusCircle } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import axios from "axios";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { MdDeleteForever } from "react-icons/md";
import UpdateClinic from "./UpdateClinic";

const ClinicManager = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [clinics, setClinics] = useState("");
  const [show, setShow] = useState(false);

  const token = getTokenFromLocalStorage();

  const getAllClinic = async () => {
    try {
      const response = await axios.get("http://localhost:3333/clinic?name=", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClinics(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  useEffect(() => {
    getAllClinic();
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Image",
      key: "image",
      width: "18%",
      render: (text, record) => (
        <div>
          {record && record.image ? (
            <img
              src={`http://localhost:3333/${record.image}`}
              alt="error"
              style={{ width: "100px" }}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
      ),
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
      title: "Action",
      key: "action",
      width: "15%",
      render: (text, record) => (
        <span>
          <a>
            <PiPencilSimpleLineFill
              className="icon-update"
              onClick={() => {
                handleShow();
                setName(record.name);
                setAddress(record.address);
              }}
            />
            <UpdateClinic
              show={show}
              handleClose={handleClose}
              address={address}
              name={name}
              setName={setName}
              setAddress={setAddress}
              handleSubmitUpdate={() => {
                handleSubmitUpdate(record.id);
              }}
            />
          </a>
          <a onClick={() => handleDelete(record.id)}>
            <MdDeleteForever className="icon-delete" />
          </a>
        </span>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3333/clinic/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllClinic();
      alert("Đã xóa thành công");
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleSubmitUpdate = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/clinic/${id}`,
        {
          name,
          address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShow(false);
      getAllClinic();
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    console.log("New show value:", show);
  }, [show]);

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#">
              <b>Danh sách phòng khám</b>
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
                  <NavLink
                    to="/admin/clinic-manager/addClinic"
                    className="active1"
                  >
                    <FiPlusCircle style={{ marginRight: "5px" }} />
                    Tạo mới phòng khám
                  </NavLink>
                </div>
                <div className="table-data">
                  <Table columns={columns} dataSource={clinics} />;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClinicManager;
