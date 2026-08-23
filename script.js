/**
 * ChronoUPSC — Interactive Historical Timeline & Revision Tool
 * JavaScript Logic & Storage Engine
 * 
 * Features:
 * - Isolated localStorage Data Layer
 * - Interactive Horizontal Timeline Engine with Zoom & Playback
 * - Search & Multi-filter Engine
 * - Revision Mode (Mask/Reveal)
 * - All Events Table View with Column Sorting
 * - Drag-and-Drop Chronology Quiz Mode
 */

// ==========================================
// 1. DATA LAYER (LOCALSTORAGE ABSTRACTION)
// ==========================================

const STORAGE_KEY = 'chrono_upsc_events_v1';

/**
 * Reads all events from localStorage.
 * Isolated function allowing future replacement with backend API call.
 * @returns {Array} List of event objects
 */
function getEvents() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to read from localStorage:', e);
        return [];
    }
}

/**
 * Saves all events to localStorage.
 * @param {Array} events Array of event objects
 */
function saveEvents(events) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

/**
 * Retrieves a single event by ID.
 * @param {string} id Unique identifier of event
 * @returns {Object|null} Event object or null
 */
function getEventById(id) {
    const events = getEvents();
    return events.find(evt => evt.id === id) || null;
}

/**
 * Adds a new event to localStorage.
 * @param {Object} eventData Raw form data (without ID)
 * @returns {Object} Newly created event with ID
 */
function addEvent(eventData) {
    const events = getEvents();
    const newEvent = {
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        year: parseInt(eventData.year, 10),
        name: eventData.name.trim(),
        person: eventData.person ? eventData.person.trim() : '',
        place: eventData.place ? eventData.place.trim() : '',
        category: eventData.category || 'Modern',
        importance: parseInt(eventData.importance, 10) || 3,
        description: eventData.description ? eventData.description.trim() : '',
        tags: Array.isArray(eventData.tags) ? eventData.tags : []
    };

    events.push(newEvent);
    saveEvents(events);
    return newEvent;
}

/**
 * Updates an existing event in localStorage.
 * @param {string} id Unique ID of target event
 * @param {Object} updatedData Updated fields
 * @returns {boolean} True if successfully updated
 */
function updateEvent(id, updatedData) {
    const events = getEvents();
    const index = events.findIndex(evt => evt.id === id);

    if (index === -1) return false;

    events[index] = {
        ...events[index],
        year: parseInt(updatedData.year, 10),
        name: updatedData.name.trim(),
        person: updatedData.person ? updatedData.person.trim() : '',
        place: updatedData.place ? updatedData.place.trim() : '',
        category: updatedData.category || 'Modern',
        importance: parseInt(updatedData.importance, 10) || 3,
        description: updatedData.description ? updatedData.description.trim() : '',
        tags: Array.isArray(updatedData.tags) ? updatedData.tags : []
    };

    saveEvents(events);
    return true;
}

/**
 * Deletes an event from localStorage.
 * @param {string} id Unique ID of event to delete
 * @returns {boolean} True if deleted
 */
function deleteEvent(id) {
    let events = getEvents();
    const initialLength = events.length;
    events = events.filter(evt => evt.id !== id);

    if (events.length !== initialLength) {
        saveEvents(events);
        return true;
    }
    return false;
}

/**
 * Pre-populates sample UPSC events if user requests a starter set.
 */
function seedSampleEvents() {
    const sampleEvents = [
        {
            id: 'evt_sample_1',
            year: -2500,
            name: 'Indus Valley Civilisation (Harappan Era)',
            person: 'Daya Ram Sahni, R.D. Banerji',
            place: 'Harappa & Mohenjo-daro',
            category: 'Ancient',
            importance: 5,
            description: 'Urban planning, bronze iconography, grid system, granaries, and maritime trade with Mesopotamia.',
            tags: ['GS1', 'Prelims']
        },
        {
            id: 'evt_sample_2',
            year: -261,
            name: 'Kalinga War',
            person: 'Emperor Ashoka',
            place: 'Kalinga (Odisha)',
            category: 'Ancient',
            importance: 5,
            description: 'Massive warfare led Emperor Ashoka to abandon Bherighosha for Dhammaghosha and embrace Buddhism.',
            tags: ['GS1', 'Prelims', 'Mains']
        },
        {
            id: 'evt_sample_3',
            year: 1526,
            name: 'First Battle of Panipat',
            person: 'Babur, Ibrahim Lodi',
            place: 'Panipat, Haryana',
            category: 'Medieval',
            importance: 5,
            description: 'Babur introduced gunpowder, field artillery, and Tulughma tactics, founding the Mughal Empire.',
            tags: ['GS1', 'Prelims']
        },
        {
            id: 'evt_sample_4',
            year: 1757,
            name: 'Battle of Plassey',
            person: 'Robert Clive, Siraj-ud-Daulah',
            place: 'Palashi, Bengal',
            category: 'Modern',
            importance: 5,
            description: 'British East India Company under Clive defeated the Nawab of Bengal, laying the foundation of British Rule in India.',
            tags: ['GS1', 'Prelims', 'Mains']
        },
        {
            id: 'evt_sample_5',
            year: 1789,
            name: 'Outbreak of French Revolution',
            person: 'Louis XVI, Maximilien Robespierre',
            place: 'Paris, France',
            category: 'World History',
            importance: 4,
            description: 'Storming of the Bastille; ideals of Liberty, Equality, and Fraternity shaped modern global democratic thought.',
            tags: ['GS1', 'Mains', 'Essay']
        },
        {
            id: 'evt_sample_6',
            year: 1857,
            name: 'Indian Revolt of 1857',
            person: 'Mangal Pandey, Rani Lakshmibai, Bahadur Shah II',
            place: 'Meerut & Delhi',
            category: 'Modern',
            importance: 5,
            description: 'First War of Indian Independence. Ended East India Company rule; British Crown took direct control via 1858 Act.',
            tags: ['GS1', 'Prelims', 'Mains']
        },
        {
            id: 'evt_sample_7',
            year: 1930,
            name: 'Dandi Salt March (Civil Disobedience)',
            person: 'Mahatma Gandhi',
            place: 'Sabarmati to Dandi, Gujarat',
            category: 'Modern',
            importance: 5,
            description: '240-mile march to break the salt tax law, sparking nationwide Civil Disobedience and mass participation of women.',
            tags: ['GS1', 'Prelims', 'Mains', 'Essay']
        },
        {
            id: 'evt_sample_8',
            year: 1947,
            name: 'Indian Independence & Partition',
            person: 'Jawaharlal Nehru, Lord Mountbatten',
            place: 'New Delhi',
            category: 'Modern',
            importance: 5,
            description: 'Indian Independence Act 1947 enacted. Nehru delivered "Tryst with Destiny" speech on midnight of Aug 15.',
            tags: ['GS1', 'Prelims', 'Mains']
        }
    ];

    saveEvents(sampleEvents);
}

// ==========================================
// 2. GLOBAL APP STATE & DOM REFERENCES
// ==========================================

const state = {
    currentView: 'timeline',     // 'timeline' | 'events' | 'quiz'
    searchQuery: '',
    categoryFilter: 'ALL',
    tagFilter: 'ALL',
    revisionMode: false,
    zoomLevel: 1.0,               // 0.5 to 2.0 scale factor
    isPlaying: false,
    playbackTimer: null,
    editingEventId: null,
    tableSortColumn: 'year',
    tableSortAsc: true,
    quizState: {
        items: [],
        correctOrder: [],
        active: false
    }
};

// DOM Cache
const elements = {
    // Nav Tabs
    tabTimeline: document.getElementById('tab-timeline'),
    tabEvents: document.getElementById('tab-events'),
    tabQuiz: document.getElementById('tab-quiz'),
    navEventCount: document.getElementById('nav-event-count'),

    // Views
    viewTimeline: document.getElementById('view-timeline'),
    viewEvents: document.getElementById('view-events'),
    viewQuiz: document.getElementById('view-quiz'),

    // Top Bar Controls
    globalSearch: document.getElementById('global-search'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    revisionToggle: document.getElementById('revision-toggle'),

    // Sidebar Form
    formTitle: document.getElementById('form-title'),
    editBadge: document.getElementById('edit-badge'),
    eventForm: document.getElementById('event-form'),
    eventId: document.getElementById('event-id'),
    eventYear: document.getElementById('event-year'),
    eventName: document.getElementById('event-name'),
    eventPerson: document.getElementById('event-person'),
    eventPlace: document.getElementById('event-place'),
    eventCategory: document.getElementById('event-category'),
    eventImportance: document.getElementById('event-importance'),
    eventDescription: document.getElementById('event-description'),
    btnSaveEvent: document.getElementById('btn-save-event'),
    btnResetForm: document.getElementById('btn-reset-form'),
    btnSeedData: document.getElementById('btn-seed-data'),
    starPicker: document.getElementById('star-picker'),

    // Filters
    categoryPills: document.querySelectorAll('.cat-pill'),
    tagFilter: document.getElementById('tag-filter'),

    // Timeline View Controls & Elements
    timelineWrapper: document.getElementById('timeline-wrapper'),
    timelineTrack: document.getElementById('timeline-track'),
    timelineNodesContainer: document.getElementById('timeline-nodes-container'),
    timelineEmptyState: document.getElementById('timeline-empty-state'),
    btnEmptyAdd: document.getElementById('btn-empty-add'),
    btnPlayTimeline: document.getElementById('btn-play-timeline'),
    playbackStatus: document.getElementById('playback-status'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    zoomLevelText: document.getElementById('zoom-level'),

    // Table View
    eventsTableBody: document.getElementById('events-table-body'),
    tableEmptyState: document.getElementById('table-empty-state'),
    tableSummaryCount: document.getElementById('table-summary-count'),

    // Quiz View
    quizNotEnoughEvents: document.getElementById('quiz-not-enough-events'),
    quizBoardArea: document.getElementById('quiz-board-area'),
    quizItemsList: document.getElementById('quiz-items-list'),
    btnSubmitQuiz: document.getElementById('btn-submit-quiz'),
    btnNewQuiz: document.getElementById('btn-new-quiz'),
    btnQuizSeed: document.getElementById('btn-quiz-seed'),
    quizResultCard: document.getElementById('quiz-result-card'),
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    resultScoreBadge: document.getElementById('result-score-badge'),
    resultMessage: document.getElementById('result-message'),
    givenOrderList: document.getElementById('given-order-list'),
    correctOrderList: document.getElementById('correct-order-list'),
    btnRetryQuiz: document.getElementById('btn-retry-quiz'),

    // Event Modal
    eventModal: document.getElementById('event-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    modalCategory: document.getElementById('modal-category'),
    modalImportance: document.getElementById('modal-importance'),
    modalYear: document.getElementById('modal-year'),
    modalEventName: document.getElementById('modal-event-name'),
    modalPersonWrapper: document.getElementById('modal-person-wrapper'),
    modalPerson: document.getElementById('modal-person'),
    modalPlaceWrapper: document.getElementById('modal-place-wrapper'),
    modalPlace: document.getElementById('modal-place'),
    modalDescription: document.getElementById('modal-description'),
    modalTags: document.getElementById('modal-tags'),
    revisionMaskOverlay: document.getElementById('revision-mask-overlay'),
    btnRevealDetails: document.getElementById('btn-reveal-details'),
    btnModalEdit: document.getElementById('btn-modal-edit'),
    btnModalDelete: document.getElementById('btn-modal-delete'),
    btnModalClose: document.getElementById('btn-modal-close')
};

// ==========================================
// 3. INITIALIZATION & ROUTING
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    renderAllViews();
}

/**
 * Binds DOM event listeners for navigation, forms, filters, and modals.
 */
function setupEventListeners() {
    // Navigation Tabs
    elements.tabTimeline.addEventListener('click', () => switchView('timeline'));
    elements.tabEvents.addEventListener('click', () => switchView('events'));
    elements.tabQuiz.addEventListener('click', () => switchView('quiz'));

    // Global Search
    elements.globalSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        elements.btnClearSearch.style.display = state.searchQuery ? 'block' : 'none';
        renderAllViews();
    });

    elements.btnClearSearch.addEventListener('click', () => {
        elements.globalSearch.value = '';
        state.searchQuery = '';
        elements.btnClearSearch.style.display = 'none';
        renderAllViews();
    });

    // Revision Mode Toggle
    elements.revisionToggle.addEventListener('change', (e) => {
        state.revisionMode = e.target.checked;
        document.body.classList.toggle('revision-mode', state.revisionMode);
        renderAllViews();
    });

    // Category Filter Pills
    elements.categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            elements.categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.categoryFilter = pill.getAttribute('data-cat');
            renderAllViews();
        });
    });

    // Tag Filter Select
    elements.tagFilter.addEventListener('change', (e) => {
        state.tagFilter = e.target.value;
        renderAllViews();
    });

    // Sidebar Form Submission
    elements.eventForm.addEventListener('submit', handleFormSubmit);

    // Form Reset Button
    elements.btnResetForm.addEventListener('click', resetForm);

    // Seed Sample Data Button
    elements.btnSeedData.addEventListener('click', () => {
        seedSampleEvents();
        renderAllViews();
        alert('✨ Sample UPSC history events loaded into your timeline!');
    });

    // Star Picker Interaction
    elements.starPicker.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const val = parseInt(e.target.getAttribute('data-value'), 10);
            elements.eventImportance.value = val;
            updateStarPickerVisuals(val);
        }
    });

    // Zoom Controls
    elements.btnZoomIn.addEventListener('click', () => adjustZoom(0.2));
    elements.btnZoomOut.addEventListener('click', () => adjustZoom(-0.2));
    elements.btnZoomReset.addEventListener('click', () => {
        state.zoomLevel = 1.0;
        updateZoomDisplay();
        renderTimeline();
    });

    // Playback Controls
    elements.btnPlayTimeline.addEventListener('click', toggleTimelinePlayback);

    // Empty state Add button
    elements.btnEmptyAdd.addEventListener('click', () => {
        elements.eventYear.focus();
    });

    // Table Column Sorting
    document.querySelectorAll('.events-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if (state.tableSortColumn === sortKey) {
                state.tableSortAsc = !state.tableSortAsc;
            } else {
                state.tableSortColumn = sortKey;
                state.tableSortAsc = true;
            }
            renderEventsTable();
        });
    });

    // Quiz Controls
    elements.btnSubmitQuiz.addEventListener('click', evaluateQuizScore);
    elements.btnNewQuiz.addEventListener('click', generateQuizChallenge);
    elements.btnQuizSeed.addEventListener('click', () => {
        seedSampleEvents();
        renderAllViews();
    });
    elements.btnRetryQuiz.addEventListener('click', () => {
        elements.quizResultCard.style.display = 'none';
        generateQuizChallenge();
    });

    // Modal Close
    elements.btnCloseModal.addEventListener('click', closeModal);
    elements.btnModalClose.addEventListener('click', closeModal);
    elements.eventModal.addEventListener('click', (e) => {
        if (e.target === elements.eventModal) closeModal();
    });

    // Modal Reveal Button (Revision Mode)
    elements.btnRevealDetails.addEventListener('click', () => {
        elements.revisionMaskOverlay.style.display = 'none';
    });

    // Modal Edit & Delete Action Buttons
    elements.btnModalEdit.addEventListener('click', () => {
        const id = elements.eventModal.getAttribute('data-active-event-id');
        closeModal();
        if (id) populateFormForEdit(id);
    });

    elements.btnModalDelete.addEventListener('click', () => {
        const id = elements.eventModal.getAttribute('data-active-event-id');
        if (id && confirm('Are you sure you want to delete this event?')) {
            deleteEvent(id);
            closeModal();
            renderAllViews();
        }
    });
}

/**
 * Switches the active main view panel (Timeline, Events Table, or Quiz).
 * @param {string} viewName 'timeline' | 'events' | 'quiz'
 */
function switchView(viewName) {
    state.currentView = viewName;

    // Update Nav Tabs
    elements.tabTimeline.classList.toggle('active', viewName === 'timeline');
    elements.tabEvents.classList.toggle('active', viewName === 'events');
    elements.tabQuiz.classList.toggle('active', viewName === 'quiz');

    // Update View Panels
    elements.viewTimeline.classList.toggle('active', viewName === 'timeline');
    elements.viewEvents.classList.toggle('active', viewName === 'events');
    elements.viewQuiz.classList.toggle('active', viewName === 'quiz');

    // Stop playback if leaving timeline view
    if (viewName !== 'timeline' && state.isPlaying) {
        stopTimelinePlayback();
    }

    // Trigger specific view renders
    if (viewName === 'quiz') {
        generateQuizChallenge();
    }
}

// ==========================================
// 4. FILTERING & SEARCH LOGIC
// ==========================================

/**
 * Filters all stored events using active search query, category, and tag filters.
 * Returns chronologically sorted array by year.
 * @returns {Array} Filtered and sorted event objects
 */
function getFilteredEvents() {
    let events = getEvents();

    // 1. Search Query Filter (Matches Name, Person, Place, Year, Description)
    if (state.searchQuery) {
        const q = state.searchQuery;
        events = events.filter(evt => {
            const yearStr = evt.year < 0 ? `${Math.abs(evt.year)} BC` : `${evt.year} AD`;
            return evt.name.toLowerCase().includes(q) ||
                   evt.person.toLowerCase().includes(q) ||
                   evt.place.toLowerCase().includes(q) ||
                   evt.description.toLowerCase().includes(q) ||
                   evt.year.toString().includes(q) ||
                   yearStr.toLowerCase().includes(q);
        });
    }

    // 2. Category Filter
    if (state.categoryFilter !== 'ALL') {
        events = events.filter(evt => evt.category === state.categoryFilter);
    }

    // 3. Tag Filter
    if (state.tagFilter !== 'ALL') {
        events = events.filter(evt => evt.tags && evt.tags.includes(state.tagFilter));
    }

    // 4. Auto Chronological Sort (Earliest to Latest)
    events.sort((a, b) => a.year - b.year);

    return events;
}

/**
 * Triggers re-rendering of UI components across views.
 */
function renderAllViews() {
    const totalCount = getEvents().length;
    elements.navEventCount.textContent = totalCount;

    renderTimeline();
    renderEventsTable();
}

// ==========================================
// 5. TIMELINE RENDERER & INTERACTION
// ==========================================

/**
 * Renders horizontal interactive timeline with zoom and collision-aware node positioning.
 */
function renderTimeline() {
    const filteredEvents = getFilteredEvents();
    elements.timelineNodesContainer.innerHTML = '';

    if (filteredEvents.length === 0) {
        elements.timelineEmptyState.style.display = 'block';
        elements.timelineTrack.style.width = '100%';
        return;
    }

    elements.timelineEmptyState.style.display = 'none';

    // Calculate Dynamic Timeline Width based on Event Count and Zoom Level
    const baseNodeWidth = 240 * state.zoomLevel;
    const totalTrackWidth = Math.max(1200, (filteredEvents.length + 1) * baseNodeWidth);
    elements.timelineTrack.style.width = `${totalTrackWidth}px`;

    // Render Event Nodes
    filteredEvents.forEach((evt, idx) => {
        // Calculate X coordinate along timeline track
        const leftPercent = ((idx + 0.5) / filteredEvents.length) * 100;
        const isTop = idx % 2 === 0;

        const nodeEl = document.createElement('div');
        nodeEl.className = `timeline-node ${isTop ? 'pos-top' : 'pos-bottom'}`;
        nodeEl.style.left = `${leftPercent}%`;
        nodeEl.setAttribute('data-id', evt.id);
        nodeEl.setAttribute('data-idx', idx);

        const yearLabel = evt.year < 0 ? `${Math.abs(evt.year)} BC` : `${evt.year} AD`;
        const starsHtml = '★'.repeat(evt.importance);
        const catClass = getCategoryCSSClass(evt.category);

        nodeEl.innerHTML = `
            <div class="node-card ${catClass}">
                <span class="node-year-badge">${yearLabel}</span>
                <h4 class="node-title" title="${escapeHTML(evt.name)}">${escapeHTML(evt.name)}</h4>
                <div class="node-meta">
                    <span class="node-stars">${starsHtml}</span>
                    ${evt.place ? `<span>• ${escapeHTML(evt.place)}</span>` : ''}
                </div>
            </div>
            <div class="node-dot"></div>
        `;

        nodeEl.addEventListener('click', () => {
            openEventModal(evt.id);
        });

        elements.timelineNodesContainer.appendChild(nodeEl);
    });
}

function adjustZoom(delta) {
    const newZoom = Math.min(2.2, Math.max(0.5, state.zoomLevel + delta));
    state.zoomLevel = parseFloat(newZoom.toFixed(1));
    updateZoomDisplay();
    renderTimeline();
}

function updateZoomDisplay() {
    elements.zoomLevelText.textContent = `${Math.round(state.zoomLevel * 100)}%`;
}

/**
 * Automated Timeline Playback Engine
 */
function toggleTimelinePlayback() {
    if (state.isPlaying) {
        stopTimelinePlayback();
    } else {
        startTimelinePlayback();
    }
}

function startTimelinePlayback() {
    const nodes = document.querySelectorAll('.timeline-node');
    if (nodes.length === 0) return;

    state.isPlaying = true;
    elements.btnPlayTimeline.innerHTML = '<span class="play-icon">⏸</span> Pause';
    elements.playbackStatus.style.display = 'inline-block';

    let currentIdx = 0;

    function step() {
        if (!state.isPlaying || currentIdx >= nodes.length) {
            stopTimelinePlayback();
            return;
        }

        // Highlight current node
        nodes.forEach(n => n.classList.remove('active-playback'));
        const activeNode = nodes[currentIdx];
        activeNode.classList.add('active-playback');

        // Scroll Timeline Container to center the node
        const nodeLeft = activeNode.offsetLeft;
        const containerWidth = elements.timelineWrapper.clientWidth;
        elements.timelineWrapper.scrollTo({
            left: nodeLeft - (containerWidth / 2),
            behavior: 'smooth'
        });

        currentIdx++;
        state.playbackTimer = setTimeout(step, 2500);
    }

    step();
}

function stopTimelinePlayback() {
    state.isPlaying = false;
    if (state.playbackTimer) clearTimeout(state.playbackTimer);
    elements.btnPlayTimeline.innerHTML = '<span class="play-icon">▶</span> Play Timeline';
    elements.playbackStatus.style.display = 'none';

    document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active-playback'));
}

// ==========================================
// 6. FORM & EDITING ENGINE
// ==========================================

function handleFormSubmit(e) {
    e.preventDefault();

    // Reset error states
    clearFormErrors();

    const yearVal = elements.eventYear.value.trim();
    const nameVal = elements.eventName.value.trim();

    let hasError = false;

    if (!yearVal || isNaN(yearVal)) {
        showFieldError('year', 'Valid year is required');
        hasError = true;
    }

    if (!nameVal) {
        showFieldError('name', 'Event name is required');
        hasError = true;
    }

    if (hasError) return;

    // Collect tags
    const checkedTags = Array.from(document.querySelectorAll('input[name="upsc-tag"]:checked'))
                             .map(cb => cb.value);

    const formData = {
        year: yearVal,
        name: nameVal,
        person: elements.eventPerson.value,
        place: elements.eventPlace.value,
        category: elements.eventCategory.value,
        importance: elements.eventImportance.value,
        description: elements.eventDescription.value,
        tags: checkedTags
    };

    if (state.editingEventId) {
        updateEvent(state.editingEventId, formData);
    } else {
        addEvent(formData);
    }

    resetForm();
    renderAllViews();
}

function populateFormForEdit(id) {
    const evt = getEventById(id);
    if (!evt) return;

    state.editingEventId = id;
    elements.formTitle.innerHTML = '<span class="form-icon">✏️</span> Edit Historical Event';
    elements.editBadge.style.display = 'inline-block';
    elements.btnSaveEvent.innerHTML = '<span class="btn-icon">💾</span> Update Event';

    elements.eventId.value = evt.id;
    elements.eventYear.value = evt.year;
    elements.eventName.value = evt.name;
    elements.eventPerson.value = evt.person || '';
    elements.eventPlace.value = evt.place || '';
    elements.eventCategory.value = evt.category;
    elements.eventImportance.value = evt.importance;
    elements.eventDescription.value = evt.description || '';

    updateStarPickerVisuals(evt.importance);

    // Populate tags
    document.querySelectorAll('input[name="upsc-tag"]').forEach(cb => {
        cb.checked = evt.tags && evt.tags.includes(cb.value);
    });

    // Scroll sidebar form into view
    elements.eventYear.focus();
}

function resetForm() {
    state.editingEventId = null;
    elements.formTitle.innerHTML = '<span class="form-icon">➕</span> Add Historical Event';
    elements.editBadge.style.display = 'none';
    elements.btnSaveEvent.innerHTML = '<span class="btn-icon">💾</span> Save Event';

    elements.eventForm.reset();
    elements.eventImportance.value = 3;
    updateStarPickerVisuals(3);
    clearFormErrors();
}

function updateStarPickerVisuals(rating) {
    const stars = elements.starPicker.querySelectorAll('.star');
    stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        star.classList.toggle('selected', val <= rating);
    });
}

function showFieldError(fieldKey, message) {
    const group = document.getElementById(`event-${fieldKey}`).closest('.form-group');
    const errSpan = document.getElementById(`error-${fieldKey}`);
    group.classList.add('has-error');
    if (errSpan) errSpan.textContent = message;
}

function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));
}

// ==========================================
// 7. EVENTS TABLE RENDERER
// ==========================================

function renderEventsTable() {
    let filteredEvents = getFilteredEvents();
    elements.eventsTableBody.innerHTML = '';

    if (filteredEvents.length === 0) {
        elements.tableEmptyState.style.display = 'block';
        elements.tableSummaryCount.textContent = 'Showing 0 events';
        return;
    }

    elements.tableEmptyState.style.display = 'none';
    elements.tableSummaryCount.textContent = `Showing ${filteredEvents.length} events`;

    // Apply Column Sort
    filteredEvents.sort((a, b) => {
        let valA = a[state.tableSortColumn];
        let valB = b[state.tableSortColumn];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return state.tableSortAsc ? -1 : 1;
        if (valA > valB) return state.tableSortAsc ? 1 : -1;
        return 0;
    });

    filteredEvents.forEach(evt => {
        const tr = document.createElement('tr');

        const yearLabel = evt.year < 0 ? `${Math.abs(evt.year)} BC` : `${evt.year} AD`;
        const starsHtml = '★'.repeat(evt.importance);

        const tagsHtml = evt.tags && evt.tags.length > 0 
            ? evt.tags.map(t => `<span class="tag-badge">${t}</span>`).join('') 
            : '<span class="text-muted">—</span>';

        tr.innerHTML = `
            <td><strong>${yearLabel}</strong></td>
            <td class="table-event-name"><strong>${escapeHTML(evt.name)}</strong></td>
            <td><span class="cat-badge ${evt.category}">${evt.category}</span></td>
            <td>${escapeHTML(evt.person) || '—'}</td>
            <td>${escapeHTML(evt.place) || '—'}</td>
            <td><span class="node-stars">${starsHtml}</span></td>
            <td>${tagsHtml}</td>
            <td class="text-right">
                <div class="table-actions">
                    <button class="btn btn-ghost btn-sm" onclick="openEventModal('${evt.id}')" title="View details">👁️</button>
                    <button class="btn btn-ghost btn-sm" onclick="populateFormForEdit('${evt.id}')" title="Edit">✏️</button>
                    <button class="btn btn-ghost btn-sm" onclick="handleTableDelete('${evt.id}')" title="Delete">🗑️</button>
                </div>
            </td>
        `;

        elements.eventsTableBody.appendChild(tr);
    });
}

function handleTableDelete(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        deleteEvent(id);
        renderAllViews();
    }
}

// ==========================================
// 8. CHRONOLOGY QUIZ ENGINE
// ==========================================

function generateQuizChallenge() {
    const allEvents = getEvents();
    elements.quizResultCard.style.display = 'none';

    if (allEvents.length < 4) {
        elements.quizNotEnoughEvents.style.display = 'block';
        elements.quizBoardArea.style.display = 'none';
        return;
    }

    elements.quizNotEnoughEvents.style.display = 'none';
    elements.quizBoardArea.style.display = 'block';

    // Pick 4-5 random unique events
    const quizCount = Math.min(5, allEvents.length);
    const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, quizCount);

    // Compute Correct Chronological Order (Earliest to Latest)
    state.quizState.correctOrder = [...selected].sort((a, b) => a.year - b.year);

    // Shuffle items for the user challenge
    state.quizState.items = [...selected].sort(() => 0.5 - Math.random());
    state.quizState.active = true;

    renderQuizCards();
}

function renderQuizCards() {
    elements.quizItemsList.innerHTML = '';

    state.quizState.items.forEach((evt, idx) => {
        const li = document.createElement('li');
        li.className = 'quiz-card';
        li.setAttribute('draggable', 'true');
        li.setAttribute('data-idx', idx);

        li.innerHTML = `
            <div class="card-left-grp">
                <span class="drag-handle">☰</span>
                <span class="item-index-badge">${idx + 1}</span>
                <div class="item-details">
                    <h4>${escapeHTML(evt.name)}</h4>
                    <p>${evt.category} ${evt.place ? '• ' + escapeHTML(evt.place) : ''}</p>
                </div>
            </div>
            <div class="item-controls">
                <button class="btn btn-ghost btn-sm" onclick="moveQuizItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} title="Move Up">▲</button>
                <button class="btn btn-ghost btn-sm" onclick="moveQuizItem(${idx}, 1)" ${idx === state.quizState.items.length - 1 ? 'disabled' : ''} title="Move Down">▼</button>
            </div>
        `;

        // Drag & Drop Listeners
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        elements.quizItemsList.appendChild(li);
    });
}

// Drag & Drop State
let dragSrcIndex = null;

function handleDragStart(e) {
    dragSrcIndex = parseInt(this.getAttribute('data-idx'), 10);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    const destIndex = parseInt(this.getAttribute('data-idx'), 10);

    if (dragSrcIndex !== null && dragSrcIndex !== destIndex) {
        // Swap items in state
        const item = state.quizState.items.splice(dragSrcIndex, 1)[0];
        state.quizState.items.splice(destIndex, 0, item);
        renderQuizCards();
    }
    return false;
}

function handleDragEnd() {
    this.classList.remove('dragging');
}

function moveQuizItem(fromIdx, direction) {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= state.quizState.items.length) return;

    const temp = state.quizState.items[fromIdx];
    state.quizState.items[fromIdx] = state.quizState.items[toIdx];
    state.quizState.items[toIdx] = temp;

    renderQuizCards();
}

function evaluateQuizScore() {
    const userItems = state.quizState.items;
    const correctItems = state.quizState.correctOrder;

    let score = 0;
    userItems.forEach((item, idx) => {
        if (item.id === correctItems[idx].id) {
            score++;
        }
    });

    const total = userItems.length;

    // Display Results
    elements.quizResultCard.style.display = 'block';
    elements.resultScoreBadge.textContent = `Score: ${score} / ${total}`;

    if (score === total) {
        elements.resultEmoji.textContent = '🏆';
        elements.resultTitle.textContent = 'Perfect Chronology!';
        elements.resultMessage.textContent = 'Outstanding! You correctly sequenced all historical events in exact order.';
    } else if (score >= total / 2) {
        elements.resultEmoji.textContent = '👍';
        elements.resultTitle.textContent = 'Good Effort!';
        elements.resultMessage.textContent = 'You have a solid grasp of chronology. Review the correct order below to polish your timeline memory.';
    } else {
        elements.resultEmoji.textContent = '📖';
        elements.resultTitle.textContent = 'Keep Revising!';
        elements.resultMessage.textContent = 'Don\'t worry! History revision takes practice. Review the correct order below.';
    }

    // Render lists comparison
    elements.givenOrderList.innerHTML = userItems.map((evt, i) => `
        <li style="color: ${evt.id === correctItems[i].id ? '#059669' : '#dc2626'};">
            ${escapeHTML(evt.name)} (${evt.year < 0 ? Math.abs(evt.year) + ' BC' : evt.year + ' AD'})
            ${evt.id === correctItems[i].id ? ' ✓' : ' ✗'}
        </li>
    `).join('');

    elements.correctOrderList.innerHTML = correctItems.map(evt => `
        <li>
            <strong>${evt.year < 0 ? Math.abs(evt.year) + ' BC' : evt.year + ' AD'}</strong> — ${escapeHTML(evt.name)}
        </li>
    `).join('');

    elements.quizResultCard.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 9. EVENT DETAILS MODAL
// ==========================================

function openEventModal(eventId) {
    const evt = getEventById(eventId);
    if (!evt) return;

    elements.eventModal.setAttribute('data-active-event-id', evt.id);

    // Populate Fields
    const yearLabel = evt.year < 0 ? `${Math.abs(evt.year)} BC` : `${evt.year} AD`;
    elements.modalYear.textContent = yearLabel;
    elements.modalEventName.textContent = evt.name;
    elements.modalCategory.textContent = evt.category;
    elements.modalCategory.className = `modal-category-badge cat-badge ${evt.category}`;
    elements.modalImportance.textContent = '★'.repeat(evt.importance);

    if (evt.person) {
        elements.modalPersonWrapper.style.display = 'flex';
        elements.modalPerson.textContent = evt.person;
    } else {
        elements.modalPersonWrapper.style.display = 'none';
    }

    if (evt.place) {
        elements.modalPlaceWrapper.style.display = 'flex';
        elements.modalPlace.textContent = evt.place;
    } else {
        elements.modalPlaceWrapper.style.display = 'none';
    }

    elements.modalDescription.textContent = evt.description || 'No detailed description provided.';

    // Tags
    if (evt.tags && evt.tags.length > 0) {
        elements.modalTags.innerHTML = evt.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
    } else {
        elements.modalTags.innerHTML = '<span class="text-muted">None</span>';
    }

    // Handle Revision Mode Masking inside modal
    if (state.revisionMode) {
        elements.revisionMaskOverlay.style.display = 'flex';
    } else {
        elements.revisionMaskOverlay.style.display = 'none';
    }

    elements.eventModal.style.display = 'flex';
    elements.eventModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    elements.eventModal.style.display = 'none';
    elements.eventModal.setAttribute('aria-hidden', 'true');
}

// Helper Utilities
function getCategoryCSSClass(cat) {
    switch (cat) {
        case 'Ancient': return 'cat-ancient';
        case 'Medieval': return 'cat-medieval';
        case 'Modern': return 'cat-modern';
        case 'World History': return 'cat-world';
        default: return 'cat-modern';
    }
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
