/**
 * URL Builder Helper
 * 
 * Construcción segura de URLs desde la API_BASE_URL del .env
 * Evita hardcodear URLs y facilita cambios entre ambientes
 * 
 * @example
 * ```typescript
 * // Usando el helper
 * const url = UrlBuilder.build('/api/v2/pokemon/pikachu');
 * // Resultado: https://api.example.com/api/v2/pokemon/pikachu
 * 
 * // Con query params
 * const url = UrlBuilder.build('/api/v2/pokemon', { limit: 10, offset: 0 });
 * // Resultado: https://api.example.com/api/v2/pokemon?limit=10&offset=0
 * ```
 */

export class UrlBuilder {
  /**
   * Construye una URL completa desde API_BASE_URL + path
   * 
   * @param path - Path relativo (ej: '/api/v2/pokemon/pikachu')
   * @param queryParams - Parámetros query opcionales
   * @returns URL completa
   * 
   * @throws Error si API_BASE_URL no está configurada
   */
  static build(path: string, queryParams?: Record<string, any>): string {
    const baseUrl = process.env.API_BASE_URL;
    
    if (!baseUrl) {
      throw new Error(
        '❌ API_BASE_URL no está configurada en .env\n' +
        '   Copia .env.example a .env y configura API_BASE_URL'
      );
    }

    // Asegurar que el path comienza con /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Remover trailing slash del baseUrl si existe
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // Construir URL base
    let url = `${cleanBaseUrl}${normalizedPath}`;
    
    // Agregar query params si existen
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });
      url = `${url}?${params.toString()}`;
    }
    
    return url;
  }

  /**
   * Obtiene la API_BASE_URL configurada
   * 
   * @returns Base URL del .env
   * @throws Error si API_BASE_URL no está configurada
   */
  static getBaseUrl(): string {
    const baseUrl = process.env.API_BASE_URL;
    
    if (!baseUrl) {
      throw new Error(
        '❌ API_BASE_URL no está configurada en .env\n' +
        '   Copia .env.example a .env y configura API_BASE_URL'
      );
    }
    
    return baseUrl;
  }

  /**
   * Valida si la API_BASE_URL está configurada
   * 
   * @returns true si está configurada, false si no
   */
  static isConfigured(): boolean {
    return !!process.env.API_BASE_URL;
  }
}
