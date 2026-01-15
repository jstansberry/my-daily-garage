import { getDailyCar } from '../../../../lib/getDailyCar';

export async function POST(req) {
    const { make, model, year } = await req.json();
    const dailyCar = await getDailyCar();

    // Fuzzy comparison or exact?
    // Supabase makes/models are usually normalized strings.
    const isCorrect =
        dailyCar.make.toLowerCase() === (make || '').toLowerCase() &&
        dailyCar.model.toLowerCase() === (model || '').toLowerCase() &&
        parseInt(dailyCar.year) === parseInt(year);

    return Response.json({ correct: isCorrect });
}
