import {
  Box,
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { CalendarIcon } from '@chakra-ui/icons';
import { MdDashboard, MdStyle, MdCheckroom, MdSettings } from 'react-icons/md';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: MdDashboard },
  { label: 'Guarda-roupa', to: '/wardrobe/new', icon: MdCheckroom },
  { label: 'Criar look', to: '/looks/new', icon: MdStyle },
  { label: 'Eventos', to: '/calendar', icon: CalendarIcon },
  { label: 'Configurações', to: '/settings', icon: MdSettings }
];

function Sidebar() {
  const bg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const activeColor = useColorModeValue('brand.700', 'brand.200');

  return (
    <Box
      as="nav"
      aria-label="Navegação principal"
      role="navigation"
      display={{ base: 'none', md: 'block' }}
      w={{ base: 'full', md: 64 }}
      bg={bg}
      borderRightWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Flex direction="column" h="full" py={6} px={4} gap={6}>
        <Text fontSize="sm" textTransform="uppercase" color="gray.500">
          Menu
        </Text>
        <VStack spacing={2} align="stretch">
          {links.map((link) => (
            <Link
              key={link.to}
              as={NavLink}
              to={link.to}
              end={link.to === '/dashboard'}
              px={4}
              py={3}
              borderRadius="lg"
              display="flex"
              alignItems="center"
              gap={3}
              _hover={{ textDecoration: 'none', bg: activeBg }}
              style={({ isActive }) => ({
                background: isActive ? activeBg : 'transparent',
                color: isActive ? activeColor : undefined
              })}
            >
              <Icon as={link.icon} boxSize={5} />
              <Text fontWeight="medium">{link.label}</Text>
            </Link>
          ))}
        </VStack>
      </Flex>
    </Box>
  );
}

export default Sidebar;
