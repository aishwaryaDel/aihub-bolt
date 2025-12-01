export interface UseCase {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  benefits: string;
  department: string;
  status: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUseCaseDTO {
  title: string;
  short_description: string;
  full_description: string;
  benefits: string;
  department: string;
  status: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
}

export interface UpdateUseCaseDTO {
  title?: string;
  short_description?: string;
  full_description?: string;
  benefits?: string;
  department?: string;
  status?: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
}
