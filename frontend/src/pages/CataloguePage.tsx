import { useState } from 'react'
import { Container, Typography, Box, Pagination, AppBar, Toolbar, Grid, Button, Dialog, DialogTitle, DialogContent, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePets } from '../hooks/usePets'
import PetGrid from '../components/PetGrid'
import PetCardSkeleton from '../components/PetCardSkeleton'
import CategoryFilter, { VALID_CATEGORIES } from '../components/CategoryFilter'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import CartButton from '../components/CartButton'
import PetForm from '../components/PetForm'
import { createPet, CreatePetRequest } from '../api/petsApi'

export default function CataloguePage() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Sanitize: strip any category values that aren't valid
  const rawCategories = searchParams.getAll('category')
  const categories = rawCategories.filter((c) => VALID_CATEGORIES.includes(c))

  const page = parseInt(searchParams.get('page') ?? '0', 10)

  const { data, isLoading, isError, error, refetch } = usePets(categories, page)

  // Mutation for creating a pet
  const createMutation = useMutation({
    mutationFn: (data: CreatePetRequest) => createPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      setDialogOpen(false)
      setSubmitError(null)
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add animal')
    },
  })

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(value - 1))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddAnimal = async (formData: CreatePetRequest) => {
    await createMutation.mutateAsync(formData)
  }

  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" className="font-bold tracking-wide" sx={{ flexGrow: 1 }}>
            🐾 Petstore
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => {
              setSubmitError(null)
              setDialogOpen(true)
            }}
            sx={{ mr: 2 }}
          >
            Add Animal
          </Button>
          <CartButton />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className="py-8">
        <Box className="flex flex-col gap-6">
          <Box>
            <Typography variant="h4" component="h1" className="font-bold mb-1">
              Find Your Perfect Pet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse our selection of dogs, cats, birds, and fish.
            </Typography>
          </Box>

          <CategoryFilter />

          {isLoading && (
            <Grid container spacing={3}>
              {Array.from({ length: 12 }).map((_, i) => (
         