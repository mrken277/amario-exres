import React from 'react';
import { StyledCard } from '../styles';

const PdfDataItem = ({
  children,
  title,

  bordered
}) => (
  <StyledCard title={title} bordered={bordered}>
    {children}
  </StyledCard>
);

export default PdfDataItem;
