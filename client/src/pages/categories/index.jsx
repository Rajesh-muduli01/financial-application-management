// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Modal, Table, Tag } from "antd";
import axiosInstance from "../../api/axiosInstance";
import ManageCategoryModal from "./ManageCategoryModal";
import toast from "react-hot-toast";

export default function Categories() {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [id, setId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 10,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <Tag color={text === "INCOME" ? "green" : "red"}>{text}</Tag>
      ),
      filters: [
        {
          text: "INCOME",
          value: "INCOME",
        },
        {
          text: "EXPENSE",
          value: "EXPENSE",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.type.startsWith(value),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex items-center justify-start">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => {
              setId(record._id);
              setModalVisible(true);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-900 ml-4"
            onClick={() => {
              setDeleteId(record._id);
              setDeleteModalVisible(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.data);
      setInitLoading(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/category/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Category deleted successfully", { duration: 4000 });
      fetchData();
      setDeleteId(null);
      setDeleteModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category", { duration: 4000 });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ManageCategoryModal
        open={modalVisible}
        setOpen={setModalVisible}
        fetchData={fetchData}
        id={id}
        setId={setId}
      />

      <Modal
        confirmLoading={loading}
        title={"Attention Required !"}
        open={deleteModalVisible}
        setOpen={setDeleteModalVisible}
        okButtonProps={{
          className:
            "bg-gray-800 hover:!bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50",
        }}
        okText="Delete"
        onOk={deleteCategory}
        cancelText="Cancel"
        onCancel={() => {
          setId(null);
          setDeleteModalVisible(false);
        }}
      >
        Are you sure you want to delete this category?
      </Modal>

      <div className="px-4 sm:px-6 lg:px-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage All the Categories of your Finance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => setModalVisible(true)}
            >
              Add Category
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table
                  loading={initLoading || loading}
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
