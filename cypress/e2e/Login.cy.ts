// cypress/integration/login.spec.js
import eyesPlugin from "@applitools/eyes-cypress";

describe('Login', () => {
    it('should login successfully', () => {
   
      cy.visit('https://octopus-app-aby57.ondigitalocean.app/login');
      cy.get('input[type="text"]').type('test');
      cy.get('input[type="password"]').type('test ');
      cy.get('button#login').click();
      cy.url().should('include', '/dashboard');
      cy.get('.logout-link').should('exist');
    });
  });
  
