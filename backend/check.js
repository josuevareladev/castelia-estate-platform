import dotenv from 'dotenv';
dotenv.config();

async function verModelos() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("--- LISTA DE MODELOS QUE SÍ PUEDES USAR ---");
        data.models.forEach(m => console.log(m.name));
    } catch (e) {
        console.log("Error consultando:", e);
    }
}

verModelos();