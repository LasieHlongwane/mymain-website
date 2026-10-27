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
    // FETCH AND DISPLAY LIVE STATISTICS
    // ==========================================================

    async function loadLiveStatistics() {
        console.info('KALXA: Loading live statistics...');

        try {
            const response = await fetch(statsEndpoint, {
                method: 'GET',

                headers: {
                    Accept: 'application/json'
                },

                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(
                    `Statistics request failed: HTTP ${response.status}`
                );
            }

            const data = await response.json();

            console.info('KALXA: Statistics API response:', data);

            // --------------------------------------------------
            // UPDATE BUSINESS COUNT
            // --------------------------------------------------

            if (
                Number.isSafeInteger(data.businesses_listed) &&
                data.businesses_listed >= 0
            ) {
                const businessElements = findStatisticElements(
                    statisticElements.businesses_listed
                );

                console.info(
                    'KALXA: Business statistic elements found:',
                    businessElements.length
                );

                businessElements.forEach((element) => {
                    element.textContent = formatStatistic(
                        data.businesses_listed
                    );
                });
            } else {
                console.warn(
                    'KALXA: businesses_listed is missing or invalid.'
                );
            }

            // --------------------------------------------------
            // UPDATE PUBLISHED EVENT COUNT
            // --------------------------------------------------

            if (
                Number.isSafeInteger(data.events_published) &&
                data.events_published >= 0
            ) {
                const eventElements = findStatisticElements(
                    statisticElements.events_published
                );

                console.info(
                    'KALXA: Event statistic elements found:',
                    eventElements.length
                );

                eventElements.forEach((element) => {
                    element.textContent = formatStatistic(
                        data.events_published
                    );
                });
            } else {
                console.warn(
                    'KALXA: events_published is missing or invalid.'
                );
            }

        } catch (error) {
            console.error(
                'KALXA: Unable to load live statistics. Check the API request and browser console.',
                error
            );
        }
    }

    // Load statistics without blocking the rest of the page.
    loadLiveStatistics();
});
