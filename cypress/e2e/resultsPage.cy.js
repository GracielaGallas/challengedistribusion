import resultsPage from '../support/pages/resultsPage';
import bookingPage from '../support/pages/bookingPage';
import { CITIES, DATES } from '../support/testConstants';
import { SELECTORS } from '../support/selectors';


describe("Results Page - Check Content", () => {

    beforeEach(() => {
        bookingPage.visit();
        bookingPage.acceptCookies();

    });

    it("Content: Should verify the departure and arrival cities are displayed correctly in the header", () => {
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.contains(CITIES.DEPARTURE).should('be.visible');
        cy.contains(CITIES.ARRIVAL).should('be.visible');
        cy.contains(`${DATES.DAY_OUTBOUND} Jan`).should('be.visible');
    });

    it("Content: Should verify the departure and return dates are displayed correctly", () => {
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.contains(`${DATES.DAY_OUTBOUND} Jan`).should('be.visible');
        cy.contains(`${DATES.DAY_INBOUND} Jan`).should('be.visible');
    });
});

describe("Results Page - Check Filters", () => {

    beforeEach(() => {
        bookingPage.visit();
        bookingPage.acceptCookies();

    });

    it("Filters: Should verify filters and interact with Morning time filter", () => {
        const MORNING_FILTER_LABEL = 'Morning (06:00 - 12:00)';

        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_HEADER, { timeout: 20000 }).should('be.visible');
        cy.contains('Direct only').should('be.visible');
        cy.contains(MORNING_FILTER_LABEL).click();
        cy.wait(1000);

        cy.get(SELECTORS.RESULTS_PAGE.OUTBOUND_JOURNEY_CARD).eq(1);
        cy.get('.journey-card__body-time').first().invoke('text').then((timeString) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            const timeValue = hours + (minutes / 60);
            expect(timeValue).to.be.at.least(6, 'The time must be 06:00 or later (Start of Morning).');
            expect(timeValue).to.be.below(12, 'The time must be before 12:00 (End of Morning).');
        });
        cy.contains(MORNING_FILTER_LABEL)
            .closest('div')
            .find('input[type="checkbox"], input[type="radio"]')
            .should('be.checked');
    });

    it("Filters: Should verify filters and interact with Afternoon time filter", () => {

        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_HEADER, { timeout: 20000 }).should('be.visible');
        cy.contains('Direct only').should('be.visible');
        cy.contains(SELECTORS.RESULTS_PAGE.AFTERNOON_FILTER_LABEL).click();
        cy.wait(1000);

        cy.get(SELECTORS.RESULTS_PAGE.OUTBOUND_JOURNEY_CARD).eq(2);
        cy.get('.journey-card__body-time').first().invoke('text').then((timeString) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            const timeValue = hours + (minutes / 60);
            expect(timeValue).to.be.at.least(12, 'The time must be 12:00 or later (Start of Afternoon).');
            expect(timeValue).to.be.below(18, 'The time must be before 18:00 (End of Afternoon).');
        });
        cy.contains(SELECTORS.RESULTS_PAGE.AFTERNOON_FILTER_LABEL)
            .closest('div')
            .find('input[type="checkbox"], input[type="radio"]')
            .should('be.checked');
    });

    it("Filters: Should reset filters and return to the original earliest trip", () => {
        const DEPARTURE_TIME_SELECTOR = '.journey-card__body-time';
        const RESET_BUTTON_TEXT = 'Clear filters';


        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_HEADER, { timeout: 20000 }).should('be.visible');
        cy.contains(SELECTORS.RESULTS_PAGE.AFTERNOON_FILTER_LABEL).click();
        cy.contains(SELECTORS.RESULTS_PAGE.AFTERNOON_FILTER_LABEL)
            .closest('div').find('input[type="checkbox"], input[type="radio"]').should('be.checked');
        cy.contains(RESET_BUTTON_TEXT).click();
        cy.contains(SELECTORS.RESULTS_PAGE.AFTERNOON_FILTER_LABEL)
            .closest('div').find('input[type="checkbox"], input[type="radio"]').should('not.be.checked');

        cy.get(SELECTORS.RESULTS_PAGE.OUTBOUND_JOURNEY_CARD).first()
            .find(DEPARTURE_TIME_SELECTOR)
            .invoke('text').then((timeString) => {
                const [hours, minutes] = timeString.split(':').map(Number);
                const timeValue = hours + (minutes / 60);
                expect(timeValue).to.be.below(12, 'The earliest trip time was not restored after clicking Reset (Expected time < 12:00).');
            });
    });

    it("Filters: Should display 'No luck, try another search.' after applying a restrictive filter", () => {
        const DAWN_FILTER_LABEL = 'Dawn (00:00 - 06:00)';
        const NO_RESULTS_MESSAGE = 'No luck, try another search.';

        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_HEADER, { timeout: 20000 }).should('be.visible');

        cy.contains(DAWN_FILTER_LABEL).click();
        cy.contains(NO_RESULTS_MESSAGE).should('be.visible');
        cy.get(SELECTORS.RESULTS_PAGE.OUTBOUND_JOURNEY_CARD).should('not.exist');
    });
});

describe("Results Page - Check Navigation", () => {

    beforeEach(() => {
        bookingPage.visit();
        bookingPage.acceptCookies();

    });

    it("Navigation: Should correctly go back to the home page and clear fields", () => {

        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.get(SELECTORS.RESULTS_PAGE.JOURNEY_HEADER).should('be.visible');

        cy.go('back');

        cy.url().should('not.include', '/result');
        cy.url().should('include', 'retailerPartnerNumber');
        cy.get(SELECTORS.BOOKING_PAGE.DATA_FIELD_DEPARTURE).should('have.value', '');
        cy.get(SELECTORS.BOOKING_PAGE.DATA_FIELD_ARRIVAL).should('have.value', '');

    });

    it("Navigation: Should handle invalid/past departure date in URL by returning to Home or showing error", () => {
        const INVALID_DEPARTURE_DATE = '2024-01-01';
        const BASE_RESULT_URL = 'https://book.distribusion.com/result?retailerPartnerNumber=807197&locale=en&currency=EUR';
        const INVALID_URL = `${BASE_RESULT_URL}&departureDate=${INVALID_DEPARTURE_DATE}&returnDate=2026-02-05&departureArea=FRPARPB&arrivalStation=FRPARPNU`;

        cy.visit(INVALID_URL);
        cy.url().then((url) => {
            if (url.includes('/result')) {
                cy.contains('Oops, an unexpected error happened! Please wait a few minutes before you try again').should('be.visible');
            } else {
                cy.url().should('include', 'retailerPartnerNumber');
                cy.contains('The date is invalid').should('be.visible');
            }
        });
        cy.url().should('not.include', '/checkout');
    });
});

describe("Results Page - Check Flows", () => {

    beforeEach(() => {
        bookingPage.visit();
        bookingPage.acceptCookies();

    });

    it("Flow: Should select a trip one way and select to buy the first available ticket", () => {
        bookingPage.performOneWaySearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND);
        resultsPage.selectFirstAvailableTicket("Select trip");
        resultsPage.confirmJourneySelection();
    });

    it("Flow: Should select a round trip and complete selection to reach checkout", () => {

        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);
            
        resultsPage.selectFirstAvailableTicket("Select outbound trip");
        resultsPage.selectFirstAvailableTicket("Select return trip");
        resultsPage.confirmJourneySelection();
    });

    it("Interaction: Should expand and collapse the journey card details", () => {
        const DETAILS_BUTTON_TEXT = 'Details';
        
        bookingPage.performRoundTripSearch(CITIES.DEPARTURE
            ,CITIES.ARRIVAL
            ,DATES.TARGET_MONTH
            ,DATES.DAY_OUTBOUND
            ,DATES.DAY_INBOUND);

        cy.get(SELECTORS.RESULTS_PAGE.OUTBOUND_JOURNEY_CARD, { timeout: 10000 }).first().as('firstCard');

        cy.get('@firstCard').contains(DETAILS_BUTTON_TEXT).click();
        cy.contains('The ticket cannot be refunded.').should('be.visible');

        cy.get('@firstCard').contains(DETAILS_BUTTON_TEXT).click();

        cy.get('body').should('not.contain', 'The ticket cannot be refunded.');
    });

});