import { useState } from 'react'
import { Container, Typography, Box, Pagination, AppBar, Toolbar, Grid, Button, Dialog, DialogTitle, DialogContent, Alert, DialogActions } from '@mui/material'
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
import { createPet, CreatePetRequest, updatePet, deletePet, getPetById, PetSummary } from '../api/petsApi'

export default function CataloguePage() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [editingPet, setEditingPet] = useState<PetSummary | null>(null)
  const [editingPetData, setEditingPetData] = useState<CreatePetRequest | null>(null)
  const [isFetchingPetDetails, setIsFetchingPetDetails] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [petToDelete, setPetToDelete] = useState<string | null>(null)

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

  // Mutation for updating a pet
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePetRequest }) => updatePet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      setDialogOpen(false)
      setEditingPet(null)
      setSubmitError(null)
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update animal')
    },
  })

  // Mutation for deleting a pet
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      setDeleteConfirmOpen(false)
      setPetToDelete(null)
    },
  })

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(value - 1))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddAnimal = () => {
    setDialogMode('add')
    setEditingPet(null)
    setEditingPetData(null)
    setSubmitError(null)
    setDialogOpen(true)
  }

  const handleEditPet = async (pet: PetSummary) => {
    setDialogMode('edit')
    setEditingPet(pet)
    setSubmitError(null)
    setIsFetchingPetDetails(true)

    try {
      const petDetail = await getPetById(pet.id)
      setEditingPetData({
        name: petDetail.name,
        category: petDetail.category,
        breed: petDetail.breed,
        ageMonths: petDetail.ageMonths,
        description: petDetail.description,
        price: petDetail.price,
        available: petDetail.available,
        photos: petDetail.photos.map((photo) => ({ url: photo.url, isPrimary: photo.isPrimary })),
      })
      setDialogOpen(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to load pet details')
    } finally {
      setIsFetchingPetDetails(false)
    }
  }

  const handleDeletePet = (petId: string) => {
    setPetToDelete(petId)
    setDeleteConfirmOpen(true)
  }

  const handleSubmitForm = async (formData: CreatePetRequest) => {
    if (dialogMode === 'add') {
      await createMutation.mutateAsync(formData)
    } else if (editingPet) {
      await updateMutation.mutateAsync({ id: editingPet.id, data: formData })
    }
  }

  const confirmDelete = async () => {
    if (petToDelete) {
      await deleteMutation.mutateAsync(petToDelete)
    }
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
        <Toolbar sx={{ minHeight: 72 }}>
          <Typography variant="h6" className="font-bold tracking-wide" sx={{ flexGrow: 1 }}>
            🐾 Petstore
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAddAnimal}
            sx={{ mr: 2, boxShadow: 'none' }}
          >
            Add Animal
          </Button>
          <CartButton />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className="py-8 page-shell">
        <Box className="flex flex-col gap-6">
          <Box className="hero-banner">
            <Box className="hero-banner-inner">
              <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: '0.18em' }}>
                Pet Adoption Marketplace
              </Typography>
              <Typography variant="h3" component="h1" className="hero-heading font-bold mt-4">
                Find Your Perfect Pet
              </Typography>
              <Typography variant="body1" color="text.secondary" className="hero-subtitle mt-3">
                Browse friendly dogs, cats, birds, and fish with updated care details, easy checkout, and secure adoption support.
              </Typography>
            </Box>
          </Box>

          <CategoryFilter />

          {isLoading && (
            <Grid container spacing={3}>
              {Array.from({ length: 12 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <PetCardSkeleton />
                </Grid>
              ))}
            </Grid>
          )}
          {isError && (
            <ErrorState
              message={(error as Error)?.message ?? 'Failed to load pets.'}
              onRetry={() => refetch()}
            />
          )}
          {!isLoading && !isError && data && data.content.length === 0 && (
            <EmptyState categories={categories} />
          )}
          {!isLoading && !isError && data && data.content.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary">
                Showing {data.content.length} of {data.totalElements} pets
              </Typography>
              <PetGrid pets={data.content} onEdit={handleEditPet} onDelete={handleDeletePet} showAdminActions={true} />
              {data.totalPages > 1 && (
                <Box className="flex justify-center mt-4">
                  <Pagination
                    count={data.totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

      {/* Add/Edit Animal Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Animal' : 'Edit Animal'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          <PetForm
            initialData={dialogMode === 'edit' ? editingPetData ?? undefined : undefined}
            onSubmit={handleSubmitForm}
            isLoading={dialogMode === 'add' ? createMutation.isPending : updateMutation.isPending || isFetchingPetDetails}
            submitButtonText={dialogMode === 'add' ? 'Add Animal' : 'Save Changes'}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this animal? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
