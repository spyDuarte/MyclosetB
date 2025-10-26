import { useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  VisuallyHiddenInput
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

const categories = {
  Tops: ['Camiseta', 'Blusa', 'Camisa'],
  Bottoms: ['Calça', 'Saia', 'Short'],
  Outerwear: ['Jaqueta', 'Casaco', 'Blazer']
};

const defaultValues = {
  name: '',
  category: '',
  subcategory: '',
  size: '',
  color: '',
  season: '',
  price: '',
  purchaseDate: '',
  care: '',
  tags: [],
  status: true,
  image: null
};

function ItemForm({ onSubmit, isSubmitting }) {
  const [values, setValues] = useState(defaultValues);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const subcategories = useMemo(() => categories[values.category] ?? [], [values.category]);

  const validate = () => {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Informe o nome da peça.';
    if (!values.category) nextErrors.category = 'Selecione uma categoria.';
    if (!values.subcategory) nextErrors.subcategory = 'Selecione uma subcategoria.';
    return nextErrors;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setValues((prev) => ({ ...prev, image: file }));
  };

  const handleAddTag = () => {
    if (tagInput && !values.tags.includes(tagInput)) {
      setValues((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setValues((prev) => ({ ...prev, tags: prev.tags.filter((value) => value !== tag) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      await onSubmit(values);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} noValidate>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={Boolean(errors.name)}>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input id="name" value={values.name} onChange={handleChange('name')} placeholder="Ex.: Camisa social" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.category)}>
            <FormLabel htmlFor="category">Categoria</FormLabel>
            <Select id="category" placeholder="Selecione" value={values.category} onChange={handleChange('category')}>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.category}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.subcategory)}>
            <FormLabel htmlFor="subcategory">Subcategoria</FormLabel>
            <Select
              id="subcategory"
              placeholder="Selecione"
              value={values.subcategory}
              onChange={handleChange('subcategory')}
              isDisabled={!values.category}
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.subcategory}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="size">Tamanho</FormLabel>
            <Input id="size" value={values.size} onChange={handleChange('size')} placeholder="P, M, G..." />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="color">Cor</FormLabel>
            <Input id="color" value={values.color} onChange={handleChange('color')} placeholder="Azul marinho" />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="season">Temporada</FormLabel>
            <Input id="season" value={values.season} onChange={handleChange('season')} placeholder="Outono/Inverno" />
          </FormControl>
        </Stack>

        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="price">Preço</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <Icon as={AddIcon} transform="rotate(45deg)" />
              </InputLeftElement>
              <Input id="price" type="number" value={values.price} onChange={handleChange('price')} placeholder="0,00" />
            </InputGroup>
            <FormHelperText>Informe o valor pago na peça.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="purchaseDate">Data de compra</FormLabel>
            <Input id="purchaseDate" type="date" value={values.purchaseDate} onChange={handleChange('purchaseDate')} />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="care">Cuidados</FormLabel>
            <Textarea
              id="care"
              value={values.care}
              onChange={handleChange('care')}
              placeholder="Lavar à mão, passar em temperatura média..."
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="tags">Tags</FormLabel>
            <HStack>
              <Input
                id="tags"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                placeholder="Ex.: trabalho, casual"
              />
              <Button onClick={handleAddTag} aria-label="Adicionar tag">
                Adicionar
              </Button>
            </HStack>
            <HStack spacing={2} mt={2} flexWrap="wrap">
              {values.tags.map((tag) => (
                <Tag key={tag} size="md" borderRadius="full" variant="solid" colorScheme="brand">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="status" mb="0">
              Peça está limpa?
            </FormLabel>
            <Switch id="status" isChecked={values.status} onChange={handleChange('status')} colorScheme="brand" />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="image-upload">Foto da peça</FormLabel>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" leftIcon={<AddIcon />}>
              Fazer upload
            </Button>
            <VisuallyHiddenInput
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {values.image && <FormHelperText>Arquivo selecionado: {values.image.name}</FormHelperText>}
          </FormControl>
        </Stack>
      </Grid>

      <HStack justify="flex-end" mt={8} spacing={4}>
        <Button type="reset" variant="ghost" onClick={() => setValues(defaultValues)}>
          Limpar
        </Button>
        <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
          Salvar peça
        </Button>
      </HStack>
    </Box>
  );
}

ItemForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

ItemForm.defaultProps = {
  isSubmitting: false
};

export default ItemForm;
