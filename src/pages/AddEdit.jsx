import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import "./AddEdit.css";
import fireDb from "../firebase";
import { toast } from "react-toastify";
import { Button, Form, Input } from "antd";

const initialState = {
  company: "",
  mst: "",
  phone: "",
  date: "",
  name: "",
  branch: "",
  address: "",
  status: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  const [doc, setDoc] = useState({});

  const { company, mst, phone, date, name, branch, address, status } = state;

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    fireDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        const doc = snapshot.val();
        const transformedData = Object.keys(doc).map((id, index) => ({
          ...doc[id],
          id: id,
        }));
        // setData(transformedData);
        setDoc(doc);
      } else {
        setDoc({});
      }
    });
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...doc[id] });
    } else {
      setState({ ...initialState });
    }

    return () => {
      setState({ ...initialState });
    };
  }, [id, doc]);

  const handleSubmit = (e) => {
    if (!company || !mst || !phone) {
      toast.error("Please input Company, Mst, Phone", {
        autoClose: 3000,
      });
      return;
    } else {
      if (!id) {
        fireDb.child("contacts").push(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Contacts Added Successfully", {
              autoClose: 1000,
            });
          }
        });
      } else {
        fireDb.child(`contacts/${id}`).set(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Contacts Update Successfully", {
              autoClose: 1000,
            });
          }
        });
      }
    }

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleInputChange = (e) => {
    console.log(state);
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div style={{ marginTop: "150px" }}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
          alignContent: "center",
          margin: "auto",
          padding: "0 5%",
        }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item label="Tên Cty">
          <Input
            name="company"
            onChange={handleInputChange}
            value={company || ""}
          />
        </Form.Item>

        <Form.Item label="MST">
          <Input name="mst" onChange={handleInputChange} value={mst || ""} />
        </Form.Item>

        <Form.Item label="Phone">
          <Input
            name="phone"
            onChange={handleInputChange}
            value={phone || ""}
          />
        </Form.Item>

        <Form.Item label="Ngày">
          <Input name="date" onChange={handleInputChange} value={date || ""} />
        </Form.Item>

        <Form.Item label="Người đại diện">
          <Input name="name" onChange={handleInputChange} value={name || ""} />
        </Form.Item>

        <Form.Item label="Ngành">
          <Input
            name="branch"
            onChange={handleInputChange}
            value={branch || ""}
          />
        </Form.Item>

        <Form.Item label="Địa chỉ">
          <Input
            name="address"
            onChange={handleInputChange}
            value={address || ""}
          />
        </Form.Item>

        <Form.Item label="Tình trạng">
          <Input
            name="status"
            onChange={handleInputChange}
            value={status || ""}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEdit;
