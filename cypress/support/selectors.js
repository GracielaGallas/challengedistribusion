export const SELECTORS = {
   
    AUTO_COMPLETE_OPTION: '[data-tag="autocomplete-option"]',
    SEARCH_BUTTON: 'button[data-tag="search-button"]',
    PASSENGER_COUNT: 'span[data-tag="passenger-count"]',
    MODAL_CONTAINER: '[role="alertdialog"][data-tag="cookies-consent-modal"]',
    CLOSE_BUTTON_SELECTOR: '[data-tag="cookies-consent-apply"]',

    BOOKING_PAGE: {
        URL: 'https://book.distribusion.com/?retailerPartnerNumber=807197',
        ONE_WAY_RADIO: '[data-tag="ui-radio-oneWay"]',
        ROUND_TRIP_RADIO: '[data-tag="ui-radio-return"]',
        DATA_FIELD_DEPARTURE: '[data-tag="departure"]',
        DATA_FIELD_ARRIVAL: '[data-tag="arrival"]',
        DATE_PICKER_DEPARTURE: '.ui-date-picker__value',
        DATE_PICKER_RETURN: '#\:re\:-popup-menu > [data-tag="date-picker-input"]',
        DESTINATION_LINK_BASE: '[href="https://www.aerobus.fr/d/aeroport-paris-beauvais-porte-maillot?retailerPartnerNumber=807197&departureArea=FRPARPB&arrivalStation=FRPARABE"] > .ui-button-wrapper > .ui-button > .row > div',
        SEARCH_BUTTON_TEXT: 'Search',
    },

    RESULTS_PAGE: {
        JOURNEY_HEADER: '.journey-list__header-title',
        JOURNEY_PRICE_BUTTON: '[data-tag="footer-price-button"]', 
        JOURNEY_PRICE: '.journey-card__footer-price-total > span',
        OUTBOUND_JOURNEY_CARD: '[data-tag="connection-card"]',
        AFTERNOON_FILTER_LABEL: 'Afternoon (12:00 - 18:00)'
        
    },
    
    CHECKOUT_PAGE: {
        PASSENGER_DETAILS_HEADER: '[data-tag="passenger-details"]',
        ORDER_SUMMARY_CONTAINER: '[data-tag="order-summary"]',
        TOTAL_PRICE_VALUE: '[data-tag="price-total"] > div:last-child > span',
        FIRST_NAME_INPUT: '[data-tag="passenger-first-name"]',
        LAST_NAME_INPUT: '[data-tag="passenger-last-name"]',
        EMAIL_INPUT: '[data-tag="contact-email"]',
        REPEAT_EMAIL_INPUT: '[data-tag="contact-confirm-email"]',
        PAYMENT_CREDIT_CARD_TAB: '[data-tag="payment-method-card"]',
        PAYMENT_GOOGLE_PAY_TAB: '[data-tag="payment-method-google-pay"]',
        CONFIRM_PAYMENT_BUTTON: '[data-tag="confirm-payment-button"]',
        REQUIRED_FIELD_ERROR: '.ui-input-wrapper--error .validation-message',
        SUBMIT_BUTTON: '#gpay-button-online-api-id',
        ADD_PASSENGER_BUTTON: '[data-tag="font-icon-plus]"',
        ADD_SPORTS_BUTTON: '#\\:r3t\\: > [data-tag="counter-increase"] > .ui-button',
        SPORTS_PRICE_SELECTOR: '[data-tag="extras-card-bicycle"] > .extras__card-content > [data-tag="seat-selection-card"] > .column > .extras__card-price > :nth-child(1) > span',
        LUGGAGE_PRICE_SELECTOR: '[data-tag="extras-card-luggage"] > .extras__card-content > [data-tag="seat-selection-card"] > .column > .extras__card-price > :nth-child(1) > span',
        LUGGAGE_CLICK_SELECTOR: '#\\:r3u\\: > [data-tag="counter-increase"] > .ui-button > [data-tag="font-icon-plus"] > .font-icon__content',

        
    }
};