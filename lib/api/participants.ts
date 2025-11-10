import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import {
  participantSchema,
  createParticipantSchema,
  updateParticipantSchema,
  type Participant,
  type CreateParticipantRequest,
  type UpdateParticipantRequest,
} from '@/lib/schemas/participant';

/**
 * Get all meal plan participants
 * TODO: Add query parameter for filtering by meal_plan_id
 */
export const getParticipants = async (meal_plan_id?: number): Promise<Participant[]> => {
  const params = meal_plan_id ? { meal_plan_id } : undefined;
  const response = await apiClient.get<Participant[]>(API_ENDPOINTS.PARTICIPANTS.LIST, { params });
  return response.data.map((participant) => participantSchema.parse(participant));
};

/**
 * Get participant by ID
 */
export const getParticipant = async (id: number): Promise<Participant> => {
  const response = await apiClient.get<Participant>(API_ENDPOINTS.PARTICIPANTS.GET(id));
  return participantSchema.parse(response.data);
};

/**
 * Create a new participant
 */
export const createParticipant = async (data: CreateParticipantRequest): Promise<Participant> => {
  const validatedData = createParticipantSchema.parse(data);
  const response = await apiClient.post<Participant>(API_ENDPOINTS.PARTICIPANTS.CREATE, validatedData);
  return participantSchema.parse(response.data);
};

/**
 * Update participant
 */
export const updateParticipant = async (id: number, data: UpdateParticipantRequest): Promise<Participant> => {
  const validatedData = updateParticipantSchema.parse(data);
  const response = await apiClient.patch<Participant>(API_ENDPOINTS.PARTICIPANTS.UPDATE(id), validatedData);
  return participantSchema.parse(response.data);
};

/**
 * Delete participant
 */
export const deleteParticipant = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.PARTICIPANTS.DELETE(id));
};
