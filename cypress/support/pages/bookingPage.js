import { SELECTORS } from "../selectors";

class bookingPage {

    visit(url) {
        cy.visit(SELECTORS.BOOKING_PAGE.URL);
        cy.url().should('include', 'retailerPartnerNumber');
    }

    acceptCookies() {
        cy.get(SELECTORS.MODAL_CONTAINER).should('be.visible');
        cy.get(SELECTORS.CLOSE_BUTTON_SELECTOR).should('be.visible');
        cy.get(SELECTORS.CLOSE_BUTTON_SELECTOR).click();
        cy.get(SELECTORS.MODAL_CONTAINER).should('not.exist');
    }

    clickOneWayRadio() {
        cy.get(SELECTORS.BOOKING_PAGE.ONE_WAY_RADIO).click();
    }

    clickRoundTripRadio() {
        cy.get(SELECTORS.BOOKING_PAGE.ROUND_TRIP_RADIO).click();
    }

    fillDeparture(text) {
        cy.get(SELECTORS.BOOKING_PAGE.DATA_FIELD_DEPARTURE).type(text);
        cy.get(SELECTORS.AUTO_COMPLETE_OPTION).click();
    }

    fillArrival(text) {
        cy.get(SELECTORS.BOOKING_PAGE.DATA_FIELD_ARRIVAL).type(text);
        cy.get(SELECTORS.AUTO_COMPLETE_OPTION).click();
    }

    openDatePickerOneWay() {
        cy.get(SELECTORS.BOOKING_PAGE.DATE_PICKER_DEPARTURE).eq(0).click();
    }

    openDatePickerRoundTripDeparture() {
        cy.contains('Departure date').click({ force: true });
    }

    openDatePickerRoundTripReturn() {
        cy.contains('Return date').click({ force: true });
    }

    selectDateInCalendar(monthText, dayText) {
        cy.contains(monthText)
            .parents('.ui-calendar')
            .contains(dayText)
            .click({ force: true });
    }

    clickSearch() {
        cy.contains('button', SELECTORS.BOOKING_PAGE.SEARCH_BUTTON_TEXT).click();
    }

    selectSuggestedDestination() {
        cy.get(SELECTORS.BOOKING_PAGE.DESTINATION_LINK_BASE).click();
    }

    verifyDestinationLinkAttribute(destinationTitle, expectedUrlPart) {
        cy.contains(destinationTitle)
            .closest('div')
            .contains('DISCOVER')
            .closest('a')
            .should('have.attr', 'href')
            .and('include', expectedUrlPart);
    }

    validateRoutesDropdown() {
        cy.contains('Our routes').click();
        cy.contains('Map of our routes').should('be.visible');
        cy.get('body').click(0, 0); 
        cy.contains('Map of our routes').should('not.exist');
    }

    validateInternalLink(linkText, urlPath) {
        cy.contains(linkText).should('be.visible');
        cy.contains(linkText)
            .invoke('removeAttr', 'target')
            .click();
        cy.url().should('include', urlPath);
        cy.url().should('include', 'retailerPartnerNumber=807197');
        cy.go('back');
    }


    performOneWaySearch(departureCity, arrivalCity, targetMonth, dayOutbound) {
        this.clickOneWayRadio();
        this.fillDeparture(departureCity);
        this.fillArrival(arrivalCity); 
        this.openDatePickerOneWay();
        this.selectDateInCalendar(targetMonth, dayOutbound);
        this.clickSearch();
        cy.url().should('include', '/result');
    }

    performRoundTripSearch(departureCity, arrivalCity, targetMonth, dayOutbound, dayInbound) {
        this.clickRoundTripRadio();
        this.fillDeparture(departureCity);
        this.fillArrival(arrivalCity); 
        this.openDatePickerRoundTripDeparture();
        this.selectDateInCalendar(targetMonth, dayOutbound);
        this.openDatePickerRoundTripReturn();
        this.selectDateInCalendar(targetMonth, dayInbound);
        this.clickSearch();
        cy.url().should('include', '/result');
    }

    changeLanguage() {
        cy.get('[data-tag="locale-dropdown"] > .ui-dropdown__label > [data-tag="font-icon-chevron-down"] > .font-icon__content').click();
        cy.get('#pt-BR > .ui-option__label > [data-tag="locale-dropdown-item"] > .item__name').click();
        cy.get('#\\:r0\\: > .row > .cell').should('contain.text', 'Nossas rotas');
    }
}

export default new bookingPage();