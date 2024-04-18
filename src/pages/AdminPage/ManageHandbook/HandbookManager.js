import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../../styles/mainAdmin.css";
import { FiPlusCircle } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import axios from "axios";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { MdDeleteForever } from "react-icons/md";
import ModalDelete from "../../../component/ModalDelete";
import { BASE_URL } from "../../../utils/apiConfig";


const HandbookManager = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [handbook, setHandbook] = useState("");
  const [show, setShow] = useState(false);
  const [idDelete, setIdDelete] = useState();


  const token = getTokenFromLocalStorage();

  const getAllHandbook = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/handbook`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHandbook(response.data.payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllHandbook();
  }, []);
  console.log('««««« handbook »»»»»', handbook);

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
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Image",
      key: "image",
      render: (text, record) => (
        <div>
          {record && record.image ? (
            <img
              src={`${BASE_URL}/${record.image}`}
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
      title: "Action",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <span>
          <Link to={`/admin/handbook-manager/updateHandbook/${record.id}`}>
            <PiPencilSimpleLineFill
              className="icon-update"
            />
          </Link>
          <a>
            <MdDeleteForever className="icon-delete"  onClick={() =>  handleShow(record.id)}/>
            <ModalDelete
              isModalOpen={show}
              handleOk={handleDelete}
              handleCancel={handleCancel}
            />
          </a>
        </span>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/handbook/${idDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAllHandbook();
      setShow(false)
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleCancel = () => setShow(false);
  const handleShow = (id) => {
    setIdDelete(id)
    setShow(true)
  }

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#">
              <b>Danh sách cẩm nang</b>
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
                    to="/admin/handbook-manager/addHandbook"
                    className="active1"
                  >
                    <FiPlusCircle style={{ marginRight: "5px" }} />
                    Tạo mới cẩm nang
                  </NavLink>
                </div>
                <div className="table-data">
                  <Table columns={columns} dataSource={handbook} />;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HandbookManager;
