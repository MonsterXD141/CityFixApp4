import { fetchReports } from './reportEngine';

test('Debe traer datos reales de Supabase', async () => {
    const data = await fetchReports();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(5);
});