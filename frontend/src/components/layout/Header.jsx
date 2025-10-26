import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex
      as="header"
      role="banner"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8 }}
      py={3}
      bg={bg}
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <HStack spacing={3} align="center">
        <IconButton
          aria-label="Abrir navegação"
          display={{ base: 'inline-flex', md: 'none' }}
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <Heading as="h1" size="md" color="brand.600">
          MyClosetB
        </Heading>
      </HStack>

      <HStack spacing={2} align="center">
        <Button as={RouterLink} to="/wardrobe/new" variant="solid">
          Adicionar peça
        </Button>
        <IconButton
          aria-label="Alternar modo de cor"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
        />
        <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onOpen={() => setMenuOpen(true)}>
          <MenuButton as={Button} variant="ghost" onClick={() => setMenuOpen((open) => !open)}>
            <HStack>
              <Avatar size="sm" name="Usuária MyCloset" />
              <Box as="span" display={{ base: 'none', md: 'inline' }}>
                Usuária
              </Box>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={RouterLink} to="/dashboard">
              Dashboard
            </MenuItem>
            <MenuItem as={RouterLink} to="/looks/new">
              Criar look
            </MenuItem>
            <MenuItem>Sair</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}

export default Header;
