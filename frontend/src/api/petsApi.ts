import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface PetSummary {
  id: string
  name: string
  category: 'DOG' | 'CAT' | 'BIRD' | 'FISH'
  breed: string
  ageMonths: number
  price: number | null
  available: boolean
  primaryPhotoUrl: string
}

export interface Photo {
  url: string
  isPrimary: boolean
}

export interface PhotoRequest {
  url: string
  isPrimary: boolean
}

export interface PetDetail extends PetSummary {
  description: string
  photos: Photo[]
}

export interface CreatePetRequest {
  name: string
  category: 'DOG' | 'CAT' | 'BIRD' | 'FISH'
  breed: string
  ageMonths: number
  description: string
  price: number | string | null
  available: boolean
  photos: PhotoRequest[]
}

export interface PetPage {
  content: PetSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export async function getPets(
  categories: string[] = [],
  page = 0,
  size = 12
): Promise<PetPage> {
  const params = new URLSearchParams()
  categories.forEach((c) => params.append('category', c))
  params.set('page', String(page))
  params.set('size', String(size))
  const { data } = await axios.get<PetPage>(`${BASE_URL}/api/pets?${params}`)
  return data
}

export async function getPetById(id: string): Promise<PetDetail> {
  const { data } = await axios.get<PetDetail>(`${BASE_URL}/api/pets/${id}`)
  return data
}

export async function createPet(pet: CreatePetRequest): Promise<PetDetail> {
  const { data } = await axios.post<PetDetail>(`${BASE_URL}/api/pets`, pet)
  return data
}

export async function updatePet(id: string, pet: CreatePetRequest): Promise<PetDetail> {
  const { data } = await axios.put<PetDetail>(`${BASE_URL}/api/pets/${id}`, pet)
  return data
}

export async function deletePet(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/api/pets/${id}`)
}
