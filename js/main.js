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
                'CORS settings allow requests from your website.'
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
    // GOOGLE SHEETS TESTIMONIAL API
    // ==========================================================

    const testimonialsEndpoint =
        'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnQjq85wEVCkqh4O9atw8H4X7PJa6Jm2YgtjqwaFqzCjE-XdCCIk-dBCU_9RGOqjAMwdV6Vu6wWoQsQ5mn3CztE21Mo892n9mc7ec5aFFJCzUq1CrQmRK2RGfUxRefQbpwU1WJ22GKInObRppmghXVdxfwMzq9tbsCmB4n5Ge_zresFc2T-ptgSAchSYoav7Sz87nB_Z0tk5ShZL8a-VcbRVDjhqZDbwsTMR56_0QkOSwtE8YzzipvzqvXcHYFRZhnGCWOwMN2lbvNHprMeI849SDTwNHw&lib=MRBdWsOZr_6DES3iLlLiWdCaafHqaPnAP';

    // ==========================================================
    // TESTIMONIAL HTML ELEMENTS
    // ==========================================================

    const testimonialsTrack =
        document.getElementById('testimonials-track');

    const testimonialsLoading =
        document.getElementById('testimonials-loading');

    const testimonialsEmpty =
        document.getElementById('testimonials-empty');

    const testimonialsError =
        document.getElementById('testimonials-error');

    const testimonialsControls =
        document.getElementById('testimonials-controls');

    // ==========================================================
    // SHOW TESTIMONIAL STATUS MESSAGE
    // ==========================================================

    function showTestimonialMessage(elementToShow) {
        const messages = [
            testimonialsLoading,
            testimonialsEmpty,
            testimonialsError
        ];

        messages.forEach((element) => {
            if (element) {
                element.hidden = element !== elementToShow;
            }
        });
    }

    // ==========================================================
    // CONVERT GOOGLE DRIVE PHOTO LINKS
    // ==========================================================

    function getTestimonialPhotoUrl(photoValue) {
        if (!photoValue || typeof photoValue !== 'string') {
            return '';
        }

        const photo = photoValue.trim();

        if (!photo) {
            return '';
        }

        try {
            const url = new URL(photo);

            // Only accept HTTPS URLs.
            if (url.protocol !== 'https:') {
                return '';
            }

            // Convert Google Drive file links to thumbnail links.
            if (
                url.hostname === 'drive.google.com' ||
                url.hostname === 'www.drive.google.com'
            ) {
                let fileId = url.searchParams.get('id');

                if (!fileId) {
                    const match = url.pathname.match(
                        /\/file\/d\/([^/]+)/
                    );

                    if (match) {
                        fileId = match[1];
                    }
                }

                if (fileId) {
                    return (
                        'https://drive.google.com/thumbnail' +
                        '?id=' + encodeURIComponent(fileId) +
                        '&sz=w800'
                    );
                }
            }

            return url.href;

        } catch (error) {
            console.warn(
                'KALXA: Invalid testimonial photo URL.',
                error
            );

            return '';
        }
    }

    // ==========================================================
    // CREATE TESTIMONIAL PHOTO
    // ==========================================================

    function createTestimonialPhoto(photoUrl, personName) {
        if (!photoUrl) {
            return null;
        }

        const image = document.createElement('img');

        image.className = 'testimonial-photo';
        image.src = photoUrl;
        image.alt = personName
            ? `Photo shared by ${personName}`
            : 'Photo shared with a KALXA testimonial';

        image.loading = 'lazy';
        image.decoding = 'async';
        image.referrerPolicy = 'no-referrer';

        image.addEventListener('error', () => {
            console.warn(
                'KALXA: A testimonial photo could not be loaded.'
            );

            image.remove();
        }, { once: true });

        return image;
    }

    // ==========================================================
    // CREATE TESTIMONIAL STAR DISPLAY
    // ==========================================================

    function createTestimonialStars() {
        const stars = document.createElement('div');

        stars.className = 'testimonial-stars';
        stars.setAttribute(
            'aria-label',
            'Community testimonial'
        );

        // These are decorative stars, not a customer rating.
        // No star rating was collected by the Google Form.
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');

            star.className = 'fa-regular fa-star';
            star.setAttribute('aria-hidden', 'true');

            stars.appendChild(star);
        }

        return stars;
    }

    // ==========================================================
    // CREATE A TESTIMONIAL CARD
    // ==========================================================

    function createTestimonialCard(testimonial) {
        const card = document.createElement('article');

        card.className = 'testimonial-card';

        const name =
            typeof testimonial.name === 'string'
                ? testimonial.name.trim()
                : '';

        const respondentType =
            typeof testimonial.respondent_type === 'string'
                ? testimonial.respondent_type.trim()
                : '';

        const testimonialText =
            typeof testimonial.testimonial === 'string'
                ? testimonial.testimonial.trim()
                : '';

        const photoValue =
            typeof testimonial.photo === 'string'
                ? testimonial.photo.trim()
                : '';

        // ------------------------------------------------------
        // PHOTO
        // ------------------------------------------------------

        const photoUrl = getTestimonialPhotoUrl(photoValue);

        const photo = createTestimonialPhoto(photoUrl, name);

        if (photo) {
            card.appendChild(photo);
        }

        // ------------------------------------------------------
        // DECORATIVE STARS
        // ------------------------------------------------------

        card.appendChild(createTestimonialStars());

        // ------------------------------------------------------
        // TESTIMONIAL TEXT
        // ------------------------------------------------------

        const quote = document.createElement('p');

        quote.className = 'testimonial-quote';

        quote.textContent = testimonialText;

        card.appendChild(quote);

        // ------------------------------------------------------
        // AUTHOR INFORMATION
        // ------------------------------------------------------

        const author = document.createElement('div');

        author.className = 'testimonial-author';

        const authorName = document.createElement('strong');

        authorName.textContent = name || 'KALXA Community Member';

        author.appendChild(authorName);

        if (respondentType) {
            const authorType = document.createElement('span');

            authorType.textContent = respondentType;

            author.appendChild(authorType);
        }

        card.appendChild(author);

        return card;
    }

    // ==========================================================
    // UPDATE TESTIMONIAL CAROUSEL CONTROLS
    // ==========================================================

    function updateTestimonialCarousel() {
        if (!testimonialsTrack || !testimonialsControls) {
            return;
        }

        const cards = testimonialsTrack.querySelectorAll(
            '.testimonial-card'
        );

        const hasMultipleCards = cards.length > 1;

        testimonialsControls.hidden = !hasMultipleCards;

        if (!hasMultipleCards) {
            return;
        }

        const previousButton =
            testimonialsControls.querySelector(
                '[data-carousel-prev="testimonials-track"]'
            );

        const nextButton =
            testimonialsControls.querySelector(
                '[data-carousel-next="testimonials-track"]'
            );

        if (previousButton) {
            previousButton.disabled = false;
        }

        if (nextButton) {
            nextButton.disabled = false;
        }
    }

    // ==========================================================
    // LOAD APPROVED TESTIMONIALS
    // ==========================================================

    async function loadTestimonials() {
        if (!testimonialsTrack) {
            console.info(
                'KALXA: Testimonials section not found on this page.'
            );

            return;
        }

        if (
            !testimonialsEndpoint ||
            testimonialsEndpoint ===
                'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'
        ) {
            console.warn(
                'KALXA: Add the deployed Google Apps Script URL ' +
                'to testimonialsEndpoint in main.js.'
            );

            showTestimonialMessage(testimonialsError);

            if (testimonialsError) {
                testimonialsError.textContent =
                    'Community voices are temporarily unavailable. ' +
                    'Please check back later.';
            }

            return;
        }

        console.info('KALXA: Loading approved testimonials...');

        showTestimonialMessage(testimonialsLoading);

        try {
            const response = await fetch(testimonialsEndpoint, {
                method: 'GET',

                headers: {
                    Accept: 'application/json'
                },

                cache: 'no-store'
            });

            console.info(
                'KALXA: Testimonials HTTP status:',
                response.status
            );

            if (!response.ok) {
                throw new Error(
                    `Testimonials request failed: HTTP ${response.status}`
                );
            }

            const data = await response.json();

            console.info(
                'KALXA: Testimonials API response:',
                data
            );

            // --------------------------------------------------
            // HANDLE API ERRORS
            // --------------------------------------------------

            if (
                !data ||
                typeof data !== 'object' ||
                Array.isArray(data) && !Array.isArray(data)
            ) {
                throw new Error(
                    'The testimonials API returned an invalid response.'
                );
            }

            if (!Array.isArray(data)) {
                if (data.error) {
                    throw new Error(
                        String(data.error)
                    );
                }

                throw new Error(
                    'The testimonials API did not return a list.'
                );
            }

            // --------------------------------------------------
            // KEEP VALID TESTIMONIALS
            // --------------------------------------------------

            const validTestimonials = data.filter((item) => {
                return (
                    item &&
                    typeof item === 'object' &&
                    typeof item.testimonial === 'string' &&
                    item.testimonial.trim().length > 0
                );
            });

            // --------------------------------------------------
            // HANDLE EMPTY RESULTS
            // --------------------------------------------------

            if (validTestimonials.length === 0) {
                testimonialsTrack.replaceChildren();

                showTestimonialMessage(testimonialsEmpty);

                if (testimonialsControls) {
                    testimonialsControls.hidden = true;
                }

                console.info(
                    'KALXA: No approved testimonials to display.'
                );

                return;
            }

            // --------------------------------------------------
            // DISPLAY APPROVED TESTIMONIALS
            // --------------------------------------------------

            const fragment = document.createDocumentFragment();

            validTestimonials.forEach((testimonial) => {
                fragment.appendChild(
                    createTestimonialCard(testimonial)
                );
            });

            testimonialsTrack.replaceChildren(fragment);

            showTestimonialMessage(null);

            updateTestimonialCarousel();

            console.info(
                `KALXA: Displayed ${validTestimonials.length} testimonials.`
            );

        } catch (error) {
            console.error(
                'KALXA: Unable to load testimonials.',
                error
            );

            testimonialsTrack.replaceChildren();

            showTestimonialMessage(testimonialsError);

            if (testimonialsControls) {
                testimonialsControls.hidden = true;
            }
        }
    }

    // ==========================================================
    // TESTIMONIAL CAROUSEL NAVIGATION
    // ==========================================================

    document.querySelectorAll(
        '[data-carousel-prev="testimonials-track"]'
    ).forEach((previousButton) => {
        previousButton.addEventListener('click', () => {
            if (!testimonialsTrack) {
                return;
            }

            testimonialsTrack.scrollBy({
                left: -testimonialsTrack.clientWidth,
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll(
        '[data-carousel-next="testimonials-track"]'
    ).forEach((nextButton) => {
        nextButton.addEventListener('click', () => {
            if (!testimonialsTrack) {
                return;
            }

            testimonialsTrack.scrollBy({
                left: testimonialsTrack.clientWidth,
                behavior: 'smooth'
            });
        });
    });

    // ==========================================================
    // START LIVE STATISTICS
    // ==========================================================

    loadLiveStatistics();

    // ==========================================================
    // START COMMUNITY VOICES
    // ==========================================================

    loadTestimonials();
});
