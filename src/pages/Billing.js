/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import './style.css'
import {
  Row, Col, Card, Table, Button, Drawer, Input, InputNumber,
  Modal, notification, Spin, Select
} from "antd";
import { EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { API_URL } from '../api/API_URL'
import axios from 'axios';
import useStateRef from 'react-usestateref';
import moment from 'moment'
import { Format } from '../services/Format'

const { Option } = Select



function Billing() {
  const history = useHistory()
  const auth = localStorage.getItem('token_admin') ? true : false
  useEffect(() => {
    !auth && history.replace('/sign-in')
  }, [])
  const [dataUser, setDataUser, dataUserRef] = useStateRef([])
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDataEdit, setIsDataEdit, isDataEditRef] = useStateRef([])
  const [isAddNew, setIsAddNew] = useState({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/bill/all`)
    if (response && response.data) {
      setDataUser(response.data.data.data)
      setIsLoading(false)
      setSuccess(false)
      // console.log(dataUserRef.current)
    }
  }


  useEffect(() => {
    fetchData()
  }, [success, isLoading])

  const handleChangeStatus = async (record, e) => {
    const dataStatus = { Id: record.Id, StatusId: e }
    // update-bill
    await axios.put(`${API_URL}/bill/update-bill`, dataStatus, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        notification.success({
          message: 'Update Success',
          description: '',
          className: 'update-success'
        })
        setIsLoading(false)
        setSuccess(true)
      })
      .catch(err => {
        notification.error({
          message: 'Update Error' + err,
          description: '',
          className: 'update-error'
        })
        setSuccess(false)
      })
    console.log(dataStatus)
  }
  const columns = [
    {
      title: "M?? h??a ????n",
      dataIndex: "Code",
      key: "Code",
      width: 10,
    },
    {
      title: "Kh??ch h??ng",
      dataIndex: "Account",
      key: "Account",
      width: 30,
      // sorter: (a, b) => a.Name.length - b.Name.length,
      // fixed: 'left'
    },
    {
      title: "Th??nh ti???n",
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
      title: "Ng??y ?????t",
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
      title: "Tr???ng th??i",
      key: "StatusId",
      width: 100,
      // dataIndex: "StatusId",
      render(record) {
        return (
          <div>
            {/* {Number(record.StatusId) === 3 ? '??ang ch???' : (Number(record.StatusId) === 4 ? '???? duy???t' : '???? h???y')} */}
            <Select defaultValue={3} value={Number(record.StatusId) === 3 ? '??ang ch???' : (Number(record.StatusId) === 4 ? '???? duy???t' : '???? h???y')} onChange={(e) => {
              // setIsDataEdit({
              //   Id: record.Id,
              //   StatusId: e
              // })
              // console.log({
              //   Id: record.Id,
              //   StatusId: e
              // })
              handleChangeStatus(record, e);
            }}>
              <Option value={3}>??ang ch???</Option>
              <Option value={4}>???? duy???t</Option>
              <Option value={5}>???? h???y</Option>
            </Select>
          </div>
        );
      }

    },
    {
      title: "Ph????ng th???c v???n chuy???n",
      key: "TransformMethod",
      width: 100,
      dataIndex: "TransformMethod",

    },
    {
      title: "H??nh ?????ng",
      key: "Action",
      width: 100,
      render(record) {
        return (
          <div>
            <FileTextOutlined onClick={() => {
              handleDetailBill(record)
            }}
              style={{ color: 'aqua', cursor: 'pointer', fontSize: 20, marginRight: 10 }} />
          </div>
        );
      },
    },
  ];
  const columnsDetail = [
    {
      title: "T??n s???n ph???m",
      dataIndex: "Name",
      key: "Name",
      width: 10,
    },
    {
      title: "S??? l?????ng",
      dataIndex: "Quantity",
      key: "Quantity",
      width: 30,
      // sorter: (a, b) => a.Name.length - b.Name.length,
      // fixed: 'left'
    },
    {
      title: "????n gi??",
      // dataIndex: "Price",
      key: "Price",
      width: 30,
      render(record) {
        return (
          <>
            {Format(record.Price)}
          </>
        );
      }
    },
    {
      title: "Th??nh ti???n",
      key: "Amount",
      width: 100,
      // dataIndex: "TransformMethod",
      render(record) {
        return (
          <>
            {Format(record.Amount)}
          </>
        );
      }
    },

  ];
  const handleDetailBill = async (record) => {
    setIsEditing(true);
    await axios.get(`${API_URL}/bill/${record.Id}`)
      .then(res => {
        setIsDataEdit(res.data.data.data)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Danh s??ch h??a ????n"
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

                <Drawer
                  title="H??a ????n chi ti???t"
                  width={720}
                  bodyStyle={{ paddingBottom: 80 }}
                  onClose={() => {
                    setIsEditing(false)
                  }}
                  visible={isEditing}
                >
                  <Row gutter={[24, 0]}>
                    <Table
                      rowKey={isDataEditRef.current.map(item => { return (item.Id) })}
                      columns={columnsDetail}
                      dataSource={isDataEditRef.current}
                      pagination={{ pageSize: 5 }}
                      className="ant-border-space"
                    />
                  </Row>

                </Drawer>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Billing;
