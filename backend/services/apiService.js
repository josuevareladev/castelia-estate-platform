/**
 * Servicio de comunicación con el backend de Castelia Studio.
 * Abstrae la lógica de red y estandariza las respuestas para el consumo de la UI.
 */
export const searchProperties = async (prompt) => {
    try {
        // En un entorno de producción, 'http://localhost:5000' vendría de un archivo .env del frontend
        const response = await fetch('http://localhost:5000/api/agent/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        // Si el status HTTP no es 200-299, forzamos el paso al bloque catch
        if (!response.ok) {
            throw new Error(data.error || 'Fallo en la comunicación con el servidor de Castelia.');
        }

        return data;
        
    } catch (error) {
        console.error('[Frontend API Service] Error ejecutando la búsqueda:', error.message);
        
        // Retornamos un objeto estructurado para que el frontend falle con gracia.
        // Esto evita que la aplicación entera "crashee" y permite mostrar un UI de error amigable.
        return {
            success: false,
            error: error.message,
            filters: null,
            data: []
        };
    }
};