/**
 * Step Definitions: PokeAPI Documentation Navigation Tests
 * 
 * These steps implement the scenarios defined in navigation-documentation.feature
 * using the Screenplay pattern (Actor, Task, Question)
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from '@playwright/test';

// Import Tasks
import { NavigateToPokeAPIDocs } from '../src/tasks/web/docs/NavigateToPokeAPIDocs';
import { ClickLink } from '../src/tasks/web/docs/ClickLink';
import { ChangeViewport } from '../src/tasks/web/docs/ChangeViewport';

// Import Questions
import { SeeHeading } from '../src/questions/web/docs/SeeHeading';
import { SeeLink } from '../src/questions/web/docs/SeeLink';
import { SeeText } from '../src/questions/web/docs/SeeText';
import { SeeDeprecationMessage } from '../src/questions/web/docs/SeeDeprecationMessage';
import { SeeDeprecationDate } from '../src/questions/web/docs/SeeDeprecationDate';
import { SeeGraphQLTitle } from '../src/questions/web/docs/SeeGraphQLTitle';
import { SeeGraphQLEndpoint } from '../src/questions/web/docs/SeeGraphQLEndpoint';
import { SeeGraphiQLSection } from '../src/questions/web/docs/SeeGraphiQLSection';
import { SeeFairUseTitle } from '../src/questions/web/docs/SeeFairUseTitle';
import { SeeResourceSections } from '../src/questions/web/docs/SeeResourceSections';
import { SeeEndpointExamples } from '../src/questions/web/docs/SeeEndpointExamples';
import { LinksAreClickable } from '../src/questions/web/docs/LinksAreClickable';
import { LinksHaveValidURLs } from '../src/questions/web/docs/LinksHaveValidURLs';
import { NavigationIsAccessible } from '../src/questions/web/docs/NavigationIsAccessible';
import { ContentIsReadable } from '../src/questions/web/docs/ContentIsReadable';

// ========================================
// GIVEN - Preconditions
// ========================================

/**
 * Given I am on the PokeAPI documentation page
 */
Given('I am on the PokeAPI documentation page', async function (this: CustomWorld) {
  console.log('🌐 Navigating to PokeAPI documentation page');
  
  const task = new NavigateToPokeAPIDocs();
  await this.actor.attemptsTo(task);
  
  console.log('✅ Navigation completed');
});

// ========================================
// WHEN - Actions
// ========================================

/**
 * When I click on the "{string}" link
 */
When('I click on the {string} link', async function (this: CustomWorld, linkText: string) {
  console.log(`🖱️ Clicking on link: ${linkText}`);
  
  await this.actor.attemptsTo(ClickLink.on(linkText));
  
  console.log('✅ Click completed');
});

/**
 * When I change the viewport to {string}
 */
When('I change the viewport to {string}', async function (this: CustomWorld, deviceType: string) {
  console.log(`📱 Changing viewport to: ${deviceType}`);
  
  await this.actor.attemptsTo(ChangeViewport.to(deviceType));
  
  console.log('✅ Viewport changed');
});

// ========================================
// THEN - Verifications
// ========================================

/**
 * Then I should see the "{string}" heading
 */
Then('I should see the {string} heading', async function (this: CustomWorld, heading: string) {
  console.log(`👀 Verifying heading: ${heading}`);
  
  const isVisible = await this.actor.asks(SeeHeading.withText(heading));
  
  expect(isVisible).toBe(true);
  console.log('✅ Heading verified');
});

/**
 * And I should see the main navigation links:
 *   | API v1         |
 *   | API v2         |
 *   | GraphQL v1beta |
 */
Then('I should see the main navigation links:', async function (this: CustomWorld, dataTable: DataTable) {
  console.log('👀 Verifying main navigation links');
  
  const links = dataTable.raw().flat(); // Get all values from the table
  
  for (const linkText of links) {
    console.log(`  📎 Verifying link: ${linkText}`);
    const isVisible = await this.actor.asks(SeeLink.withText(linkText));
    expect(isVisible).toBe(true);
  }
  
  console.log('✅ All links verified');
});

/**
 * Then I should see the deprecation message "{string}"
 */
Then('I should see the deprecation message {string}', async function (this: CustomWorld, message: string) {
  console.log(`👀 Verifying deprecation message: ${message}`);
  
  const isVisible = await this.actor.asks(SeeDeprecationMessage.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ Deprecation message verified');
});

/**
 * And I should see the end of support date "{string}"
 */
Then('I should see the end of support date {string}', async function (this: CustomWorld, date: string) {
  console.log(`👀 Verifying end of support date: ${date}`);
  
  const isVisible = await this.actor.asks(SeeDeprecationDate.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ End of support date verified');
});

/**
 * Then I should see the GraphQL title
 */
Then('I should see the GraphQL title', async function (this: CustomWorld) {
  console.log('👀 Verifying GraphQL title');
  
  const isVisible = await this.actor.asks(SeeGraphQLTitle.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ GraphQL title verified');
});

/**
 * And I should see the endpoint URL "{string}"
 */
Then('I should see the endpoint URL {string}', async function (this: CustomWorld, endpoint: string) {
  console.log(`👀 Verifying endpoint URL: ${endpoint}`);
  
  const isVisible = await this.actor.asks(SeeGraphQLEndpoint.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ Endpoint URL verified');
});

/**
 * And I should see the "{string}" section
 */
Then('I should see the {string} section', async function (this: CustomWorld, sectionName: string) {
  console.log(`👀 Verifying section: ${sectionName}`);
  
  let isVisible = false;
  
  // Determine which Question to use based on the section
  switch (sectionName) {
    case 'GraphiQL':
      isVisible = await this.actor.asks(SeeGraphiQLSection.displayed());
      break;
    case 'Fair Use Policy':
      isVisible = await this.actor.asks(SeeFairUseTitle.displayed());
      break;
    default:
      // For generic sections, use SeeText
      isVisible = await this.actor.asks(SeeText.containing(sectionName));
  }
  
  expect(isVisible).toBe(true);
  console.log('✅ Section verified');
});

/**
 * Then I should see the "{string}" title
 */
Then('I should see the {string} title', async function (this: CustomWorld, title: string) {
  console.log(`👀 Verifying title: ${title}`);
  
  let isVisible = false;
  
  switch (title) {
    case 'Fair Use Policy':
      isVisible = await this.actor.asks(SeeFairUseTitle.displayed());
      break;
    default:
      isVisible = await this.actor.asks(SeeText.containing(title));
  }
  
  expect(isVisible).toBe(true);
  console.log('✅ Title verified');
});

/**
 * And I should see available resource sections
 */
Then('I should see available resource sections', async function (this: CustomWorld) {
  console.log('👀 Verifying resource sections');
  
  const areVisible = await this.actor.asks(SeeResourceSections.displayed());
  
  expect(areVisible).toBe(true);
  console.log('✅ Resource sections verified');
});

/**
 * And I should see endpoint examples
 */
Then('I should see endpoint examples', async function (this: CustomWorld) {
  console.log('👀 Verifying endpoint examples');
  
  const areVisible = await this.actor.asks(SeeEndpointExamples.displayed());
  
  expect(areVisible).toBe(true);
  console.log('✅ Endpoint examples verified');
});

/**
 * Then all main links should be clickable
 */
Then('all main links should be clickable', async function (this: CustomWorld) {
  console.log('👀 Verifying that all links are clickable');
  
  const areClickable = await this.actor.asks(LinksAreClickable.check());
  
  expect(areClickable).toBe(true);
  console.log('✅ All links are clickable');
});

/**
 * And all main links should have valid URLs
 */
Then('all main links should have valid URLs', async function (this: CustomWorld) {
  console.log('👀 Verifying that all links have valid URLs');
  
  const haveValidURLs = await this.actor.asks(LinksHaveValidURLs.check());
  
  expect(haveValidURLs).toBe(true);
  console.log('✅ All links have valid URLs');
});

/**
 * And the navigation should be accessible
 */
Then('the navigation should be accessible', async function (this: CustomWorld) {
  console.log('👀 Verifying navigation accessibility');
  
  const isAccessible = await this.actor.asks(NavigationIsAccessible.check());
  
  expect(isAccessible).toBe(true);
  console.log('✅ Navigation is accessible');
});

/**
 * And the content should be readable
 */
Then('the content should be readable', async function (this: CustomWorld) {
  console.log('👀 Verifying content readability');
  
  const isReadable = await this.actor.asks(ContentIsReadable.check());
  
  expect(isReadable).toBe(true);
  console.log('✅ Content is readable');
});
