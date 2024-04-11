import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Breadcrumb } from 'antd';

const BreadcrumbComponent: React.FC<{ currentPage: string }> = ({ currentPage }) => (
    <Breadcrumb style={{ fontSize: '15px', padding: '10px 0px 10px 0px'}}>
      <Breadcrumb.Item href="/">
        <HomeOutlined style={{ fontSize: '18px', color: '#49bce2',fontWeight:'500' }} />
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <i>{currentPage}</i>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
  

export default BreadcrumbComponent;