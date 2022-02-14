import React from "react";
import {
  Layout,
  Select,
  Button,
  Table,
  Empty,
  message,
  Icon,
  Modal,
  Tooltip,
  Form,
  Row,
  Col,
} from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import IDocmVO from "../type";
import { IDeptVO, IinvalidAttachInfo } from "../../user/manage/type";
import Http, {
  QueryResult,
  QueryRequest,
  serverPath,
} from "../../../../common/http";
import { modulePath } from "../index";
import { toLine } from "../../../../common/util";
import {
  addToolBarScrollEventListener,
  removeToolBarScrollEventListener,
} from "../../../../common/util";
import { UserContext } from "../../../index";
import ContractNumSelector from "../../../../common/selector/contractnum";
import "./index.css";

const { Content } = Layout;
const { Option } = Select;

const colLayout = {
  xs: { span: 6 },
  md: { span: 6 },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    md: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 19 },
    md: { span: 19 },
  },
};

type IProps = RouteComponentProps & {};

interface IState {
  loading: boolean;
  needFixed: boolean;
  selectedRowKeys: string[] | number[];
  /**
   * 项目类型下拉选数据
   */
  projectTypes: Array<string>;
  /**
   * 查询结果
   */
  data: QueryResult<IDocmVO>;
  pageSize: number | undefined;
  current: number | undefined;
  /**
   * 查询条件与排序
   */
  param: {
    conditions: any | undefined;
    sorters: any | undefined;
  };

  /**
   * 部门数据
   */
  deptData: Array<IDeptVO>;

  /**
   * 附件数据更新的Modal框是否显示
   */
  visible: boolean;

  /**
   * 无效的附件信息
   */
  invalidAttachInfos: Array<IinvalidAttachInfo>;
}

class List extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      needFixed: false,
      selectedRowKeys: [],
      projectTypes: [],
      data: {
        total: undefined,
        content: [],
      },
      pageSize: 15,
      current: 1,
      param: {
        conditions: {},
        sorters: {},
      },
      deptData: [],
      visible: false,
      invalidAttachInfos: [],
    };
  }

  componentDidMount() {
    this.loadProjectTypes();
    this.loadDeptData();
    this.handleListChange();
    addToolBarScrollEventListener(
      () => this.setState({ needFixed: true }),
      () => this.setState({ needFixed: false })
    );
  }

  componentWillUnmount() {
    // 移除工具条滚动时的监听
    removeToolBarScrollEventListener();
  }

  handleListChange = () => {
    this.setState({ loading: true }, () => {
      const { pageSize, current, param } = this.state;
      const queryRequest: QueryRequest = {
        pageSize,
        current,
        ...param,
      };
      Http.post("/docm/list", queryRequest)
        .then((res) => {
          this.setState({ loading: false, data: res.data.data });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    });
  };

  loadProjectTypes = () => {
    Http.get(`/docm/type/list`)
      .then((res) => {
        this.setState({ projectTypes: res.data.data });
      })
      .catch((err) => {
        message.error("加载项目类型数据失败");
      });
  };

  loadDeptData = () => {
    this.setState({ loading: true }, () => {
      Http.post(`/dept/list-all`)
        .then((res) => {
          this.setState({ loading: false, deptData: res.data.data });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    });
  };

  handleSelectChange = (field, value) => {
    const { conditions } = this.state.param;
    conditions[field] = value;
    this.setState({ current: 1 });
    this.handleListChange();
  };

  handleCheckInvalidAttach = async () => {
    Http.get("/doc/check-invalid-attach")
      .then((res) => {
        this.setState({
          loading: false,
          invalidAttachInfos: res.data,
          visible: true,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleDeleteInvalidAttach = async (attachs) => {
    Http.post("/doc/delete-invalid-attach", attachs)
      .then((res) => {
        message.success("操作成功");
        this.setState({
          loading: false,
          invalidAttachInfos: [],
          visible: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleDeleteOper = async (ids: Array<string> | Array<number>) => {
    Modal.confirm({
      title: "确定删除?",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let queryString = "";
        ids.forEach((id) => (queryString = queryString.concat(`ids=${id}&`)));
        await Http.delete(
          `/docm?${queryString.substring(0, queryString.length - 1)}`
        );
        message.success("删除成功");
        this.handleListChange();
      },
    });
  };

  buildColumns() {
    const columns = [
      {
        title: "序号",
        key: "index",
        render: (text, record, index) => {
          return index + 1;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "5%" },
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: "center" } }),
      },
      {
        title: "合同名称",
        dataIndex: "projectName",
        key: "projectName",
        sorter: (a, b) => {
          return a.id - b.id;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center" },
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          },
        }),
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "合同类型",
        dataIndex: "projectType",
        key: "projectType",
        sorter: (a, b) => {
          return a.id - b.id;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "10%" },
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          },
        }),
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "乙方名称",
        dataIndex: "company",
        key: "company",
        sorter: (a, b) => {
          return a.id - b.id;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "10%" },
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          },
        }),
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "中标编号",
        dataIndex: "contractNum",
        key: "contractNum",
        sorter: (a, b) => {
          return a.id - b.id;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "10%" },
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          },
        }),
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "科室",
        dataIndex: "dept",
        key: "dept",
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "6%" },
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          },
        }),
        render: (text) => (
          <Tooltip placement="topLeft" title={text ? text.name : ""}>
            {text ? text.name : ""}
          </Tooltip>
        ),
      },
      {
        title: "总金额",
        dataIndex: "money",
        key: "money",
        sorter: (a, b) => {
          return a.id - b.id;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "15%" },
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: "center" } }),
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
        render: (text, record, index) => {
          return moment(record.createTime).format("YYYY-MM-DD HH:mm:ss");
        },
        sorter: (a, b) => {
          return a.id - b.id;
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "12%" },
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: "center" } }),
      },
      {
        title: "操作",
        key: "operation",
        render: (text, record, index) => {
          return (
            <UserContext.Consumer>
              {(userInfo) => {
                const DOCM_EDIT_OPER_permission = userInfo["permissions"].find(
                  (perm) => perm.id === "DOCM_EDIT_OPER"
                );
                const DOCM_DELETE_OPER_permission = userInfo[
                  "permissions"
                ].find((perm) => perm.id === "DOCM_DELETE_OPER");
                const DOCM_DOWNLOAD_OPER_permission = userInfo[
                  "permissions"
                ].find((perm) => perm.id === "DOCM_DOWNLOAD_OPER");
                return (
                  <div>
                    {DOCM_EDIT_OPER_permission && (
                      <Button
                        type={"link"}
                        onClick={(event) => {
                          event.preventDefault();
                          this.props.history.push(
                            `${modulePath}/edit/${record.id}`
                          );
                        }}
                      >
                        编辑
                      </Button>
                    )}
                    {DOCM_DOWNLOAD_OPER_permission &&
                      record.attachments &&
                      record.attachments.length > 0 && (
                        <Button
                          type={"link"}
                          href={`${serverPath}/doc?id=${
                            record.id
                          }&xAuthToken=${sessionStorage.getItem("xAuthToken")}`}
                          target="_blank"
                        >
                          下载
                        </Button>
                      )}
                    {DOCM_DELETE_OPER_permission && (
                      <Button
                        type={"link"}
                        onClick={() => this.handleDeleteOper([record.id])}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                );
              }}
            </UserContext.Consumer>
          );
        },
        onHeaderCell: (column) => ({
          style: { textAlign: "center", width: "16%" },
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: "center" } }),
      },
    ];
    return columns;
  }

  renderTable() {
    const {
      loading,
      data,
      pageSize,
      current,
      selectedRowKeys,
      visible,
      invalidAttachInfos,
    } = this.state;
    return (
      <UserContext.Consumer>
        {(userInfo) => {
          const DOCM_DELETE_OPER_permission = userInfo["permissions"].find(
            (perm) => perm.id === "DOCM_DELETE_OPER"
          );
          const rowSelection = DOCM_DELETE_OPER_permission
            ? {
                columnWidth: "30px",
                selectedRowKeys,
                onChange: (selectedRowKeys) => {
                  this.setState({ selectedRowKeys });
                },
              }
            : undefined;
          return !loading && data && data.content.length > 0 ? (
            <>
              <Table
                rowKey={(record) => {
                  return record.id;
                }}
                rowSelection={rowSelection}
                columns={this.buildColumns()}
                dataSource={data.content}
                loading={loading}
                onRow={(record, index) => {
                  return {
                    onClick: (event) => {
                      if (event.target["tagName"] !== "TD") {
                        return;
                      }
                      this.props.history.push(
                        `${modulePath}/view/${record.id}`
                      );
                    },
                  };
                }}
                size={"small"}
                pagination={{
                  total: data.total,
                  current,
                  pageSize,
                  pageSizeOptions: ["15", "30", "50"],
                  showSizeChanger: true,
                  onShowSizeChange: (current, pageSize) => {
                    this.setState({ current: 1, pageSize });
                  },
                  showTotal: (total) => {
                    return `共 ${total} 条`;
                  },
                }}
                onChange={(pagination, filters, sorter, extra) => {
                  const { param } = this.state;
                  const { current, pageSize } = pagination;
                  const { field, order } = sorter;
                  param.sorters = {};
                  if (field && order) {
                    param.sorters[toLine(field)] = fetchOrderDirection(order);
                  }
                  this.setState({ current, pageSize });
                  this.handleListChange();
                }}
              />
              {invalidAttachInfos && invalidAttachInfos.length > 0 ? (
                <Modal
                  visible={visible}
                  title="不存在的文件"
                  onOk={(e) => {
                    message.info("OK");
                  }}
                  onCancel={(e) => {
                    this.setState({ visible: false });
                  }}
                  footer={[
                    <Button
                      key="delete"
                      loading={loading}
                      type="primary"
                      onClick={() =>
                        this.handleDeleteInvalidAttach(invalidAttachInfos)
                      }
                    >
                      清理
                    </Button>,
                    <Button
                      key="cancel"
                      loading={loading}
                      onClick={() => {
                        this.setState({ visible: false });
                      }}
                    >
                      取消
                    </Button>,
                  ]}
                  width={1000}
                >
                  {invalidAttachInfos.map((info) => (
                    <p>{info.path}</p>
                  ))}
                </Modal>
              ) : (
                visible && this.handleNotFoundInvalidAttachs()
              )}
            </>
          ) : (
            <Empty description={"暂无内容"} />
          );
        }}
      </UserContext.Consumer>
    );
  }

  handleNotFoundInvalidAttachs() {
    message.success("所有附件正常");
    this.setState({ visible: false });
  }

  renderKeywordSearchBar() {
    return (
      <Select
        mode={"tags"}
        placeholder={"合同名称、乙方名称或金额"}
        tokenSeparators={[" "]}
        showArrow={true}
        suffixIcon={<Icon style={{ fontSize: "16px" }} type="search" />}
        onChange={this.handleSelectChange.bind(this, "keywords")}
        notFoundContent={null}
      />
    );
  }

  renderProjectTypeSearchBar() {
    const { projectTypes } = this.state;
    return (
      <Select
        placeholder={"请选择合同类型"}
        allowClear
        showArrow={true}
        onChange={this.handleSelectChange.bind(this, "projectType")}
        notFoundContent={"暂无数据"}
      >
        {projectTypes.map((pType) => (
          <Option key={pType} value={pType}>
            {pType}
          </Option>
        ))}
      </Select>
    );
  }

  renderDeptSearchBar() {
    const { deptData } = this.state;
    return (
      <Select
        placeholder={"请选择"}
        allowClear
        showArrow={true}
        onChange={this.handleSelectChange.bind(this, "dept")}
      >
        {deptData.map((dept) => (
          <Option key={dept.id} value={dept.id}>
            {dept.name}
          </Option>
        ))}
      </Select>
    );
  }

  renderContractNumSearchBar() {
    return (
      <ContractNumSelector
        onChange={this.handleSelectChange.bind(this, "contractNum")}
      />
    );
  }

  renderButtonBar() {
    const { selectedRowKeys } = this.state;
    return (
      <UserContext.Consumer>
        {(userInfo) => {
          const DOCM_ADD_OPER_permission = userInfo["permissions"].find(
            (perm) => perm.id === "DOCM_ADD_OPER"
          );
          const DOCM_DELETE_OPER_permission = userInfo["permissions"].find(
            (perm) => perm.id === "DOCM_DELETE_OPER"
          );
          return (
            <div style={{ margin: "4px", flex: 1 }}>
              <span style={{ float: "right" }}>
                {DOCM_DELETE_OPER_permission && (
                  <Button
                    className="ele-operation"
                    type="ghost"
                    onClick={() => {
                      this.handleCheckInvalidAttach();
                    }}
                  >
                    检查附件
                  </Button>
                )}
                {DOCM_ADD_OPER_permission && (
                  <Button
                    className="ele-operation"
                    type="primary"
                    onClick={() => {
                      this.props.history.push(`${modulePath}/add`);
                    }}
                  >
                    新建
                  </Button>
                )}
                {DOCM_DELETE_OPER_permission && (
                  <Button
                    type="ghost"
                    disabled={selectedRowKeys.length < 1}
                    onClick={() => {
                      this.handleDeleteOper(selectedRowKeys);
                    }}
                  >
                    批量删除
                  </Button>
                )}
              </span>
            </div>
          );
        }}
      </UserContext.Consumer>
    );
  }

  renderToolBar() {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1" }}>
            <Form {...formItemLayout}>
              <Row gutter={10}>
                <Col {...colLayout}>
                  <Form.Item key={"renderKeywordSearchBar"} label={"关键字"}>
                    {this.renderKeywordSearchBar()}
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    key={"renderProjectTypeSearchBar"}
                    label="合同类型"
                  >
                    {this.renderProjectTypeSearchBar()}
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item key={"renderDeptSearchBar"} label="科室">
                    {this.renderDeptSearchBar()}
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    key={"renderContractNumSearchBar"}
                    label="中标编号"
                  >
                    {this.renderContractNumSearchBar()}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div style={{ flex: ".2" }}>{this.renderButtonBar()}</div>
        </div>
      </div>
    );
  }

  render() {
    const { needFixed } = this.state;
    return (
      <Content>
        <div className="list-page">
          <div className="list-page-content">
            <div
              className={`list-page-content-toolbar ${
                needFixed ? "toolbar-fixed" : ""
              }`}
            >
              {this.renderToolBar()}
            </div>
            <div className="list-page-content-table">{this.renderTable()}</div>
          </div>
        </div>
      </Content>
    );
  }
}

function fetchOrderDirection(order: string) {
  if (order === "descend") {
    return "desc";
  } else {
    return "asc";
  }
}

export default withRouter(List);
