import { Card, CardMedia, CardContent, Typography, Chip, Button, IconButton, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { PetSummary } from '../api/petsApi'
import { useCart } from '../context/CartContext'

interface PetCardProps {
  pet: PetSummary
  onEdit?: (pet: PetSummary) => void
  onDelete?: (petId: string) => void
  showAdminActions?: boolean
}

const PLACEHOLDER = '/placeholder-pet.svg'

const categoryColors: Record<string, 'primary' | 'secondary' | 'success' | 'info'> = {
  DOG: 'primary',
  CAT: 'secondary',
  BIRD: 'success',
  FISH: 'info',
}

const categoryEmoji: Record<string, string> = {
  DOG: '🐶',
  CAT: '🐱',
  BIRD: '🐦',
  FISH: '🐟',
}

export default function PetCard({ pet, onEdit, onDelete, showAdminActions = false }: PetCardProps) {
  const navigate = useNavigate()
  const { addItem } = useCart()

  return (
    <Card
      className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => navigate(`/pets/${pet.id}`)}
      role="article"
      aria-label={pet.name}
    >
      <CardMedia
        component="img"
        height="200"
        image={pet.primaryPhotoUrl ?? PLACEHOLDER}
        alt={pet.name}
        className="object-cover h-48"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
      />
      <CardContent className="flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between">
          <Typography variant="h6" component="h2" className="font-semibold">
            {pet.name}
          </Typography>
          <Chip
            label={`${categoryEmoji[pet.category]} ${pet.category}`}
            color={categoryColors[pet.category] ?? 'default'}
            size="small"
          />
        </div>
        <Typography variant="body2" color="text.secondary">
          {pet.breed} · {pet.ageMonths < 12
            ? `${pet.ageMonths}mo`
            : `${Math.floor(pet.ageMonths / 12)}yr ${pet.ageMonths % 12}mo`}
        </Typography>
        <div className="flex items-center justify-between mt-auto pt-2">
          {pet.price != null && pet.price > 0 ? (
            <Typography variant="subtitle1" className="font-bold text-green-700">
              ₱{pet.price.toFixed(2)}
            </Typography>
          ) : (
            <Typography variant="subtitle2" color="text.secondary">Contact us</Typography>
          )}
          <Box className="flex gap-1">
            {showAdminActions && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(pet)
                  }}
                  aria-label={`Edit ${pet.name}`}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(pet.id)
                  }}
                  aria-label={`Delete ${pet.name}`}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
            {!showAdminActions && (
              <Button
                variant="contained"
                size="small"
                disabled={!pet.available}
                onClick={(e) => { e.stopPropagation(); addItem(pet) }}
                aria-label={pet.available ? `Add ${pet.name} to cart` : `${pet.name} unavailable`}
              >
                {pet.available ? 'Add to Cart' : 'Unavailable'}
              </Button>
            )}
          </Box>
        </div>
      </CardContent>
    </Card>
  )
}
