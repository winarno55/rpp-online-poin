import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './_lib/db.js';
import SavedDocument from './_lib/models/SavedDocument.js';
import { protect } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await dbConnect();
        
        let authFailed = false;
        await new Promise<void>((resolve) => {
            protect(req as any, res, () => {
                resolve();
            }).catch(() => {
                authFailed = true;
                resolve();
            });
        });
        
        if (res.headersSent || authFailed) return;
        
        const user = (req as any).user;

        if (req.method === 'GET') {
            const { id } = req.query;
            
            if (id) {
                const document = await SavedDocument.findOne({ _id: id, userId: user._id });
                if (!document) {
                    return res.status(404).json({ success: false, message: 'Document not found' });
                }
                return res.status(200).json({ success: true, data: document });
            } else {
                const documents = await SavedDocument.find({ userId: user._id }).sort({ createdAt: -1 });
                return res.status(200).json({ success: true, data: documents });
            }
        } else if (req.method === 'POST') {
            const { title, type, data } = req.body;
            
            if (!title || !type || !data) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
            
            const newDocument = await SavedDocument.create({
                userId: user._id,
                title,
                type,
                data
            });
            
            return res.status(201).json({ success: true, data: newDocument });
        } else if (req.method === 'PUT') {
             const { id } = req.query;
             const { title, data } = req.body;
             if (!id) {
                 return res.status(400).json({ success: false, message: 'Document ID required' });
             }
             const updated = await SavedDocument.findOneAndUpdate(
                 { _id: id, userId: user._id },
                 { title, data },
                 { new: true }
             );
             if (!updated) {
                 return res.status(404).json({ success: false, message: 'Document not found' });
             }
             return res.status(200).json({ success: true, data: updated });
        } else if (req.method === 'DELETE') {
             const { id } = req.query;
             if (!id) {
                 return res.status(400).json({ success: false, message: 'Document ID required' });
             }
             const deleted = await SavedDocument.findOneAndDelete({ _id: id, userId: user._id });
             if (!deleted) {
                 return res.status(404).json({ success: false, message: 'Document not found' });
             }
             return res.status(200).json({ success: true, message: 'Document deleted' });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('Documents API error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
