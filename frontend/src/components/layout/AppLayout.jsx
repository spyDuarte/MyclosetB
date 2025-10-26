import { Flex, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

function AppLayout({ children }) {
  const bg = useColorModeValue('white', 'gray.900');

  return (
    <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <Sidebar />
      <Flex direction="column" flex="1">
        <Header />
        <Flex as="section" flex="1" bg={bg} role="presentation">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppLayout;
