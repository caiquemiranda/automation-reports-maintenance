// src/components/Layout.jsx
import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const PageContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 20px;
`;

const Layout = ({ children }) => {
  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </PageContainer>
  );
};

export default Layout;
