export async function fetchReports() {
    const URL = 'https://wijrxyqugzbqftumtdzo.supabase.co/rest/v1/reports?select=*';
    const API_KEY = 'sb_publishable_EV-wBRb2HTx822jR2dsc_Q_9gudkuCQ'; // Pega aquí tu sb_publishable_...

    try {
        const response = await fetch(URL, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fallo en el engine:", error);
        throw error;
    }
}