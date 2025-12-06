import { SELECTORS } from "../selectors";

class resultsPage {

    elements = {
        JOURNEY_HEADER: '.journey-list__header-title',
        JOURNEY_PRICE_BUTTON: '[data-tag="footer-price-button"]', 
        JOURNEY_PRICE: '.journey-card__footer-price-total > span'
    }


    selectFirstAvailableTicket(expectedHeaderText) {
        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_HEADER, { timeout: 20000 }).should('contain.text', expectedHeaderText);
        cy.contains('Direct trip', { timeout: 15000 }).should('be.visible');
        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_PRICE).first().should('be.visible').and('not.be.empty');
        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_PRICE_BUTTON).first().click();
        
    }

    confirmJourneySelection() {
        cy.get('[data-tag="passenger-details"]', { timeout: 10000 })
          .should('be.visible')
          .and('contain.text', 'Passenger details');
    }
   
}

export default new resultsPage();
