import { SELECTORS } from "../support/selectors";
import resultsPage from "../support/pages/resultsPage";
import bookingPage from "../support/pages/bookingPage";
import { CITIES, DATES } from '../support/testConstants';
import checkoutPage from "../support/pages/checkoutPage";

const TEST_PASSENGER = {
    firstName: 'QA Tester',
    lastName: 'Automation',
    email: 'qa.tester@test.com',
    invalidEmail: 'invalid-email-com',
};
function navigateToCheckoutFlowRoundTrip() {

    bookingPage.performRoundTripSearch(CITIES.DEPARTURE
        , CITIES.ARRIVAL
        , DATES.TARGET_MONTH
        , DATES.DAY_OUTBOUND
        , DATES.DAY_INBOUND);

    resultsPage.selectFirstAvailableTicket("Select outbound trip");
    resultsPage.selectFirstAvailableTicket("Select return trip");
    cy.url().should('include', '/checkout');
    cy.get(SELECTORS.CHECKOUT_PAGE.PASSENGER_DETAILS_HEADER).should('be.visible');
}


describe("Checkout Page - Check Form Validation", () => {

    beforeEach(() => {
        bookingPage.visit(SELECTORS.BOOKING_PAGE.URL);
        bookingPage.acceptCookies();
    });

    it("Validation: Should show 'Required field' error when First Name is empty", () => {
        navigateToCheckoutFlowRoundTrip();

        cy.get(SELECTORS.CHECKOUT_PAGE.LAST_NAME_INPUT).type(TEST_PASSENGER.lastName);
        cy.get(SELECTORS.CHECKOUT_PAGE.EMAIL_INPUT).type(TEST_PASSENGER.email);
        cy.get(SELECTORS.CHECKOUT_PAGE.REPEAT_EMAIL_INPUT).type(TEST_PASSENGER.email);
        cy.wait(500);
        cy.get(SELECTORS.CHECKOUT_PAGE.SUBMIT_BUTTON).click();
        cy.contains('Required field').should('be.visible');
    });

    it("Validation: Should show 'Required field' error when Last Name is empty", () => {
        navigateToCheckoutFlowRoundTrip();

        cy.get(SELECTORS.CHECKOUT_PAGE.FIRST_NAME_INPUT).type(TEST_PASSENGER.lastName);
        cy.get(SELECTORS.CHECKOUT_PAGE.EMAIL_INPUT).type(TEST_PASSENGER.email);
        cy.get(SELECTORS.CHECKOUT_PAGE.REPEAT_EMAIL_INPUT).type(TEST_PASSENGER.email);
        cy.get(SELECTORS.CHECKOUT_PAGE.SUBMIT_BUTTON).click();
        cy.contains('Required field').should('be.visible');
    });

    it("Validation: Should show 'Required field' error when Email is empty", () => {
        navigateToCheckoutFlowRoundTrip();

        cy.get(SELECTORS.CHECKOUT_PAGE.FIRST_NAME_INPUT).type(TEST_PASSENGER.firstName);
        cy.get(SELECTORS.CHECKOUT_PAGE.LAST_NAME_INPUT).type(TEST_PASSENGER.lastName);
        cy.get(SELECTORS.CHECKOUT_PAGE.REPEAT_EMAIL_INPUT).type(TEST_PASSENGER.email);
        cy.get(SELECTORS.CHECKOUT_PAGE.SUBMIT_BUTTON).click();
        cy.contains('Required field').should('be.visible');
    });

    it("Validation: Should show format error when Email is invalid", () => {
        navigateToCheckoutFlowRoundTrip();

        checkoutPage.fillAllMandatoryFields(
            TEST_PASSENGER.firstName,
            TEST_PASSENGER.lastName,
            TEST_PASSENGER.invalidEmail
        );

        cy.get(SELECTORS.CHECKOUT_PAGE.SUBMIT_BUTTON).click();
        cy.contains('Required field').should('be.visible');
        cy.contains('Invalid Email').should('be.visible');
    });

    it("Content: Should check the Manage Bookings redrectioning link", () => {
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            , CITIES.ARRIVAL
            , DATES.TARGET_MONTH
            , DATES.DAY_OUTBOUND
            , DATES.DAY_INBOUND);

        resultsPage.selectFirstAvailableTicket("Select outbound trip");
        resultsPage.selectFirstAvailableTicket("Select return trip");
        cy.url().should('include', '/checkout');

        cy.get('[data-tag="manage-booking-button"]').should('be.visible').click();
        cy.url().should('include', '/login');
    });
});

describe("Checkout Page - Check Journey Data", () => {

    beforeEach(() => {
        bookingPage.visit(SELECTORS.BOOKING_PAGE.URL);
        bookingPage.acceptCookies();
    });

    it("Journey Details: Should verify that the checkout page displays correct journey details (One Way)", () => {
        bookingPage.performOneWaySearch(
            CITIES.DEPARTURE,
            CITIES.ARRIVAL,
            DATES.TARGET_MONTH,
            DATES.DAY_OUTBOUND
        );

        resultsPage.selectFirstAvailableTicket("Select trip");
        resultsPage.confirmJourneySelection();

        checkoutPage.selectOneWayTripInformation(
            CITIES.DEPARTURE,
            CITIES.ARRIVAL,
            DATES.DAY_OUTBOUND,
            DATES.TARGET_MONTH
        );
    });

    it("Journey Details: Should verify that the checkout page displays correct journey details (Round Trip)", () => {

        navigateToCheckoutFlowRoundTrip();

        checkoutPage.selectRoundTripInformation(
            CITIES.DEPARTURE,
            CITIES.ARRIVAL,
            DATES.DAY_OUTBOUND,
            DATES.DAY_INBOUND,
            DATES.TARGET_MONTH
        );


    });
});

describe("Checkout Page - Check Prices Data", () => {

    function cleanPrice(priceText) {
        return parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.'));
    };
    beforeEach(() => {
        bookingPage.visit(SELECTORS.BOOKING_PAGE.URL);
        bookingPage.acceptCookies();
    });

    it("Content: Should check if the currency displayed is consistent with the selection" , ()=> {
        
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            , CITIES.ARRIVAL
            , DATES.TARGET_MONTH
            , DATES.DAY_OUTBOUND
            , DATES.DAY_INBOUND);
        
        resultsPage.selectFirstAvailableTicket("Select outbound trip");
        resultsPage.selectFirstAvailableTicket("Select return trip");
        cy.url().should('include', '/checkout');
        checkoutPage.checkCurrencyExchange();
    })

    it("Price: Should capture result prices and verify the total final price summation in Checkout", function () {

        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            , CITIES.ARRIVAL
            , DATES.TARGET_MONTH
            , DATES.DAY_OUTBOUND
            , DATES.DAY_INBOUND);

        checkoutPage.captureTicketPriceAndSelect('outboundPrice', 'Select outbound trip', cleanPrice, resultsPage);
        checkoutPage.captureTicketPriceAndSelect('returnPrice', 'Select return trip', cleanPrice, resultsPage);

        cy.then(() => {
            const outboundPrice = this.outboundPrice;
            const returnPrice = this.returnPrice;

            const expectedTotal = (Cypress.env('ADD_ON_PRICE') || 0)
                + outboundPrice + returnPrice;
            checkoutPage.assertTotalTicketSum(expectedTotal, cleanPrice);
        });
    });

    it("Price: Should verify total price calculation with 2 passengers (4 tickets total)", function () {
        let unitTicketPrice = 0;
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            , CITIES.ARRIVAL
            , DATES.TARGET_MONTH
            , DATES.DAY_OUTBOUND
            , DATES.DAY_INBOUND);

        cy.wait(500);

        checkoutPage.validateTotalForMultiplePassengers(cleanPrice, resultsPage);
    });


    it("Price: Should verify total price calculation with 2 passengers and sports equipment", function () {
        
        const SPORTS_PRICE_SELECTOR = '[data-tag="extras-card-bicycle"] > .extras__card-content > [data-tag="seat-selection-card"] > .column > .extras__card-price > :nth-child(1) > span';
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);
        cy.wait(500);
         checkoutPage.prepareRoundTripUnitPriceAndAddPassenger(cleanPrice, resultsPage)
            .then(unitTicketPrice => { 
                
                cy.then(() => {
                    checkoutPage.captureAndAddExtraItem('sportsEquipmentPrice', SPORTS_PRICE_SELECTOR, 'Sports Equipment', cleanPrice);
                });
                
                cy.then(function() {
                    const sportsEquipmentPrice = this.sportsEquipmentPrice; 
                    const expectedTotal = (unitTicketPrice * 4) + sportsEquipmentPrice;
                    cy.log(`Expected Total: ${expectedTotal}`);
                    checkoutPage.assertTotalTicketSum(expectedTotal, cleanPrice);
                });
            });
    });


    it("Price: Should verify total price calculation with 2 passengers and TWO extra items", function() { 
        
        const SPORTS_PRICE_SELECTOR = '[data-tag="extras-card-bicycle"] > .extras__card-content > [data-tag="seat-selection-card"] > .column > .extras__card-price > :nth-child(1) > span';
        const LUGGAGE_PRICE_SELECTOR = '[data-tag="extras-card-luggage"] > .extras__card-content > [data-tag="seat-selection-card"] > .column > .extras__card-price > :nth-child(1) > span';
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);
        cy.wait(500);
        checkoutPage.prepareRoundTripUnitPriceAndAddPassenger(cleanPrice, resultsPage)
            .then(unitTicketPrice => { 
                
                checkoutPage.captureAndAddExtraItem('sportsEquipmentPrice', SPORTS_PRICE_SELECTOR, 'Sports Equipment', cleanPrice);
                checkoutPage.captureAndAddExtraItem('luggagePrice', LUGGAGE_PRICE_SELECTOR, 'Extra luggage', cleanPrice);
                
                cy.then(function() {
                    const sportsEquipmentPrice = this.sportsEquipmentPrice;
                    const luggagePrice = this.luggagePrice;

                    const expectedTotal = (unitTicketPrice * 4) + sportsEquipmentPrice + luggagePrice; 
                    
                    cy.log(`Expected Total (Base + Extras): ${expectedTotal}`);
                    checkoutPage.assertTotalTicketSum(expectedTotal, cleanPrice);
                });
            });
    });
});