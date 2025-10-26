import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  VStack
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

function LookCanvas({ selectedItems, onReorder, onRemove }) {
  const handleMove = (index, direction) => {
    if (!onReorder) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedItems.length) return;
    onReorder(index, targetIndex);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h4" size="sm" color="gray.600">
        Ordem das camadas
      </Heading>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
        {selectedItems.map((item, index) => (
          <GridItem key={item.id} borderWidth="1px" borderRadius="lg" p={3} role="group">
            <VStack spacing={2} align="stretch">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} objectFit="cover" borderRadius="md" />
              ) : (
                <Box
                  bg="gray.100"
                  borderRadius="md"
                  minH="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  color="gray.500"
                >
                  {item.name}
                </Box>
              )}
              <Text fontWeight="medium">{item.name}</Text>
              <HStack justify="flex-end" spacing={1}>
                <IconButton
                  aria-label={`Mover ${item.name} para cima`}
                  icon={<ArrowUpIcon />}
                  onClick={() => handleMove(index, -1)}
                  size="sm"
                  variant="ghost"
                  isDisabled={!onReorder || index === 0}
                />
                <IconButton
                  aria-label={`Mover ${item.name} para baixo`}
                  icon={<ArrowDownIcon />}
                  onClick={() => handleMove(index, 1)}
                  size="sm"
                  variant="ghost"
                  isDisabled={!onReorder || index === selectedItems.length - 1}
                />
                <IconButton
                  aria-label={`Remover ${item.name}`}
                  icon={<CloseIcon />}
                  onClick={() => onRemove?.(item.id)}
                  size="sm"
                  variant="ghost"
                />
              </HStack>
            </VStack>
          </GridItem>
        ))}
        {!selectedItems.length && (
          <GridItem colSpan={{ base: 2, md: 3 }}>
            <Box textAlign="center" color="gray.500">
              Selecione peças para começar a montar seu look.
            </Box>
          </GridItem>
        )}
      </Grid>
    </VStack>
  );
}

LookCanvas.propTypes = {
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string
    })
  ).isRequired,
  onReorder: PropTypes.func,
  onRemove: PropTypes.func
};

LookCanvas.defaultProps = {
  onReorder: undefined,
  onRemove: undefined
};

export default LookCanvas;
