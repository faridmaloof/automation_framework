/**
 * CallAnAPI Ability
 * 
 * Representa la habilidad de un Actor para realizar llamadas a APIs REST
 * mediante Playwright APIRequestContext. Esta clase encapsula las operaciones
 * HTTP y permite capturar evidencias completas de las interacciones con APIs.
 * 
 * Ejemplo de uso:
 * ```typescript
 * const actor = Actor.named('APITester')
 *   .whoCan(CallAnAPI.using(request));
 * 
 * await actor.attemptsTo(
 *   Get.from('/api/v2/pokemon/pikachu'),
 *   Post.to('/api/v2/pokemon').with({ name: 'bulbasaur' })
 * );
 * ```
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { Ability } from './ability';
import { Actor } from '../actors/actor';
import { Logger } from '../helpers/logger';

export class CallAnAPI extends Ability {
  private requestLog: APIRequestLog[] = [];
  private logger = new Logger('CallAnAPI');

  /**
   * Crea una instancia de CallAnAPI con un APIRequestContext específico
   * 
   * @param apiContext - Instancia de Playwright APIRequestContext
   * @returns Nueva instancia de CallAnAPI
   * 
   * @example
   * ```typescript
   * const apiAbility = CallAnAPI.using(request);
   * ```
   */
  static using(apiContext: APIRequestContext): CallAnAPI {
    return new CallAnAPI(apiContext);
  }

  /**
   * Obtiene la habilidad CallAnAPI de un Actor
   * 
   * @param actor - El actor del cual obtener la habilidad
   * @returns La instancia de CallAnAPI
   * 
   * @example
   * ```typescript
   * const apiAbility = CallAnAPI.from(actor);
   * await apiAbility.get('/api/v2/pokemon/pikachu');
   * ```
   */
  static from(actor: Actor): CallAnAPI {
    const abilities = (actor as any).abilities as Map<string, Ability>;
    const ability = abilities.get('CallAnAPI');
    
    if (!ability) {
      throw new Error(`Actor ${actor.name} does not have CallAnAPI ability`);
    }
    
    return ability as CallAnAPI;
  }

  /**
   * Constructor privado - usar el método estático `using()` en su lugar
   */
  private constructor(private apiContext: APIRequestContext) {
    super();
  }

  /**
   * Returns the unique name identifier for this ability
   */
  name(): string {
    return 'CallAnAPI';
  }

  /**
   * Devuelve el APIRequestContext asociado a este Actor
   * 
   * @param _actor - El actor que ejecuta la acción
   * @returns Instancia de Playwright APIRequestContext
   */
  as(_actor: Actor): APIRequestContext {
    return this.apiContext;
  }

  /**
   * Método de conveniencia para obtener el APIRequestContext directamente
   * 
   * @returns Instancia de Playwright APIRequestContext
   */
  getAPIContext(): APIRequestContext {
    return this.apiContext;
  }

  /**
   * Realiza una petición GET y captura evidencia
   * 
   * @param url - URL del endpoint
   * @param options - Opciones adicionales (headers, params, etc.)
   * @returns Respuesta de la API con evidencia capturada
   */
  async get(url: string, options?: any): Promise<APIResponseWithEvidence> {
    const startTime = Date.now();
    
    // Log request
    this.logger.apiRequest('GET', url, options?.params);
    
    const response = await this.apiContext.get(url, options);
    const responseBody = await this.extractResponseBody(response);
    const duration = Date.now() - startTime;

    // Log response
    this.logger.apiResponse(response.status(), responseBody, duration);

    const evidence = this.createEvidence('GET', url, options, response, responseBody, duration);
    this.requestLog.push(evidence);

    return { response, evidence };
  }

  /**
   * Realiza una petición POST y captura evidencia
   * 
   * @param url - URL del endpoint
   * @param options - Opciones adicionales (headers, data, etc.)
   * @returns Respuesta de la API con evidencia capturada
   */
  async post(url: string, options?: any): Promise<APIResponseWithEvidence> {
    const startTime = Date.now();
    
    const response = await this.apiContext.post(url, options);
    const responseBody = await this.extractResponseBody(response);
    const duration = Date.now() - startTime;

    const evidence = this.createEvidence('POST', url, options, response, responseBody, duration);
    this.requestLog.push(evidence);

    return { response, evidence };
  }

  /**
   * Realiza una petición PUT y captura evidencia
   * 
   * @param url - URL del endpoint
   * @param options - Opciones adicionales (headers, data, etc.)
   * @returns Respuesta de la API con evidencia capturada
   */
  async put(url: string, options?: any): Promise<APIResponseWithEvidence> {
    const startTime = Date.now();
    
    const response = await this.apiContext.put(url, options);
    const responseBody = await this.extractResponseBody(response);
    const duration = Date.now() - startTime;

    const evidence = this.createEvidence('PUT', url, options, response, responseBody, duration);
    this.requestLog.push(evidence);

    return { response, evidence };
  }

  /**
   * Realiza una petición PATCH y captura evidencia
   * 
   * @param url - URL del endpoint
   * @param options - Opciones adicionales (headers, data, etc.)
   * @returns Respuesta de la API con evidencia capturada
   */
  async patch(url: string, options?: any): Promise<APIResponseWithEvidence> {
    const startTime = Date.now();
    
    const response = await this.apiContext.patch(url, options);
    const responseBody = await this.extractResponseBody(response);
    const duration = Date.now() - startTime;

    const evidence = this.createEvidence('PATCH', url, options, response, responseBody, duration);
    this.requestLog.push(evidence);

    return { response, evidence };
  }

  /**
   * Realiza una petición DELETE y captura evidencia
   * 
   * @param url - URL del endpoint
   * @param options - Opciones adicionales (headers, params, etc.)
   * @returns Respuesta de la API con evidencia capturada
   */
  async delete(url: string, options?: any): Promise<APIResponseWithEvidence> {
    const startTime = Date.now();
    
    const response = await this.apiContext.delete(url, options);
    const responseBody = await this.extractResponseBody(response);
    const duration = Date.now() - startTime;

    const evidence = this.createEvidence('DELETE', url, options, response, responseBody, duration);
    this.requestLog.push(evidence);

    return { response, evidence };
  }

  /**
   * Extrae el cuerpo de la respuesta (JSON, texto o binario)
   */
  private async extractResponseBody(response: APIResponse): Promise<any> {
    const contentType = response.headers()['content-type'] || '';
    
    try {
      if (contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType.includes('text/')) {
        return await response.text();
      } else {
        return await response.body();
      }
    } catch (error: any) {
      return `[Error parsing response: ${error?.message || 'Unknown error'}]`;
    }
  }

  /**
   * Crea un objeto de evidencia completo para la petición/respuesta
   */
  private createEvidence(
    method: string,
    url: string,
    requestOptions: any,
    response: APIResponse,
    responseBody: any,
    duration: number
  ): APIRequestLog {
    return {
      method,
      url,
      timestamp: new Date().toISOString(),
      request: {
        headers: requestOptions?.headers || {},
        params: requestOptions?.params || {},
        data: requestOptions?.data || null
      },
      response: {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        body: responseBody
      },
      duration,
      success: response.ok()
    };
  }

  /**
   * Obtiene el log completo de todas las peticiones realizadas
   * 
   * @returns Array con todas las peticiones realizadas
   */
  getRequestLog(): APIRequestLog[] {
    return this.requestLog;
  }

  /**
   * Limpia el log de peticiones
   */
  clearRequestLog(): void {
    this.requestLog = [];
  }

  /**
   * Genera un reporte de evidencia formateado
   * 
   * @returns String con evidencia formateada en ASCII box
   */
  generateEvidenceReport(): string {
    let report = '\n╔════════════════════════════════════════════════════════════════════\n';
    report += '║ 🔍 API TEST EVIDENCE REPORT\n';
    report += '╠════════════════════════════════════════════════════════════════════\n';
    report += `║ Total Requests: ${this.requestLog.length}\n`;
    report += `║ Successful: ${this.requestLog.filter(r => r.success).length}\n`;
    report += `║ Failed: ${this.requestLog.filter(r => !r.success).length}\n`;
    report += '╠════════════════════════════════════════════════════════════════════\n';

    this.requestLog.forEach((log, index) => {
      report += `║ [${index + 1}] ${log.method} ${log.url}\n`;
      report += `║     Status: ${log.response.status} ${log.response.statusText}\n`;
      report += `║     Duration: ${log.duration}ms\n`;
      report += `║     Timestamp: ${log.timestamp}\n`;
      
      if (!log.success) {
        report += `║     ❌ REQUEST FAILED\n`;
      } else {
        report += `║     ✅ REQUEST SUCCESSFUL\n`;
      }
      
      report += '║     ────────────────────────────────────────────────────────────\n';
    });

    report += '╚════════════════════════════════════════════════════════════════════\n';

    return report;
  }
}

/**
 * Interfaz para el log de peticiones API
 */
export interface APIRequestLog {
  method: string;
  url: string;
  timestamp: string;
  request: {
    headers: Record<string, string>;
    params: Record<string, any>;
    data: any;
  };
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
  };
  duration: number;
  success: boolean;
}

/**
 * Interfaz para respuesta API con evidencia
 */
export interface APIResponseWithEvidence {
  response: APIResponse;
  evidence: APIRequestLog;
}
