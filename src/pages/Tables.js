/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import './style.css'
import {
  Row, Col, Card, Button, Table, Avatar, Form, InputNumber, Upload,
  Typography, Pagination, Modal, Input, Select, notification, Spin, Drawer, Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusSquareOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';

import { Format } from "../services/Format"
import { useHistory } from "react-router-dom";
import { API_URL } from '../api/API_URL'
import axios from 'axios';
import useStateRef from 'react-usestateref';
import moment from 'moment'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Editor from '../components/common/Editor';
// Images
const { TextArea } = Input;
const url = 'https://res.cloudinary.com/dbfjceflf/image/upload/v1651163135/h2tstore/'

const { Title } = Typography;
const { Option } = Select

// table code start

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  // wrapperCol: {
  //   xs: {
  //     span: 26,
  //   },
  //   sm: {
  //     span: 16,
  //   },
  // },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function News() {
  const history = useHistory()
  const auth = localStorage.getItem('token_admin') ? true : false
  useEffect(() => {
    !auth && history.replace('/sign-in')
  }, [])
  const [category, setCategory, categoryRef] = useStateRef([])
  const [dataUser, setDataUser, dataUserRef] = useStateRef([])
  const [dataSearch, setDataSearch, dataSearchRef] = useStateRef([])
  const [isEditing, setIsEditing] = useState(false)
  const [isDataEdit, setIsDataEdit] = useState({})
  const [isDataAdd, setIsDataAdd] = useState({})
  const [isAddNew, setIsAddNew] = useState({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fileName, setFileName] = useState('');
  const [addNews, setAddNews] = useState(false)
  const [editorLoaded, setEditorLoaded] = useState(false);
  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/product/list`)
    const res = await axios.get(`${API_URL}/category/all`)
    if (response && response.data) {
      setDataUser(response.data.data.data)
      setDataSearch(response.data.data.data)
      setIsLoading(false)
      setSuccess(false)
      // console.log(dataUserRef.current)
    }
    if (res && res.data) {
      setCategory(res.data.data.data)
      // console.log(categoryRef.current)
    }
  }


  useEffect(() => {
    fetchData()
  }, [success, isLoading])

  useEffect(() => {
    setEditorLoaded(true);
  }, []);


  const handleSearch = (e) => {
    const search = e.target.value;
    setDataUser(pre => {
      return (dataSearchRef.current.filter(item => {
        if (item.Name.includes(search))
          return item
      }))
    })
  }
  const columns = [

    {
      title: "Name",
      key: "Name",
      width: 220,
      fixed: 'left',
      sorter: (a, b) => a.Name.length - b.Name.length,
      ellipsis: {
        showTitle: false,
      },
      render(record) {
        return (
          <>
            {record.Image ?
              (<><img src={url + record.Image[0]} alt='not' width={30} height={35} title={record.Name} />&emsp;{record.Name}</>)
              : (<><img src={url + 'empty.png'} alt='not' width={30} height={35} title={record.Name} />&emsp;{record.Name}</>)
            }
          </>
        );
      }
    },
    {
      title: "Description",
      key: "Description",
      dataIndex: 'Description',
      width: 400,
      ellipsis: {
        showTitle: false,
      },
      // render(record) {
      //   return (
      //     <>
      //       {record.Description.substr(0, 50)}...
      //     </>
      //   );
      // }
    },
    {
      title: "Price",
      key: "Price",
      width: 80,
      sorter: (a, b) => a.Price - b.Price,
      render(record) {
        return (
          <>
            {Format(record.Price)}
          </>
        );
      }
    },
    {
      title: "SalePrice",
      key: "SalePrice",
      width: 80,
      sorter: (a, b) => a.SalePrice - b.SalePrice,
      render(record) {
        return (
          <>
            {Format(record.SalePrice)}
          </>
        );
      }
    },
    {
      title: "Category",
      key: "Category",
      width: 100,
      filters: [
        {
          text: 'Áo',
          value: '1',
        },
        {
          text: 'Quần',
          value: '5',
        },
        {
          text: 'Balo',
          value: '9',
        },
        {
          text: 'Giày',
          value: '10',
        },
        {
          text: 'Khác',
          value: '11',
        },
      ],
      onFilter: (value, record) => record.CategoryId.indexOf(value) === 0,
      sorter: (a, b) => a.CategoryId - b.CategoryId,
      render(record) {
        return (
          <>
            {categoryRef.current.filter(item => {
              if (Number(item.Id) === Number(record.CategoryId)) {
                return item
              }
            })[0]?.Name}
            {/* {record.CategoryId} */}
          </>
        );
      }
    },
    {
      title: "Quantity",
      key: "Quantity",
      dataIndex: "Quantity",
      width: 80,
      sorter: (a, b) => a.Quantity - b.Quantity,
    },
    {
      title: "Size",
      key: "Size",
      width: 130,
      // dataIndex: "Size",
      render(record) {
        return (
          <div>
            {record.Size.join(',')}
          </div>
        );
      }
    },
    {
      title: "Action",
      key: "Action",
      fixed: 'right',
      width: 100,
      render(record) {
        return (
          <>
            {/* <PlusSquareOutlined onClick={() => BtnAddNew(record)} style={{ color: 'green', cursor: 'pointer', marginRight: 10, fontSize: 20 }} /> */}
            <EditOutlined onClick={() => BtnModalUpdate(record)} style={{ color: 'aqua', cursor: 'pointer', fontSize: 20, marginRight: 10 }} />
            <Popconfirm title="Sure to delete?" onConfirm={() => BtnDelete(record)}>
              <DeleteOutlined style={{ color: 'red', cursor: 'pointer', fontSize: 20, marginRight: 10 }} />
            </Popconfirm>
          </>
        );
      }
    },

  ];

  const BtnModalUpdate = (record) => {
    setIsEditing(true)
    setIsDataEdit({ ...record, Image: [] })

  }

  const BtnDelete = async (record) => {
    // Modal.confirm({
    //   title: "You sure delete?",
    //   onText: "Yes",
    //   okType: 'danger',
    //   onOk: async () => {
    await axios.delete(`${API_URL}/product/delete/${record.Id}`)
      .then(() => {
        notification.success({
          message: 'Delete Success!',
          description: '',
          className: "delete-success"
        })
        setSuccess(state => !state)
      })
      .catch(err => {
        notification.success({
          message: 'Delete Failed:  ' + err,
          description: '',
          className: "delete-error"
        })
      })
    // }
    // })


  }
  const UpdateUser = async () => {
    const dataPro = dataUserRef.current.filter(item => {
      if (Number(item.Id) === Number(isDataEdit.Id))
        return item
    })

    await axios.put(`${API_URL}/product/update/${isDataEdit.Id}`,
      {
        ...isDataEdit,
        Image: isDataEdit.Image?.join(','),
        SalePrice: Number(dataPro[0].SalePrice) === Number(isDataEdit.SalePrice) ? (dataPro[0].SalePrice / isDataEdit.Price) * isDataEdit.Price : isDataEdit.SalePrice * isDataEdit.Price,
        Size: isDataEdit.Size?.join(",")
      },
      {
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
        // setIsDataEdit({})
        setIsEditing(false)
        // setAddNews(false)
      })
      .catch(err => {
        notification.error({
          message: 'Update Error' + err,
          description: '',
          className: 'update-error'
        })
        setSuccess(false)
      })
    // setIsEditing(false)
    // console.log(isDataEdit)

  }


  const [form] = Form.useForm();
  //create code random
  const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomCode = Array.apply(null, Array(12)).map(function () { return string.charAt(Math.floor(Math.random() * string.length)); }).join('');

  const AddNews = async (values) => {
    const valueUpdate = {
      ...values,
      Code: randomCode,
      SalePrice: values.Price * values.SalePrice,
      Size: values.Size.join(","),
      Image: isDataAdd.Image ? isDataAdd.Image : 'empty.png',
      Description: isDataAdd.Description
    }
    axios.post(`${API_URL}/product/add`, valueUpdate, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        notification.success({
          message: 'Add Success',
          description: '',
          className: 'add-success'
        })
        setIsLoading(false)
        setSuccess(true)
        form.resetFields();
      })
      .catch(err => {
        notification.error({
          message: 'Add Error:  ' + err,
          description: '',
          className: 'add-error'
        })
        setSuccess(false)
      })
    console.log('Received values of form: ', valueUpdate);
  };
  //create code random
  // const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // const randomCode = Array.apply(null, Array(12)).map(function () { return string.charAt(Math.floor(Math.random() * string.length)); }).join('');

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Products Table"
              extra={
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Input
                    className="header-search"
                    placeholder="Type here..."
                    prefix={<SearchOutlined />}
                    style={{ padding: '0 10px', borderRadius: 10, marginRight: 10 }}
                    onChange={handleSearch}
                  />
                  <Button onClick={() => setAddNews(true)} type='second' style={{ display: 'flex', alignItem: 'center' }}>
                    <PlusSquareOutlined style={{ color: 'green', cursor: 'pointer', marginTop: 4, fontSize: 30 }} />
                    Add New
                  </Button>
                  <Drawer
                    title="Create a new News"
                    width={720}
                    bodyStyle={{ paddingBottom: 80 }}
                    onClose={() => {
                      setAddNews(false)
                    }}
                    visible={addNews}
                  >
                    <Form
                      {...formItemLayout}
                      form={form}
                      name="Add News"
                      onFinish={AddNews}
                      scrollToFirstError
                    >
                      <Row gutter={[24, 0]}>

                        <Col xs={24} sm={24} md={12} lg={12} xl={24} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item
                              name="Name"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please input Name',
                                },
                              ]}
                            >
                              <Input autoFocus placeholder='Fill in Product Name' />
                            </Form.Item>
                          </Card>
                        </Col>
                      </Row>
                      <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item
                              name="Price"
                              rules={[
                                {
                                  type: 'number',
                                  min: 1,
                                },
                                {
                                  required: true,
                                  message: 'Please input Price',
                                },
                              ]}
                            >
                              <InputNumber style={{ width: '100%', lineHeight: "31px", borderRadius: 5 }} placeholder='Fill in Product Price' />
                            </Form.Item>
                          </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item name="SalePrice"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select SalePrice',
                                },
                              ]}>
                              <Select style={{ width: "100%", lineHeight: "31px" }} allowClear placeholder="Please select SalePrice">
                                <Option value={1}>0%</Option>
                                <Option value={0.25}>25%</Option>
                                <Option value={0.30}>30%</Option>
                                <Option value={0.50}>50%</Option>
                                <Option value={0.75}>75%</Option>
                              </Select>
                            </Form.Item>
                          </Card>
                        </Col>
                      </Row>
                      <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item name="UnitOfMeasureId"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select UnitOfMeasureId',
                                },
                              ]}>
                              <Select style={{ width: "100%", lineHeight: "31px" }} placeholder="Please select Size">
                                <Option value={1}>Cái</Option>
                                <Option value={2}>Chiếc</Option>
                                <Option value={3}>Bộ</Option>
                                <Option value={4}>Đôi</Option>
                              </Select>
                            </Form.Item>
                          </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item
                              name="CategoryId"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select CategoryId',
                                },
                              ]}
                            >
                              <Select style={{ width: "100%", lineHeight: "31px" }} placeholder="Please select CategoryId">
                                <Option value="1">Áo</Option>
                                <Option value="5">Quần</Option>
                                <Option value="9">Balo</Option>
                                <Option value="10">Giày</Option>
                                <Option value="11">Khác</Option>
                              </Select>
                            </Form.Item>
                          </Card>
                        </Col>
                      </Row>
                      <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item
                              name="BuyerStoreId"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select BuyerStoreId',
                                },
                              ]}
                            >
                              <Select style={{ width: "100%", lineHeight: "31px" }} placeholder="Please select BuyerStoreId">
                                <Option value="1">CÔNG TY CỔ PHẦN THỜI TRANG H2T VIỆT NAM</Option>
                              </Select>
                            </Form.Item>
                          </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item
                              name="Quantity"
                              rules={[
                                {
                                  type: "number",
                                  min: 0, max: 200
                                },
                                {
                                  required: true,
                                  message: 'Please input Quantity',
                                },
                              ]}
                            >
                              <InputNumber style={{ width: '100%', lineHeight: "40px", borderRadius: 5 }} placeholder='Fill in Product Quantity' />
                            </Form.Item>
                          </Card>
                        </Col>
                      </Row>
                      <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Form.Item
                              name="Size"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Size',
                                },
                              ]}
                            >
                              <Select
                                style={{ width: '100%', lineHeight: "31px", borderRadius: '20px' }}
                                mode="multiple"
                                allowClear
                                placeholder="Please select Size"
                              >
                                <Option value="S">S</Option>
                                <Option value="M">M</Option>
                                <Option value="L">L</Option>
                                <Option value="X">X</Option>
                                <Option value="XXL">XXL</Option>
                              </Select>
                            </Form.Item>
                          </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                          <Card bordered={false} className="criclebox h-full">
                            <Upload
                              accept='.png,.jpg'
                              status='done'
                              action={`${API_URL}/upload/cloudinary`}
                              showUploadList={{ showRemoveIcon: false }}
                              name='img'
                              maxCount={1}
                              onChange={(res) => {
                                if (res.file.status === 'done') {
                                  // console.log(res.file.response?.fileName)

                                  setIsDataAdd(pre => {
                                    return {
                                      ...pre, Image: res.file.response?.fileName
                                    }
                                  })
                                }
                              }}
                            // customRequest={{ status: 'done' }}
                            >
                              <Button icon={<UploadOutlined />}>Upload (Max:1)</Button>
                            </Upload>
                            {/* <Button type='primary'>Upload</Button> */}
                          </Card>
                        </Col>
                      </Row>

                      <p> Description:
                        <CKEditor
                          editor={ClassicEditor}
                          data={isDataEdit.Description}

                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setIsDataAdd(pre => {
                              return {
                                ...pre, Description: data
                              }
                            })
                          }}

                        />

                      </p><br /> <br />
                      <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                          Add News
                        </Button>
                      </Form.Item>
                    </Form>
                  </Drawer>
                </div>
              }
            >
              <div className="table-responsive" >
                {isLoading ? <Spin /> :
                  <Table
                    rowKey={dataUserRef.current.map(item => { return (item.Id) })}
                    dataSource={dataUserRef.current}
                    className="ant-border-space"
                    columns={columns}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    scroll={{ x: 1300 }}
                  />
                }

                {/* edit news */}

                <Drawer
                  title="Update a new News"
                  width={720}
                  bodyStyle={{ paddingBottom: 80 }}
                  onClose={() => {
                    setIsEditing(false)
                    form.resetFields()
                  }}
                  visible={isEditing}
                >
                  <Row gutter={[24, 0]}>

                    <Col xs={24} sm={24} md={12} lg={12} xl={24} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">

                        <Input autoFocus placeholder='Fill in Product Name'
                          value={isDataEdit.Name}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, Name: e.target.value
                              }
                            })
                          }
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">
                        <InputNumber style={{ width: '100%', lineHeight: "31px", borderRadius: 5 }}
                          placeholder='Fill in Product Price'
                          min={0}
                          value={isDataEdit.Price}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, Price: e?.target?.value
                              }
                            })
                          }
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">

                        <Select style={{ width: "100%", lineHeight: "31px" }}
                          allowClear
                          placeholder={`${isDataEdit?.SalePrice / isDataEdit?.Price}`}
                          defaultValue={isDataEdit.SalePrice / isDataEdit.Price}
                          onChange={e => {
                            setIsDataEdit(pre => {
                              return {
                                ...pre, SalePrice: e
                                // * isDataEdit.Price
                              }
                            })
                            // console.log(isDataEdit.SalePrice)
                          }
                          }
                        >
                          <Option value={1}>0%</Option>
                          <Option value={0.25}>25%</Option>
                          <Option value={0.3}>30%</Option>
                          <Option value={0.5}>50%</Option>
                          <Option value={0.75}>75%</Option>
                        </Select>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">

                        <Select style={{ width: "100%", lineHeight: "31px" }}
                          placeholder={isDataEdit.UnitOfMeasureId}
                          // value={isDataEdit.UnitOfMeasureId}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, UnitOfMeasureId: e
                              }
                            })
                          }
                        >
                          <Option value={1}>Cái</Option>
                          <Option value={2}>Chiếc</Option>
                          <Option value={3}>Bộ</Option>
                          <Option value={4}>Đôi</Option>
                        </Select>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">

                        <Select style={{ width: "100%", lineHeight: "31px" }}
                          placeholder="Please select CategoryId"
                          value={isDataEdit.CategoryId}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, CategoryId: e
                              }
                            })
                          }
                        >
                          <Option value="1">Áo</Option>
                          <Option value="5">Quần</Option>
                          <Option value="9">Balo</Option>
                          <Option value="10">Giày</Option>
                          <Option value="11">Khác</Option>
                        </Select>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">

                        <Select style={{ width: "100%", lineHeight: "31px" }}
                          placeholder="Please select BuyerStoreId"
                          value={isDataEdit.BuyerStoreId}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, BuyerStoreId: e
                              }
                            })
                          }
                        >
                          <Option value="1">CÔNG TY CỔ PHẦN THỜI TRANG H2T VIỆT NAM</Option>
                        </Select>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">

                        <InputNumber style={{ width: '100%', lineHeight: "40px", borderRadius: 5 }}
                          placeholder='Fill in Product Quantity'
                          min={0} max={200}
                          value={isDataEdit.Quantity}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, Quantity: e?.target?.value
                              }
                            })
                          }
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">
                        <Select
                          style={{ width: '100%', lineHeight: "31px", borderRadius: '20px' }}
                          mode="multiple"
                          allowClear
                          placeholder={isDataEdit.Size?.join(',')}
                          // value={isDataEdit.Size?.join(",")}
                          onChange={e =>
                            setIsDataEdit(pre => {
                              return {
                                ...pre, Size: e
                              }
                            })
                          }
                        >
                          <Option value="S">S</Option>
                          <Option value="M">M</Option>
                          <Option value="L">L</Option>
                          <Option value="X">X</Option>
                          <Option value="XXL">XXL</Option>
                        </Select>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                      <Card bordered={false} className="criclebox h-full">
                        <Upload
                          accept='.png,.jpg'
                          status='done'
                          action={`${API_URL}/upload/cloudinary`}
                          showUploadList={{ showRemoveIcon: false }}
                          name='img'
                          maxCount={5}
                          onChange={(res) => {
                            if (res.file.status === 'done') {
                              // console.log(res.file.response?.fileName)
                              setFileName(pre => {
                                return [
                                  ...pre, res.file.response?.fileName,
                                ]
                              })
                              setIsDataEdit(pre => {
                                return {
                                  ...pre, Image: [...pre.Image, res.file.response?.fileName]
                                }
                              })
                            }
                          }}
                        // customRequest={{ status: 'done' }}
                        >
                          <Button icon={<UploadOutlined />}>Upload (Max&lt;=5)</Button>
                        </Upload>
                        {/* <Button type='primary'>Upload</Button> */}
                      </Card>
                    </Col>
                  </Row>
                  {/* <Input.TextArea showCount rows={20} /> */}
                  <p> Description:
                    <CKEditor
                      editor={ClassicEditor}
                      data={isDataEdit.Description}

                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setIsDataEdit(pre => {
                          return {
                            ...pre, Description: data
                          }
                        })
                      }}

                    />

                  </p><br /> <br />
                  <div style={{ textAlign: 'center' }}>
                    <Button type='primary' onClick={UpdateUser}>Save</Button>
                  </div>
                </Drawer>

              </div>
            </Card>
          </Col>
        </Row>
      </div >
    </>
  );
}

export default News;
