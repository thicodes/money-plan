import React from 'react';
import { Box } from 'rebass';
import { Content, Table, Card } from '../ui';

function Dashboard() {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridGap: 2,
          gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
        }}
      >
        <Card>
          
        </Card>

        <Card>Teste</Card>

        <Card>Teste</Card>

        <Card>Teste</Card>
      </Box>
    </>
  );
}

export default Dashboard;
