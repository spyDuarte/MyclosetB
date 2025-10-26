import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  VStack
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ItemForm from '../components/wardrobe/ItemForm.jsx';
import { createItem } from '../api/client.js';

function WardrobeForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) {
    setSubmitting(true);
    setError(null);
    try {
      await createItem(values);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/dashboard">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink as={RouterLink} to="/wardrobe/new">
            Nova peça
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box>
        <Heading as="h2" size="lg" mb={2}>
          Cadastre uma nova peça
        </Heading>
        <Button variant="link" colorScheme="brand" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertDescription>
            Houve um erro ao salvar a peça. Verifique os campos e tente novamente.
          </AlertDescription>
        </Alert>
      )}

      <ItemForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </VStack>
  );
}

export default WardrobeForm;
