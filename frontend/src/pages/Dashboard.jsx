import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import InsightCards from '../components/dashboard/InsightCards.jsx';
import { useDashboardData } from '../api/hooks.js';

function Dashboard() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <VStack spacing={4} align="center" justify="center" minH="60vh">
        <Spinner size="lg" />
        <Text>Carregando insights do guarda-roupa...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <AlertDescription>
          Não foi possível carregar o dashboard. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          Olá, bem-vinda de volta!
        </Heading>
        <Text color="gray.600">
          Visualize suas estatísticas e recomendações personalizadas do MyClosetB.
        </Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem>
          <InsightCards data={data} />
        </GridItem>
        <GridItem>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            bg="white"
            aria-live="polite"
            role="region"
            minH="220px"
          >
            <Heading as="h3" size="md" mb={4}>
              Próximos eventos
            </Heading>
            {data?.events?.length ? (
              <VStack align="stretch" spacing={3}>
                {data.events.map((event) => (
                  <Box
                    key={event.id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    aria-label={`Evento ${event.title} em ${event.date}`}
                  >
                    <Text fontWeight="semibold">{event.title}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                    <Text fontSize="sm">Sugestão: {event.suggestedLook}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>Nenhum evento nos próximos dias.</Text>
            )}
          </Box>
        </GridItem>
      </Grid>
    </VStack>
  );
}

export default Dashboard;
