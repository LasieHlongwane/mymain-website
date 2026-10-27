document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================
    // MOBILE NAVIGATION
    // ==========================================================

    const button = document.getElementById('menu-button');
    const nav = document.getElementById('nav-menu');

    function close() {
        if (!button || !nav) {
            return;
        }

        nav.classList.remove('open');

        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open menu');
        button.textContent = '☰';
    }

    if (button && nav) {
        button.addEventListener('click', () => {
            const open = nav.classList.toggle('open');

            button.setAttribute('aria-expanded', String(open));

            button.setAttribute(
                'aria-label',
                open ? 'Close menu' : 'Open menu'
            );

            button.textContent = open ? '✕' : '☰';
        });

        nav.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', close);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                close();
            }
        });
    }

    // ==========================================================
    // DYNAMIC COPYRIGHT YEAR
    // ==========================================================

    const copyright = document.getElementById('copyright');

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} KALXA. All rights reserved.`;
    }

    // ==========================================================
    // KALXA LIVE STATISTICS
    // ==========================================================

    const statsEndpoint =
        'https://tickets.kalxa.co.za/api/public/stats';

    const statisticElements = {
        businesses_listed: [
            '[data-stat="businesses_listed"]',
            '[data-stat="businesses"]',
            '#businesses-listed',
            '#businesses-listed-count',
            '#business-count'
        ],

        events_published: [
            '[data-stat="events_published"]',
            '[data-stat="events"]',
            '#events-published',
            '#events-published-count',
            '#event-count'
        ]
    };

    // ==========================================================
    // FIND STATISTIC ELEMENTS
    // ==========================================================

    function findStatisticElements(selectors) {
        const elements = [];

        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (!elements.includes(element)) {
                    elements.push(element);
                }
            });
        });

        return elements;
    }

    // ==========================================================
    // FORMAT STATISTIC VALUES
    // ==========================================================

    function formatStatistic(value) {
        return new Intl.NumberFormat().format(value);
    }

    // ==========================================================
    // UPDATE STATISTIC ELEMENTS
    // ==========================================================

    function updateStatistic(statisticName, value) {
        const selectors = statisticElements[statisticName];

        if (!selectors) {
            console.warn(
                `KALXA: No selectors configured for ${statisticName}.`
            );

            return;
        }

        const elements = findStatisticElements(selectors);

        console.info(
            `KALXA: ${statisticName} elements found:`,
            elements.length
        );

        if (elements.length === 0) {
            console.warn(
                `KALXA: No HTML elements found for ${statisticName}.`,
                selectors
            );

            return;
        }

        elements.forEach((element) => {
            element.textContent = formatStatistic(value);
        });

        console.info(
            `KALXA: Updated ${statisticName} to ${value}.`
        );
    }

    // ==========================================================
    // FETCH AND DISPLAY LIVE STATISTICS
    // ==========================================================

    async function loadLiveStatistics() {
        console.info('KALXA: Loading live statistics...');
        console.info('KALXA: Statistics endpoint:', statsEndpoint);

        try {
            const response = await fetch(statsEndpoint, {
                method: 'GET',

                headers: {
                    Accept: 'application/json'
                },

                cache: 'no-store'
            });

            console.info(
                'KALXA: Statistics HTTP status:',
                response.status
            );

            if (!response.ok) {
                throw new Error(
                    `Statistics request failed: HTTP ${response.status}`
                );
            }

            const data = await response.json();

            console.info('KALXA: Statistics API response:', data);

            // --------------------------------------------------
            // VALIDATE API RESPONSE
            // --------------------------------------------------

            if (
                !data ||
                typeof data !== 'object' ||
                Array.isArray(data)
            ) {
                throw new Error(
                    'The statistics API returned an invalid response.'
                );
            }

            // --------------------------------------------------
            // UPDATE BUSINESS COUNT
            // --------------------------------------------------

            if (
                Number.isSafeInteger(data.businesses_listed) &&
                data.businesses_listed >= 0
            ) {
                updateStatistic(
                    'businesses_listed',
                    data.businesses_listed
                );
            } else {
                console.warn(
                    'KALXA: businesses_listed is missing or invalid.',
                    data.businesses_listed
                );
            }

            // --------------------------------------------------
            // UPDATE PUBLISHED EVENT COUNT
            // --------------------------------------------------

            if (
                Number.isSafeInteger(data.events_published) &&
                data.events_published >= 0
            ) {
                updateStatistic(
                    'events_published',
                    data.events_published
                );
            } else {
                console.warn(
                    'KALXA: events_published is missing or invalid.',
                    data.events_published
                );
            }

            console.info(
                'KALXA: Live statistics loading completed.'
            );

        } catch (error) {
            console.error(
                'KALXA: Unable to load live statistics.',
                error
            );

            console.error(
                'KALXA: Check whether main.js loaded correctly, ' +
                'whether the API is reachable, and whether its ' +
                'CORS settings allow requests from about.kalxa.co.za.'
            );
        }

        // ------------------------------------------------------
        // DIAGNOSTIC INFORMATION
        // ------------------------------------------------------

        console.info(
            'KALXA: Businesses HTML element:',
            document.querySelector('[data-stat="businesses"]')
        );

        console.info(
            'KALXA: Events HTML element:',
            document.querySelector('[data-stat="events"]')
        );
    }

    // ==========================================================
    // START LIVE STATISTICS
    // ==========================================================

    loadLiveStatistics();
});
