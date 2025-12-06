import bookingPage from '../support/pages/bookingPage'; 
import destinations from '../fixtures/destinations.json';
import headerMenuItems from '../fixtures/headerMenuItems.json';
import { CITIES, DATES, MESSAGES } from '../support/testConstants';
import { SELECTORS } from '../support/selectors';

describe("Booking Page - Check Content home page", () => {

     beforeEach(() => {
        bookingPage.visit();
        bookingPage.acceptCookies();
    });

    it('Header: Should open and close the "Our routes" dropdown menu', () => {
        bookingPage.validateRoutesDropdown();
    });

    headerMenuItems.forEach((item) => {
        if (item.text !== 'Our routes') {
            it(`Header: Should navigate to ${item.text} and verify URL`, () => {
                bookingPage.validateInternalLink(item.text, item.urlPath);
            });
        }
    });

    it('Header: Should change the language and verify translation', () => {
        bookingPage.changeLanguage(); 
    });

     it("Mandatory Fields: Should show visual error feedback on empty fields after clicking Search", () => {
        bookingPage.clickSearch();
        cy.get(SELECTORS.BOOKING_PAGE.DATA_FIELD_DEPARTURE)
            .parents('.ui-input-wrapper')
            .should('have.class', 'ui-input-wrapper--error'); 
        cy.url().should('include', 'retailerPartnerNumber');
    });

    it("Mandatory Fields: Should require return date for round trip when departure date is filled", () => {
        bookingPage.clickRoundTripRadio();
        bookingPage.fillDeparture(CITIES.DEPARTURE);
        bookingPage.fillArrival(CITIES.ARRIVAL);
        bookingPage.openDatePickerRoundTripDeparture();
        bookingPage.selectDateInCalendar(DATES.TARGET_MONTH, DATES.DAY_OUTBOUND);
        bookingPage.clickSearch();
        cy.contains('Required field')
            .should('be.visible');
        cy.url().should('include', 'retailerPartnerNumber');
    });

    destinations.forEach((destination) => {
        it(`Cards: Should contain correct link for ${destination.title}`, () => {
            bookingPage.verifyDestinationLinkAttribute(destination.title, destination.url);
        });
    });
});

describe("Booking Page - Check Search Flows", () => {

    beforeEach(() => {
        bookingPage.visit();
        bookingPage.acceptCookies();
    });

    it("Search Flow: Should search for a one way trip, with no available trips", () => {
        bookingPage.performOneWaySearch(CITIES.NO_TRIP_DEPARTURE
            ,CITIES.DEPARTURE
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND);
        cy.get(MESSAGES.NO_TRIPS).should('contain.text', 'No luck, try another search.');    
    });

    it("Search Flow: Should search for a one way trip, with available trips", () => {
        bookingPage.performOneWaySearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND);
        cy.get(MESSAGES.JOURNEY_HEADER).should('contain.text', 'Select trip');
    });

    it("Search Flow: Should search for a return trip, with no available trips", () => {
        bookingPage.performRoundTripSearch(CITIES.NO_TRIP_DEPARTURE
            ,CITIES.DEPARTURE
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);
        cy.get(MESSAGES.NO_TRIPS).should('contain.text', 'No luck, try another search.');
    });

    it("Search Flow: Should search for a return trip, with available trips", () => {
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);
        cy.get(MESSAGES.JOURNEY_HEADER).should('contain.text', 'Select outbound trip');
    });

});