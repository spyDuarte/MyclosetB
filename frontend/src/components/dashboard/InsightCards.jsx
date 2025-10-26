import {
  Box,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function InsightCards({ data }) {
  const cardBg = useColorModeValue('white', 'gray.800');

  const insights = [
    {
      label: 'Peças no guarda-roupa',
      value: data?.totals?.items ?? 0,
      helper: `${data?.totals?.clean ?? 0} limpas / ${data?.totals?.laundry ?? 0} na lavanderia`
    },
    {
      label: 'Looks criados este mês',
      value: data?.totals?.looksCreated ?? 0,
      helper: `${data?.totals?.looksShared ?? 0} compartilhados`
    },
    {
      label: 'Sugestão para hoje',
      value: data?.suggestions?.today?.title ?? 'Sem eventos',
      helper: data?.suggestions?.today?.description ?? 'Adicione uma ocasião para receber ideias.'
    },
    {
      label: 'Alertas de lavagem',
      value: data?.alerts?.laundry ?? 0,
      helper: 'Itens próximos do limite de uso antes da lavagem'
    }
  ];

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
      {insights.map((insight) => (
        <GridItem key={insight.label}>
          <Box
            role="group"
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            bg={cardBg}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
          >
            <Stat>
              <StatLabel>{insight.label}</StatLabel>
              <StatNumber>{insight.value}</StatNumber>
              <StatHelpText>{insight.helper}</StatHelpText>
            </Stat>
          </Box>
        </GridItem>
      ))}
      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Box borderWidth="1px" borderRadius="lg" p={6} bg={cardBg}>
          <Heading as="h3" size="md" mb={2}>
            Sugestões com base no clima
          </Heading>
          <Text>
            {data?.suggestions?.weather?.summary ?? 'Habilite a integração meteorológica para receber recomendações.'}
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}

InsightCards.propTypes = {
  data: PropTypes.shape({
    totals: PropTypes.shape({
      items: PropTypes.number,
      clean: PropTypes.number,
      laundry: PropTypes.number,
      looksCreated: PropTypes.number,
      looksShared: PropTypes.number
    }),
    suggestions: PropTypes.shape({
      today: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string
      }),
      weather: PropTypes.shape({
        summary: PropTypes.string
      })
    }),
    alerts: PropTypes.shape({
      laundry: PropTypes.number
    }),
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string,
        date: PropTypes.string,
        suggestedLook: PropTypes.string
      })
    )
  })
};

export default InsightCards;
