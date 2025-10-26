import { useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Select,
  Stack,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, RepeatIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { createLook } from '../api/client.js';
import { useItems } from '../api/hooks.js';
import LookCanvas from '../components/look-builder/LookCanvas.jsx';

const steps = ['Selecionar peças', 'Organizar camadas', 'Revisar e salvar'];

function LookBuilder() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [notes, setNotes] = useState('');
  const [occasion, setOccasion] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const { data: items, loading } = useItems();

  const availableItems = useMemo(() => items, [items]);

  const toggleItem = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const handleReorder = (fromIndex, toIndex) => {
    setSelectedIds((current) => {
      const reordered = [...current];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      return reordered;
    });
  };

  const handleRemove = (id) => {
    setSelectedIds((current) => current.filter((value) => value !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await createLook({ itemIds: selectedIds, notes, occasion });
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  const prevStep = () => setActiveStep((step) => Math.max(step - 1, 0));

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="lg">
        Criar novo look
      </Heading>
      <Text color="gray.600">{steps[activeStep]}</Text>

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertDescription>Não foi possível salvar o look. Tente novamente.</AlertDescription>
        </Alert>
      )}

      <Stack spacing={6} direction={{ base: 'column', xl: 'row' }} align="flex-start">
        <Box flex="2" borderWidth="1px" borderRadius="lg" p={4} bg="white">
          <Heading as="h3" size="md" mb={4}>
            Guarda-roupa
          </Heading>
          {loading ? (
            <Text>Carregando peças disponíveis...</Text>
          ) : (
            <Flex gap={3} flexWrap="wrap" aria-live="polite">
              {availableItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <Button
                    key={item.id}
                    variant={isSelected ? 'solid' : 'outline'}
                    colorScheme={isSelected ? 'brand' : 'gray'}
                    onClick={() => toggleItem(item.id)}
                    aria-pressed={isSelected}
                  >
                    {item.name}
                  </Button>
                );
              })}
              {!availableItems.length && <Text>Nenhuma peça cadastrada ainda.</Text>}
            </Flex>
          )}
        </Box>

        <Box flex="3" borderWidth="1px" borderRadius="lg" p={4} bg="white" role="region" aria-live="polite">
          <Heading as="h3" size="md" mb={4}>
            Montagem do look
          </Heading>
          <LookCanvas
            selectedItems={availableItems.filter((item) => selectedIds.includes(item.id))}
            onReorder={handleReorder}
            onRemove={handleRemove}
          />
        </Box>
      </Stack>

      <Divider />

      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} align="flex-start">
        <FormControl maxW={{ base: 'full', md: '300px' }}>
          <FormLabel htmlFor="occasion">Ocasião</FormLabel>
          <Select id="occasion" placeholder="Selecione" value={occasion} onChange={(event) => setOccasion(event.target.value)}>
            <option value="trabalho">Trabalho</option>
            <option value="casual">Casual</option>
            <option value="evento">Evento especial</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="notes">Notas</FormLabel>
          <Textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Adicione observações sobre o look..."
          />
        </FormControl>
      </Stack>

      <Flex justify="space-between" flexWrap="wrap" gap={3}>
        <Button variant="ghost" leftIcon={<RepeatIcon />} onClick={() => setSelectedIds([])}>
          Limpar seleção
        </Button>
        <Flex gap={3}>
          <IconButton
            aria-label="Passo anterior"
            icon={<ArrowLeftIcon />}
            onClick={prevStep}
            isDisabled={activeStep === 0}
            variant="outline"
          />
          <IconButton
            aria-label="Próximo passo"
            icon={<ArrowRightIcon />}
            onClick={nextStep}
            isDisabled={activeStep === steps.length - 1}
            variant="outline"
          />
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={isSubmitting} isDisabled={!selectedIds.length}>
            Salvar look
          </Button>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default LookBuilder;
