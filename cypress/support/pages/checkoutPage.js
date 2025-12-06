import { SELECTORS } from "../selectors";

class checkoutPage {

    checkCurrencyExchange(){
        cy.get('[data-tag="currency-dropdown"]').should('be.visible').click();
        cy.get('#BRL > .ui-option__label > [data-tag="currency-dropdown-item"]').should('be.visible').click();
        cy.get('[data-tag="price-total"] > :nth-child(2) > span').should('include.text', 'R$');
    }

    selectOneWayTripInformation(expectedDeparture, expectedArrival, day, month) {
        const expectedDate = `${day} ${month.substring(0, 3)}`;
        cy.contains(expectedDeparture).should('be.visible');
        cy.contains(expectedArrival).should('be.visible');
        cy.contains(expectedDate).should('be.visible');
    }

    selectRoundTripInformation(expectedDeparture, expectedArrival, dayOut, dayIn, month) {
        const expectedOutboundDate = `${dayOut} ${month.substring(0, 3)}`;
        const expectedInboundDate = `${dayIn} ${month.substring(0, 3)}`;
        cy.contains(expectedDeparture).should('be.visible');
        cy.contains(expectedArrival).should('be.visible');
        cy.contains(expectedOutboundDate).should('be.visible');
        cy.contains(expectedInboundDate).should('be.visible');
    }


    fillAllMandatoryFields(firstName, lastName, email) {
        cy.get(SELECTORS.CHECKOUT_PAGE.FIRST_NAME_INPUT).should('be.visible').type(firstName);
        cy.get(SELECTORS.CHECKOUT_PAGE.LAST_NAME_INPUT).should('be.visible').type(lastName);
        cy.get(SELECTORS.CHECKOUT_PAGE.EMAIL_INPUT).should('be.visible').type(email);
        cy.get(SELECTORS.CHECKOUT_PAGE.PASSENGER_DETAILS_HEADER).click();
    }


    trySubmittingForm() {
        cy.get(SELECTORS.CHECKOUT_PAGE.CONFIRM_PAYMENT_BUTTON).click({ force: true });
    }

    captureTicketPriceAndSelect(aliasName, ticketSelectionText, cleanPrice, resultsPage) {
        return cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_PRICE_BUTTON).first()
            .invoke('text')
            .then(priceText => {
                const price = cleanPrice(priceText);
                console.log(`Captured price for ${aliasName}: ${price}`);
                return price;
            })
            .as(aliasName)
            .then(() => {
                resultsPage.selectFirstAvailableTicket(ticketSelectionText);
            });
    }

    assertTotalTicketSum(expectedTotal, cleanPrice) {
        cy.get(SELECTORS.CHECKOUT_PAGE.TOTAL_PRICE_VALUE)
            .should('be.visible')
            .invoke('text')
            .then(totalPriceText => {
                const actualTotal = cleanPrice(totalPriceText);

                console.log(`Final Total (Actual) in Checkout: ${actualTotal}`);
                console.log(`Final Total (Expected) based on calculation: ${expectedTotal}`);

                expect(actualTotal).to.be.closeTo(expectedTotal, 0.01,
                    `The total price ${actualTotal} should be the sum of the tickets ${expectedTotal}`
                );
            });
    }
      validateTotalForMultiplePassengers(cleanPrice, resultsPage) {
        const self = this;
        return cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_PRICE_BUTTON).first()
            .invoke('text')
            .then(priceText => {
                const unitTicketPrice = cleanPrice(priceText);
                return cy.wrap(unitTicketPrice);
            })
            .then(unitTicketPrice => {
                cy.log(`UNIT TICKET PRICE CAPTURED: ${unitTicketPrice}`);

                resultsPage.selectFirstAvailableTicket("Select outbound trip");
                resultsPage.selectFirstAvailableTicket("Select return trip");

                cy.contains('Add one more passenger').click();
                cy.contains('Passenger 2').should('be.visible');
                cy.wait(1000);

                const expectedTotal = unitTicketPrice * 4;
                cy.log(`Expected Base Price (4 tickets): ${expectedTotal}`);

                return self.assertTotalTicketSum(expectedTotal, cleanPrice);
            });
    }

    prepareRoundTripUnitPriceAndAddPassenger(cleanPrice, resultsPage) {
        return cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_PRICE_BUTTON).first()
            .invoke('text')
            .then(priceText => cleanPrice(priceText))
            .then(unitTicketPrice => {
                cy.log(`UNIT TICKET PRICE CAPTURED: ${unitTicketPrice}`);

                resultsPage.selectFirstAvailableTicket("Select outbound trip");
                resultsPage.selectFirstAvailableTicket("Select return trip");

                cy.contains('Add one more passenger').click();
                cy.contains('Passenger 2').should('be.visible');
                cy.wait(1000);

                return cy.wrap(unitTicketPrice);
            });
    }

    captureAndAddExtraItem(aliasName, priceSelector, extraItemName, cleanPrice) {
        
        // 1. Captura o preço dinâmico e armazena (Lógica de preço mantida como estava)
        cy.get(priceSelector, { timeout: 10000 })
            .should('be.visible')
            .invoke('text')
            .then(priceText => cleanPrice(priceText))
            .then(price => cy.wrap(price).as(aliasName)); // Armazena o preço no Alias
            
        // 2. INJEÇÃO E CLIQUE: Encontra o item pelo nome e injeta o selector estável
        const stableSelector = `add-${extraItemName.toLowerCase().replace(/\s/g, '-')}-btn`;
        
        return cy.contains(extraItemName)
            .closest('[data-tag^="extras-card"], .extras__card, .row') // Sobe para o contêiner
            .find('[data-tag="counter-increase"], .counter-increase') // Encontra o botão '+'
            .first()
            .then($btn => {
                // Injeta o atributo estável
                $btn.attr('data-test', stableSelector);
                cy.log(`[INJECTED] Added data-test='${stableSelector}' near '${extraItemName}'`);
            })
            .then(() => {
                // Clica usando o selector estável injetado
                cy.get(`[data-test="${stableSelector}"]`).click();
                return cy.wait(700); // Espera o recálculo
            });
    }
}


export default new checkoutPage();


