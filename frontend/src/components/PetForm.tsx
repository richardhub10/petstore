import { useEffect, useState } from 'react'
import { CreatePetRequest } from '../api/petsApi'
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

interface PetFormProps {
  initialData?: CreatePetRequest
  onSubmit: (data: CreatePetRequest) => Promise<void>
  isLoading?: boolean
  submitButtonText?: string
}

export default function PetForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Add Pet',
}: PetFormProps) {
  const [formData, setFormData] = useState<CreatePetRequest>({
    name: '',
    category: 'DOG',
    breed: '',
    ageMonths: 0,
    description: '',
    price: null,
    available: true,
    photos: [],
  })

  const [photoUrl, setPhotoUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      available: e.target.checked,
    }))
  }

  const addPhoto = () => {
    if (!photoUrl.trim()) {
      setError('Photo URL cannot be empty')
      return
    }
    setError(null)
    const isPrimary = formData.photos.length === 0 // First photo is primary
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, { url: photoUrl.trim(), isPrimary }],
    }))
    setPhotoUrl('')
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => {
      const newPhotos = prev.photos.filter((_, i) => i !== index)
      // Ensure first photo is always primary
      if (newPhotos.length > 0) {
        newPhotos[0].isPrimary = true
      }
      return { ...prev, photos: newPhotos }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Pet name is required')
      return
    }
    if (!formData.breed.trim()) {
      setError('Breed is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pet')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Stack spacing={3}>
        {/* Basic Info */}
        <TextField
          label="Pet Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleSelectChange}
              label="Category"
            >
              <MenuItem value="DOG">🐶 Dog</MenuItem>
              <MenuItem value="CAT">🐱 Cat</MenuItem>
              <MenuItem value="BIRD">🐦 Bird</MenuItem>
              <MenuItem value="FISH">🐟 Fish</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Breed" name="breed" value={formData.breed} onChange={handleChange} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Age (months)"
            name="ageMonths"
            type="number"
            value={formData.ageMonths}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price || ''}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: 0 }}
          />
        </Box>

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <FormControlLabel
          control={<Switch checked={formData.available} onChange={handleSwitchChange} />}
          label="Available"
        />

        {/* Photos */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Photos
          </Typography>

          {formData.photos.length > 0 && (
            <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
              {formData.photos.map((photo, idx) => (
                <Card key={idx} sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {photo.url}
                      </Typography>
                      {photo.isPrimary && (
                        <Typography variant="caption" sx={{ color: 'success.main' }}>
                          ⭐ Primary
                        </Typography>
                      )}
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removePhoto(idx)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addPhoto()
                }
              }}
              placeholder="https://example.com/photo.jpg"
              fullWidth
            />
            <Button variant="contained" onClick={addPhoto} startIcon={<AddIcon />}>
              Add
            </Button>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Typography sx={{ color: 'error.main', p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
            {error}
          </Typography>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : submitButtonText}
        </Button>
      </Stack>
    </Box>
  )
}
