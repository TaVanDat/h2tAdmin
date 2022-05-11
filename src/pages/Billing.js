/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import './style.css'
import {
  Row, Col, Card, Radio, Table, Button, Avatar,
  Typography, Pagination, Modal, Input, Select, notification, Spin,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from '@ant-design/icons';
// import { ToTopOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { API_URL } from '../api/API_URL'
import axios from 'axios';
import useStateRef from 'react-usestateref';
import moment from 'moment'
import { Format } from '../services/Format'
// Images
// import ava1 from "../assets/images/logo-shopify.svg";
// import ava2 from "../assets/images/logo-atlassian.svg";
// import ava3 from "../assets/images/logo-slack.svg";
// import ava5 from "../assets/images/logo-jira.svg";
// import ava6 from "../assets/images/logo-invision.svg";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
// import pencil from "../assets/images/pencil.svg";

const { Title } = Typography;
const { Option } = Select

// table code start



function Billing() {
  const history = useHistory()
  const auth = localStorage.getItem('token_admin') ? true : false
  useEffect(() => {
    !auth && history.replace('/sign-in')
  }, [])
  const [dataUser, setDataUser, dataUserRef] = useStateRef([])
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDataEdit, setIsDataEdit] = useState({})
  const [isAddNew, setIsAddNew] = useState({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [disabled, setDisabled] = useState(true)
  const [categoryName, setCategoryName] = useState("")
  const [code, setCode] = useState("")
  const [statusId, setStatusId] = useState(1)
  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/bill/all`)
    if (response && response.data) {
      setDataUser(response.data.data.data)
      setIsLoading(false)
      setSuccess(false)
      // console.log(dataUserRef.current)
    }
  }
  const handleChangeCategoryName = (e) => {
    setCategoryName(e.target.value);
  }
  useEffect(() => {
    if (categoryName && isAddNew.Code && isAddNew.StatusId) {
      setDisabled(false)
    }
    else setDisabled(true)
  }, [categoryName, isAddNew])
  useEffect(() => {
    fetchData()
  }, [success, isLoading])

  const columns = [
    {
      title: "Bill Code",
      dataIndex: "Code",
      key: "Code",
      width: 10,
      // sorter: (a, b) => a.Id.length - b.Id.length,

      // fixed: 'left'
    },
    {
      title: "Account",
      dataIndex: "Account",
      key: "Account",
      width: 30,
      // sorter: (a, b) => a.Name.length - b.Name.length,
      // fixed: 'left'
    },
    {
      title: "Total",
      // dataIndex: "Total",
      key: "Total",
      width: 30,
      render(record) {
        return (
          <>
            {Format(record.Total)}
          </>
        );
      }
    },
    {
      title: "OrderDate",
      key: "OrderDate",
      width: 50,
      render(record) {
        return (
          <div>
            {moment(record.OrderDate).format('DD-MM-YYYY')}
          </div>
        );
      }
    },
    {
      title: "TransformMethod",
      key: "TransformMethod",
      width: 100,
      dataIndex: "TransformMethod",

    },
  ];


  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Bill Table"
            >
              <div className="table-responsive" >
                {isLoading ? <Spin /> :
                  <Table
                    rowKey={dataUserRef.current.map(item => { return (item.Id) })}
                    columns={columns}
                    dataSource={dataUserRef.current}
                    pagination={{ pageSize: 5 }}
                    className="ant-border-space"
                  />
                }
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Billing;
