export async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 5): Promise<Response> {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await fetch(url, options);
            // If it's 429 (Too Many Requests) or 503 (Service Unavailable), we retry
            if (response.status === 429 || response.status === 503) {
                throw new Error(`HTTP Error ${response.status}`);
            }
            return response;
        } catch (error) {
            retries++;
            if (retries >= maxRetries) {
                throw error;
            }
            // Exponential backoff: 1000, 2000, 4000, 8000, 16000
            const delay = Math.pow(2, retries - 1) * 1000;
            console.warn(`Fetch failed. Retrying in ${delay}ms... (Attempt ${retries}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Max retries reached');
}
