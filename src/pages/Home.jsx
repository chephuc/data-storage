import React, { useRef, useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Space, Table, Button, message, Upload, Tooltip, Input } from "antd";
import fireDb from "../firebase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState({});

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      hidden: true,
    },
    {
      title: "Tên Cty",
      dataIndex: "company",
      key: "company",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Mst",
      dataIndex: "mst",
      key: "mst",
      width: 150,
    },
    {
      title: "Sđt",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Nđd",
      dataIndex: "name",
      key: "name",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Ngành",
      dataIndex: "branch",
      key: "branch",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/update/${record.id}`}>
            <a>Update</a>
          </Link>
          <a onClick={() => handleDelete(record)}>Delete</a>
        </Space>
      ),
      width: 150,
    },
  ].filter((item) => !item.hidden);

  const searchAll = () => {
    fireDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        const doc = snapshot.val();
        const transformedData = Object.keys(doc).map((id, index) => ({
          ...doc[id],
          id: id,
        }));
        setData(transformedData);
      } else {
        setData({});
      }
    });
  };

  useEffect(() => {
    searchAll();
  }, []);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    // buttonsStyling: false,
  });

  const handleDelete = (record) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          fireDb.child(`contacts/${record.id}`).remove((err) => {
            if (err) {
              toast.error(err);
            } else {
              toast.success("Deleted Successfully", {
                autoClose: 1000,
              });
            }
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire("Cancelled", "", "error");
        }
      });
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming only one sheet in the Excel file
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert worksheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Check for required fields
      const requiredFields = ["Tên Cty", "Mst", "Sđt"];
      const missingFields = requiredFields.filter(
        (field) => !Object.keys(jsonData[0]).includes(field)
      );

      if (missingFields.length > 0) {
        message.error(
          `Invalid file format. Missing fields: ${missingFields.join(", ")}`
        );
        return;
      }

      const transformedData = jsonData.map((item) => ({
        company: item["Tên Cty"] ? item["Tên Cty"] : "",
        mst: item["Mst"] ? item["Mst"] : "",
        phone: item["Sđt"] ? item["Sđt"] : "",
        name: item["Nđd"] ? item["Nđd"] : "",
        date: item["Ngày"] ? item["Ngày"] : "",
        branch: item["Ngành"] ? item["Ngành"] : "",
        address: item["Địa chỉ"] ? item["Địa chỉ"] : "",
        status: item["Tình trạng"] ? item["Tình trạng"] : "",
      }));

      // Save data to Firebase
      transformedData.forEach((item) => {
        fireDb.child("contacts").push(item, (err) => {
          if (err) {
            toast.error(err);
          }
        });
      });

      message.success(`${file.name} file uploaded successfully`);
    };

    reader.readAsArrayBuffer(file);
  };

  const exportToExcel = () => {
    const transformedData = data.map((item) => ({
      "Tên Cty": item["company"] ? item["company"] : "",
      Mst: item["mst"] ? item["MST"] : "",
      Sđt: item["phone"] ? item["Sđt"] : "",
      Nđd: item["name"] ? item["name"] : "",
      Ngày: item["date"] ? item["date"] : "",
      Ngành: item["branch"] ? item["branch"] : "",
      "Địa chỉ": item["address"] ? item["address"] : "",
      "Tình trạng": item["status"] ? item["status"] : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataEP = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataEP, "data.xlsx");
  };

  const customRequest = (options) => {
    const { file } = options;

    handleFileUpload(file);
  };

  const downloadTemplate = () => {
    // Create a workbook with desired structure and format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Tên Cty",
        "Mst",
        "Sđt",
        "Nđd",
        "Ngày",
        "Ngành",
        "Địa chỉ",
        "Tình trạng",
      ],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert workbook to binary array buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the array buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file using FileSaver.js
    saveAs(blob, "template.xlsx");
  };

  if (Array.isArray(data)) {
    return (
      <div style={{ marginTop: "100px", padding: "0 5%" }}>
        <div style={{ float: "right", marginBottom: "8px" }}>
          <Button style={{ marginRight: "5px" }} onClick={downloadTemplate}>
            Download Template
          </Button>
          <Space style={{ width: "100px", marginRight: "5px" }}>
            <Upload
              name="file"
              accept=".xlsx, .xls"
              maxCount={1}
              showUploadList={false}
              customRequest={customRequest}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Space>
          <Button onClick={exportToExcel}>Export to Excel</Button>
        </div>

        <Table columns={columns} dataSource={data} />
      </div>
    );
  }
};

export default Home;
