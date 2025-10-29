/**
 * Task: Navigate to PokeAPI Documentation
 */

import { Actor } from '../../../actors/actor';
import { Task } from '../../task';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';
import { BrowseTheWeb } from '../../../abilities/browseTheWeb';

/**
 * Tarea para navegar a la página de documentación de PokeAPI
 * Utiliza el patrón Screenplay para encapsular la acción de navegación
 */
export class NavigateToPokeAPIDocs implements Task {
  /**
   * Ejecuta la tarea de navegación
   * @param actor - El actor que ejecuta la tarea
   */
  async performAs(actor: Actor): Promise<void> {
    // Obtener el Page desde la habilidad BrowseTheWeb
    const page = BrowseTheWeb.from(actor);
    
    // Crear instancia del Page Object
    const docsPage = new PokeAPIDocsPage(page);
    
    // Navegar a la página de documentación
    await docsPage.navigateToDocsPage();
    
    // Almacenar el Page Object en el contexto del actor para reutilización
    // Nota: Estamos usando un enfoque temporal hasta que Actor tenga remember()
    (actor as any)._docsPage = docsPage;
  }
}
