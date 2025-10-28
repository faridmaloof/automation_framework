/**
 * AccessDatabase Ability
 * 
 * Representa la habilidad de un Actor para interactuar con bases de datos.
 * Esta clase encapsula el DatabaseClient y permite realizar consultas
 * y operaciones de base de datos dentro del contexto del patrón Screenplay.
 * 
 * Ejemplo de uso:
 * ```typescript
 * const actor = Actor.named('DataTester')
 *   .whoCan(AccessDatabase.using(dbClient));
 * 
 * const result = await actor.attemptsTo(
 *   QueryDatabase.with('SELECT * FROM users WHERE id = $1', [userId])
 * );
 * ```
 */

import { DatabaseClient } from '../helpers/databaseClient';
import { Ability } from './ability';
import { Actor } from '../actors/actor';

export class AccessDatabase extends Ability {
  private queryLog: DatabaseQueryLog[] = [];

  /**
   * Crea una instancia de AccessDatabase con un DatabaseClient específico
   * 
   * @param dbClient - Instancia de DatabaseClient configurado
   * @returns Nueva instancia de AccessDatabase
   * 
   * @example
   * ```typescript
   * const dbAbility = AccessDatabase.using(dbClient);
   * ```
   */
  static using(dbClient: DatabaseClient): AccessDatabase {
    return new AccessDatabase(dbClient);
  }

  /**
   * Constructor privado - usar el método estático `using()` en su lugar
   */
  private constructor(private dbClient: DatabaseClient) {
    super();
  }

  /**
   * Returns the unique name identifier for this ability
   */
  name(): string {
    return 'AccessDatabase';
  }

  /**
   * Devuelve el DatabaseClient asociado a este Actor
   * 
   * @param _actor - El actor que ejecuta la acción
   * @returns Instancia de DatabaseClient
   */
  as(_actor: Actor): DatabaseClient {
    return this.dbClient;
  }

  /**
   * Método de conveniencia para obtener el DatabaseClient directamente
   * 
   * @returns Instancia de DatabaseClient
   */
  getDBClient(): DatabaseClient {
    return this.dbClient;
  }

  /**
   * Ejecuta una query SELECT y captura evidencia
   * 
   * @param query - Query SQL a ejecutar
   * @param params - Parámetros de la query
   * @returns Resultados de la query con evidencia
   */
  async executeQuery(query: string, params?: any[]): Promise<DatabaseQueryResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.dbClient.query(query, params);
      const duration = Date.now() - startTime;

      const evidence = this.createEvidence(query, params, result, duration, true);
      this.queryLog.push(evidence);

      return { result, evidence };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const evidence = this.createEvidence(query, params, null, duration, false, error.message);
      this.queryLog.push(evidence);

      throw error;
    }
  }

  /**
   * Ejecuta múltiples queries en una transacción
   * 
   * @param queries - Array de queries con sus parámetros
   * @returns Resultados de todas las queries
   */
  async executeTransaction(queries: Array<{ query: string; params?: any[] }>): Promise<any[]> {
    const results: any[] = [];
    
    for (const { query, params } of queries) {
      const result = await this.executeQuery(query, params);
      results.push(result);
    }

    return results;
  }

  /**
   * Verifica si la conexión a la base de datos está activa
   * 
   * @returns true si está conectado, false en caso contrario
   */
  async isConnected(): Promise<boolean> {
    return await this.dbClient.isConnected();
  }

  /**
   * Conecta a la base de datos si no está conectado
   */
  async ensureConnected(): Promise<void> {
    const connected = await this.isConnected();
    if (!connected) {
      await this.dbClient.connect();
    }
  }

  /**
   * Crea un objeto de evidencia para una query de base de datos
   */
  private createEvidence(
    query: string,
    params: any[] | undefined,
    result: any,
    duration: number,
    success: boolean,
    error?: string
  ): DatabaseQueryLog {
    return {
      query,
      params: params || [],
      timestamp: new Date().toISOString(),
      result: result,
      duration,
      success,
      error,
      rowCount: result?.rows?.length || result?.rowCount || 0
    };
  }

  /**
   * Obtiene el log completo de todas las queries ejecutadas
   * 
   * @returns Array con todas las queries ejecutadas
   */
  getQueryLog(): DatabaseQueryLog[] {
    return this.queryLog;
  }

  /**
   * Limpia el log de queries
   */
  clearQueryLog(): void {
    this.queryLog = [];
  }

  /**
   * Genera un reporte de evidencia formateado
   * 
   * @returns String con evidencia formateada en ASCII box
   */
  generateEvidenceReport(): string {
    let report = '\n╔════════════════════════════════════════════════════════════════════\n';
    report += '║ 🗄️  DATABASE QUERY EVIDENCE REPORT\n';
    report += '╠════════════════════════════════════════════════════════════════════\n';
    report += `║ Total Queries: ${this.queryLog.length}\n`;
    report += `║ Successful: ${this.queryLog.filter(q => q.success).length}\n`;
    report += `║ Failed: ${this.queryLog.filter(q => !q.success).length}\n`;
    report += '╠════════════════════════════════════════════════════════════════════\n';

    this.queryLog.forEach((log, index) => {
      report += `║ [${index + 1}] Query\n`;
      report += `║     SQL: ${log.query.substring(0, 60)}${log.query.length > 60 ? '...' : ''}\n`;
      report += `║     Params: ${JSON.stringify(log.params)}\n`;
      report += `║     Rows: ${log.rowCount}\n`;
      report += `║     Duration: ${log.duration}ms\n`;
      report += `║     Timestamp: ${log.timestamp}\n`;
      
      if (!log.success) {
        report += `║     ❌ QUERY FAILED: ${log.error}\n`;
      } else {
        report += `║     ✅ QUERY SUCCESSFUL\n`;
      }
      
      report += '║     ────────────────────────────────────────────────────────────\n';
    });

    report += '╚════════════════════════════════════════════════════════════════════\n';

    return report;
  }

  /**
   * Cierra la conexión a la base de datos
   */
  async disconnect(): Promise<void> {
    await this.dbClient.disconnect();
  }
}

/**
 * Interfaz para el log de queries de base de datos
 */
export interface DatabaseQueryLog {
  query: string;
  params: any[];
  timestamp: string;
  result: any;
  duration: number;
  success: boolean;
  error?: string;
  rowCount: number;
}

/**
 * Interfaz para resultado de query con evidencia
 */
export interface DatabaseQueryResult {
  result: any;
  evidence: DatabaseQueryLog;
}
