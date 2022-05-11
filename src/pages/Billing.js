/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import './style.css'
import {
  Row, Col, Card, Table, Button, Drawer,
  Modal, notification, Spin,
} from "antd";
import { EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { API_URL } from '../api/API_URL'
import axios from 'axios';
import useStateRef from 'react-usestateref';
import moment from 'moment'
import { Format } from '../services/Format'





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
  const [categoryName, setCategoryName] = useState("")
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
    fetchData()
  }, [success, isLoading])

  const columns = [
    {
      title: "Bill Code",
      dataIndex: "Code",
      key: "Code",
      width: 10,
      // render(record) {
      //   return (
      //     <div>
      //       <Link to={`/bill/detail/${record.Id}`} style={{ color: '#000' }}>{record.Code}</Link>
      //     </div>
      //   );
      // }
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
      title: "Status",
      key: "StatusId",
      width: 100,
      // dataIndex: "StatusId",
      render(record) {
        return (
          <div>
            {Number(record.StatusId) === 3 ? 'Đang chờ' : (Number(record.StatusId) === 4 ? 'Đã duyệt' : 'Đã hủy')}
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
    {
      title: "Action",
      key: "Action",
      width: 100,
      render() {
        return (
          <div>
            <FileTextOutlined style={{ color: '#000', cursor: 'pointer', fontSize: 20, marginRight: 10 }} />
            <EditOutlined style={{ color: 'aqua', cursor: 'pointer', fontSize: 20 }} />
          </div>
        );
      },
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
