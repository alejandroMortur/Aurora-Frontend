// /modules/AURORA/core/AuroraSanitizer.ts

/**
 * Limpia el texto de entrada para eliminar caracteres problemáticos o maliciosos.
 * También normaliza espacios y acentos.
 */
export async function sanitizeText(input: string): Promise<string> {
  let text = input.trim();

  // Quitar caracteres no deseados
  text = text.replace(/[^\w\s.,!?¡¿áéíóúÁÉÍÓÚñÑ]/g, "");

  // Normalizar espacios múltiples
  text = text.replace(/\s+/g, " ");

  // Control de longitud (por seguridad)
  if (text.length > 300) {
    text = text.slice(0, 300) + "...";
  }

  // Elimina insultos o lenguaje inadecuado (puedes ampliar la lista)
  const prohibited = ["tonto", "idiota", "estúpido"];
  prohibited.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    text = text.replace(regex, "💫");
  });

  return text;
}
