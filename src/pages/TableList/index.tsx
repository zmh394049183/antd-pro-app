import { addUser, removeUser, getUserList, updateUser } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './index.less';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CurrentUser) => {
  const hide = message.loading('正在添加');
  await addUser({ data: { ...fields } });
  hide();
  message.success('添加成功');
  return true;
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.CurrentUser) => {
  const hide = message.loading('修改中');
  await updateUser({ data: { ...fields } });
  hide();
  message.success('修改成功');
  return true;
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.CurrentUser[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  await removeUser({
    data: {
      key: selectedRows.map((row) => row._id),
    },
  });
  hide();
  message.success('删除成功');

  return true;
};

const TableList: React.FC = () => {
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    type: 'edit' | 'add';
    initialValues?: API.CurrentUser;
    title: '编辑用户' | '添加用户';
  }>({
    open: false,
    type: 'add',
    title: '添加用户',
  });
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CurrentUser>();
  const [selectedRowsState, setSelectedRows] = useState<API.CurrentUser[]>([]);

  const columns: ProColumns<API.CurrentUser>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },

    // {
    //   title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="Description" />,
    //   dataIndex: 'desc',
    //   valueType: 'textarea',
    // },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="pages.searchTable.titleCallNo"
    //       defaultMessage="Number of service calls"
    //     />
    //   ),
    //   dataIndex: 'callNo',
    //   sorter: true,
    //   hideInForm: true,
    //   renderText: (val: string) => `${val}`,
    // },
    // {
    //   title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
    //   dataIndex: 'status',
    //   hideInForm: true,
    //   valueEnum: {
    //     0: {
    //       text: (
    //         <FormattedMessage
    //           id="pages.searchTable.nameStatus.default"
    //           defaultMessage="Shut down"
    //         />
    //       ),
    //       status: 'Default',
    //     },
    //     1: {
    //       text: (
    //         <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
    //       ),
    //       status: 'Processing',
    //     },
    //     2: {
    //       text: (
    //         <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
    //       ),
    //       status: 'Success',
    //     },
    //     3: {
    //       text: (
    //         <FormattedMessage
    //           id="pages.searchTable.nameStatus.abnormal"
    //           defaultMessage="Abnormal"
    //         />
    //       ),
    //       status: 'Error',
    //     },
    //   },
    // },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="pages.searchTable.titleUpdatedAt"
    //       defaultMessage="Last scheduled time"
    //     />
    //   ),
    //   sorter: true,
    //   dataIndex: 'updatedAt',
    //   valueType: 'dateTime',
    //   renderFormItem: (item, { defaultRender, ...rest }, form) => {
    //     const status = form.getFieldValue('status');
    //     if (`${status}` === '0') {
    //       return false;
    //     }
    //     if (`${status}` === '3') {
    //       return <Input {...rest} placeholder={'Ttt'} />;
    //     }
    //     return defaultRender(item);
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <span
          key="action1"
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: `你确定要删除${record.name}该用户?`,
              onOk: async () => {
                const result = await handleRemove([record]);
                if (result && actionRef.current) {
                  const pageInfo = actionRef.current.pageInfo;
                  if (pageInfo) {
                    const { current, pageSize, total } = pageInfo;
                    if (current > 1 && total === (current - 1) * pageSize + 1) {
                      actionRef.current.setPageInfo?.({
                        current: current - 1,
                      });
                    }
                  }
                  actionRef.current.reload();
                }
              },
            });
          }}
          className={styles.action_item}
        >
          删除
        </span>,
        <span
          key="action2"
          className={styles.action_item}
          onClick={() => {
            setModalConfig({
              open: true,
              type: 'edit',
              title: '编辑用户',
              initialValues: record,
            });
          }}
        >
          编辑
        </span>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.CurrentUser, API.PageParams>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalConfig({
                type: 'add',
                title: '添加用户',
                open: true,
              });
            }}
          >
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        request={getUserList}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        autoComplete="off"
        title={modalConfig.type === 'edit' ? '编辑用户' : '添加用户'}
        width="400px"
        layout="horizontal"
        labelCol={{ span: 5 }}
        open={modalConfig.open}
        modalProps={{
          destroyOnClose: true,
        }}
        onOpenChange={(open) => {
          if (!open)
            setModalConfig({
              open,
              type: 'add',
              title: '添加用户',
            });
        }}
        onFinish={async (value) => {
          const methods = modalConfig.type === 'add' ? handleAdd : handleUpdate;
          const success = await methods({
            ...value,
            ...(modalConfig.type === 'edit' ? { _id: modalConfig.initialValues?._id } : {}),
          } as API.CurrentUser);
          if (success) {
            setModalConfig({
              open: false,
              type: 'add',
              title: '添加用户',
            });
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        initialValues={modalConfig.initialValues ?? {}}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
          width="md"
          name="username"
          label="用户名"
          fieldProps={{
            maxLength: 20,
          }}
        />
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '请输入米密码',
            },
          ]}
          width="md"
          name="password"
          label="密码"
          fieldProps={{
            maxLength: 20,
            autoComplete: 'new-password',
          }}
        />

        <ProFormText
          width="md"
          name="name"
          label="姓名"
          fieldProps={{
            maxLength: 20,
          }}
        />
      </ModalForm>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.CurrentUser>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.CurrentUser>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
