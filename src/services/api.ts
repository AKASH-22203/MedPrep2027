
const API_BASE_URL = "http://localhost:5000/api";

export interface DriveFile {
  id: string;
  name: string;
  size: string | null;
  webViewLink: string | null;
}

export interface PYQYear {
  id: string;
  name: string;
}

export interface DriveSubject {
  id: string;
  name: string;
}

interface PYQYearsResponse {
  success: boolean;
  years: PYQYear[];
}

interface PYQFilesResponse {
  success: boolean;
  files: DriveFile[];
}

interface SubjectsResponse {
  success: boolean;
  subjects: DriveSubject[];
}

interface SubjectFilesResponse {
  success: boolean;
  files: DriveFile[];
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// PYQ APIs
export async function getPYQYears(): Promise<PYQYear[]> {
  const data = await fetchAPI<PYQYearsResponse>("/resources/pyqs");
  return data.years;
}

export async function getPYQFiles(yearId: string): Promise<DriveFile[]> {
  const data = await fetchAPI<PYQFilesResponse>(
    `/resources/pyqs/${encodeURIComponent(yearId)}`
  );

  return data.files;
}

// Subject-wise APIs
export async function getSubjects(): Promise<DriveSubject[]> {
  const data = await fetchAPI<SubjectsResponse>("/resources/subjects");
  return data.subjects;
}

export async function getSubjectFiles(
  subjectId: string
): Promise<DriveFile[]> {
  const data = await fetchAPI<SubjectFilesResponse>(
    `/resources/subjects/${encodeURIComponent(subjectId)}`
  );

  return data.files;
}

// PDF APIs
export function getPDFViewUrl(fileId: string): string {
  return `${API_BASE_URL}/files/${encodeURIComponent(fileId)}`;
}

export function getPDFDownloadUrl(fileId: string): string {
  return `${API_BASE_URL}/files/${encodeURIComponent(fileId)}?download=true`;
}


interface NotesResponse {
  success: boolean;
  files: DriveFile[];
}

export async function getNotesFiles(): Promise<DriveFile[]> {
  const data = await fetchAPI<NotesResponse>("/resources/notes");
  return data.files;
}
