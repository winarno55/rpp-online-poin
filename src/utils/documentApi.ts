import { fetchWithRetry } from './fetchWithRetry';

export interface SavedDocument {
  _id: string;
  title: string;
  type: 'modul' | 'bundle';
  data: any;
  createdAt: string;
  updatedAt: string;
}

export const saveDocument = async (title: string, type: 'modul' | 'bundle', data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, type, data })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to save document');
    return json.data;
};

export const getDocuments = async (): Promise<SavedDocument[]> => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/documents', {
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to get documents');
    return json.data;
};

export const getDocumentById = async (id: string): Promise<SavedDocument> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/documents?id=${id}`, {
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to get document');
    return json.data;
};

export const updateDocument = async (id: string, title: string, data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/documents?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, data })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update document');
    return json.data;
};

export const deleteDocument = async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete document');
    return json.message;
};
