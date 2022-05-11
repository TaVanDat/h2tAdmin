/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import './style.css'
import {
    Row, Col, Card, Radio, Table, Button, Avatar, Form,
    Typography, Pagination, Modal, Input, Select, notification, Spin, Drawer,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from '@ant-design/icons';

import { useHistory } from "react-router-dom";
import { API_URL } from '../api/API_URL'
import axios from 'axios';
import useStateRef from 'react-usestateref';
import moment from 'moment'
// Images
const { TextArea } = Input;
const url = 'https://res.cloudinary.com/dbfjceflf/image/upload/v1651163135/h2tstore/'


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
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
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
    const [dataUser, setDataUser, dataUserRef] = useStateRef([])
    const [isEditing, setIsEditing] = useState(false)
    const [isDataEdit, setIsDataEdit] = useState({})
    const [isAddNew, setIsAddNew] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [addNews, setAddNews] = useState(false)

    const fetchData = async () => {
        const response = await axios.get(`${API_URL}/news/list`)
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

    const columns = [
        {
            title: "Name",
            // dataIndex: "Name",
            key: "Name",
            width: 30,
            sorter: (a, b) => a.Name.length - b.Name.length,
            render(record) {
                return (
                    <>
                        <img src={url + record.Image} alt="not" title={record.Name} width={50} height={30} style={{ marginRight: 10 }} />{record.Name.substr(0, 30)}...
                    </>
                );
            }
            // fixed: 'left'
        },
        {
            title: "Content",
            // dataIndex: "Content",
            key: "Content",
            width: 30,
            render(record) {
                return (
                    <>
                        {record.Name.substr(0, 30)}...
                    </>
                );
            }

        },
        {
            title: "Title",
            key: "Title",
            width: 50,
            // dataIndex: "Title",
            render(record) {
                return (
                    <>
                        {record.Title.substr(0, 25)}...
                    </>
                );
            }
        },
        {
            title: "Action",
            key: "Action",
            fixed: 'right',
            width: 40,
            render(record) {
                return (
                    <>
                        {/* <PlusSquareOutlined onClick={() => BtnAddNew(record)} style={{ color: 'green', cursor: 'pointer', marginRight: 10, fontSize: 20 }} /> */}
                        <EditOutlined onClick={() => BtnModalUpdate(record)} style={{ color: 'aqua', cursor: 'pointer', fontSize: 20, marginRight: 10 }} />
                        <DeleteOutlined onClick={() => BtnDelete(record)} style={{ color: 'red', cursor: 'pointer', fontSize: 20, marginRight: 10 }} />
                    </>
                );
            }
        },
    ];

    const BtnModalUpdate = (record) => {
        setIsEditing(true)
        setIsDataEdit({ ...record })

    }

    const BtnDelete = async (record) => {
        await axios.delete(`${API_URL}/news/delete/${record.Id}`)
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
    }
    const UpdateUser = async () => {
        await axios.put(`${API_URL}/news/update/${isDataEdit.Id}`, { ...isDataEdit, Image: 'empty.png' }, {
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
                setAddNews(false)
            })
            .catch(err => {
                notification.error({
                    message: 'Update Error' + err,
                    description: '',
                    className: 'update-error'
                })
                setSuccess(false)
            })
        // console.log(isDataEdit)

    }


    const [form] = Form.useForm();
    const AddNews = async (values) => {
        const valueUpdate = {
            ...values,
            Image: 'empty.png'
        }
        axios.post(`${API_URL}/news/add`, valueUpdate, {
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
        // console.log('Received values of form: ', valueUpdate);
    };
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
                                <>
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
                                            <Form.Item
                                                name="Name"
                                                label="News Name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input Name',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name="Title"
                                                label="Title"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input Title',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name="Content"
                                                label="Content"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input Content',
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea showCount rows={15} />
                                            </Form.Item>

                                            <Form.Item {...tailFormItemLayout}>
                                                <Button type="primary" htmlType="submit">
                                                    Add News
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Drawer>
                                </>
                            }
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
                                    <label> News Name:
                                        <Input placeholder='Fill in News Name'
                                            value={isDataEdit.Name}
                                            onChange={e =>
                                                setIsDataEdit(pre => {
                                                    return {
                                                        ...pre, Name: e.target.value
                                                    }
                                                })
                                            } />
                                    </label><br /><br />
                                    <label> Title:
                                        <Input placeholder='Fill in Title'
                                            value={isDataEdit.Title}
                                            onChange={e =>
                                                setIsDataEdit(pre => {
                                                    return {
                                                        ...pre, Title: e.target.value
                                                    }
                                                })
                                            } />
                                    </label><br /><br />
                                    <label> Content:
                                        <TextArea rows={15}
                                            placeholder='Fill in Content'
                                            value={isDataEdit.Content}
                                            onChange={e =>
                                                setIsDataEdit(pre => {
                                                    return {
                                                        ...pre, Content: e.target.value
                                                    }
                                                })
                                            }
                                        />

                                    </label><br /> <br />
                                    <div style={{ textAlign: 'center' }}>
                                        <Button type='primary' onClick={UpdateUser}>Save</Button>
                                    </div>
                                </Drawer>

                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default News;
