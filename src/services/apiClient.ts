export async function fetchBackendResponse(message: string) {
  try {
    // 🌍 Leemos la URL base del entorno (.env)
    const apiUrl =
      import.meta.env.PUBLIC_API_URL ||
      process.env.PUBLIC_API_URL;

    const endpoint = `${apiUrl}/aurora/chats`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`Error del backend: ${res.status}`);
    }

    return await res.json(); // { text: "¡Hola! Me alegra verte 💫" }
  } catch (error: any) {
    console.error("🚫 Error en fetchBackendResponse:", error.message || error);
    return { text: "Lo siento, no puedo conectar con el servidor 😔" };
  }
}
