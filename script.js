// Язык

let S = {};

const colorIcons = document.getElementById('color-icons');
const whenCalendar = document.getElementById('when-calendar');

const getColorStyle = (color) => `--inner: var(--inner-${color});--outer: var(--outer-${color})`

const setLanguage = () => {
    const language = navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
    document.documentElement.lang = language;
    S = translations[language];

    document.querySelectorAll('[data-i18n]').forEach(q => q.textContent = S[q.dataset.i18n]);
    document.querySelectorAll('[data-i18n-placeholder]').forEach(q => q.placeholder = S[q.dataset.i18nPlaceholder]);
    document.querySelectorAll('[data-i18n-title]').forEach(q => q.title = S[q.dataset.i18nTitle]);
    document.querySelectorAll('[data-i18n-aria-label]').forEach(q => q.setAttribute('aria-label', S[q.dataset.i18nAriaLabel]));

    whenCalendar.firstElementChild.innerHTML = S.wds.map(q => `<span>${q}</span>`).join('');

    colorIcons.innerHTML = Object.keys(S.colors).map(color =>
        `<button class="color" style="${getColorStyle(color)}" role="radio" aria-label="${color}"></button>`
    ).join('');
}

// Вычисление объема кала

let person;

const getBMR = () => {
    const {age, sex, weight} = person;
    if (sex) {
        if (age < 3) return 60.9 * weight - 54;
        if (age < 10) return 22.7 * weight + 495;
        if (age < 18) return 17.5 * weight + 651;
        if (age < 30) return 16.0 * weight + 545;
        if (age < 60) return 14.2 * weight + 593;
        return 13.5 * weight + 514;
    }
    if (age < 3) return 61.0 * weight - 51;
    if (age < 10) return 22.5 * weight + 499;
    if (age < 18) return 12.2 * weight + 746;
    if (age < 30) return 13.1 * weight + 558;
    if (age < 60) return 9.74 * weight + 694;
    return 10.1 * weight + 569;
}

const getStool = () => {
    const {age, sex} = person;
    if (age < 1) return 90;
    if (age < 2) return 60;
    if (age < 4) return 70;
    if (age < 6) return 80;
    if (age < 8) return 84;
    if (age < 10) return 88;
    if (age < 12) return 90;
    if (age < 14) return 95;
    if (age < 16) return 100;
    if (age < 18) return sex ? 120 : 110;
    if (age < 65) return sex ? 135 : 125;
    return sex ? 130 : 121
};

const getFiber = () => {
    const {age, sex} = person;
    if (age < 2) return 10;
    if (age < 3) return 13.5;
    if (age < 4) return 14.9;
    if (age < 5) return 16.1;
    if (age < 6) return 17.4;
    if (age < 7) return 18.6;
    if (age < 8) return 20.1;
    if (age < 9) return 21.8;
    if (age < 10) return 23.7;
    if (age < 12) return sex ? 28 : 25;
    if (age < 14) return sex ? 31 : 26;
    if (age < 19) return sex ? 38 : 26;
    if (age < 51) return sex ? 38 : 25;
    return sex ? 30 : 21;
};


const getFrequency = () => {
    const {age, sex} = person;
    if (age < 0.1) return 4;
    if (age < 0.5) return 3;
    if (age < 1) return 2;
    if (age < 3) return 1.5;
    if (age < 5) return 1.2;
    if (age < 10) return 1;
    return sex ? 1 : 0.9;
}

const defaultPerson = {
    sex: true,
    weight: 65,
    age: 25
};

let minVolume;
let maxVolume;

const setPersonVolume = () => {
    const fiber = 0.014 * getBMR() * 1.3;
    const volume = getStool() + 1.76 * (fiber - getFiber());
    person.volume = Math.max(30, Math.min(400, Math.round(volume / getFrequency())));
    minVolume = Math.max(20, Math.round(person.volume / 4));
    maxVolume = Math.min(500, Math.round(4 * person.volume));
};

const getVolume = i => {
    if (i <= 10) return minVolume;
    if (i < 50) return Math.round(person.volume + (i - 50) * (person.volume - minVolume) / 40);
    if (i === 50) return person.volume;
    if (i < 90) return Math.round(person.volume + (i - 50) * (maxVolume - person.volume) / 40);
    return maxVolume;
}

const getWeight = () => {
    const data = person.sex
        ? [
            [0, 3.3], [0.25, 6.4], [0.5, 7.9], [1, 9.6], [2, 12.2],
            [5, 19.5], [7, 24.1], [9, 30.5], [11, 40.5],
            [13, 55.2], [15, 66.2], [17, 74.0], [19, 72.3],
            [24.5, 83.7], [34.5, 87.1], [44.5, 88.5],
            [54.5, 87.8], [64.5, 87.0], [74.5, 86.6], [80, 80.0]
        ]
        : [
            [0, 3.2], [0.25, 5.8], [0.5, 7.3], [1, 8.9], [2, 11.5],
            [5, 18.2], [7, 24.4], [9, 31.4], [11, 43.2],
            [13, 52.3], [15, 57.1], [17, 59.7], [19, 63.7],
            [24.5, 68.9], [34.5, 75.0], [44.5, 74.8],
            [54.5, 78.5], [64.5, 74.3], [74.5, 71.7], [80, 65.7]
        ];
    const age = Math.max(0, Math.min(80, person.age));

    for (let i = 1; i < data.length; i++) {
        if (age <= data[i][0]) {
            const [a1, w1] = data[i - 1];
            const [a2, w2] = data[i];
            return +(w1 + (w2 - w1) * (age - a1) / (a2 - a1)).toFixed(1);
        }
    }

    return data.at(-1)[1];
};

// Состояние

let date = new Date();
let today = new Date(date);

const getDate = (date) => date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

const getDefaultRecord = () => ({
    pooped: getDate(date) === getDate(today) ? new Date() : date,
    bristol: 4,
    volume: 50,
    color: 'brown',
    tags: []
});


// Константы

const SCALES = {
    white: 6,
    gray: 4,
    yellow: 2.5,
    orange: 2,
    'light-brown': 1.5,
    brown: 1,
    'dark-brown': 1.5,
    black: 5,
    green: 3,
    red: 7
}

// Инструменты

const getTimeText = (date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const getDateText = (date) => date.getDate() + ' ' + S.mons[date.getMonth()];

// Состояние

// 2. Форма добавления

let record = getDefaultRecord();
let records = [];

let tags = [];

// Элементы

// const htmlElement = document.documentElement;

// const navigation = document.getElementById('navigation');

// Навигация

const pages = {
    calendar: document.getElementById("calendar-page"),
    record: document.getElementById('record-page'),
    stats: document.getElementById("stats-page"),
    person: document.getElementById("person-page")
};
let page = pages.calendar;

const nav = document.getElementById('nav');
const [calendarLink, recordLink] = nav.children;

let link = calendarLink

const toggle = () => {
    page.classList.toggle('hidden');
    link.classList.toggle('active');
    if (page === pages.record) {
        nav.parentElement.classList.add('hidden');
    } else if (page === pages.calendar) {
        nav.parentElement.classList.remove('hidden');
    }
}

nav.onclick = e => {
    const button = e.target.closest('button');
    if (!button || button === link) return;
    toggle();
    page = pages[button.dataset.page];
    link = button;
    if (page === pages.record) {
        record = getDefaultRecord();
        renderRecord();
    } else if (page === pages.stats) {
        renderRange();
        renderStats();
    } else if (page === pages.person) {
        renderPerson();
    }
    toggle();
}

const toCalendarPage = () => {
    toggle();
    page = pages.calendar;
    link = calendarLink;
    toggle();
}

const rejectAction = document.getElementById('reject');
const removeAction = document.getElementById('remove');
const approveAction = document.getElementById('approve')

// 1. Календарь

const calendar = document.getElementById('calendar');

let calendarDate = new Date(date);
let chosenButton;

const addPageMonth = (delta) => {
    const month = calendarDate.getMonth() + delta;
    const year = calendarDate.getFullYear();
    const m = (month + 12) % 12;
    const y = year + delta * (month !== m);
    calendarDate.setFullYear(y);
    calendarDate.setMonth(m);
}

calendar.addEventListener('click', e => {
    let button = e.target.closest('button');
    if (!button) return;
    if (button.id) {
        addPageMonth(button.id === 'prev' ? -1 : 1);
        return calendar.replaceChildren(getCalendarPage());
    }
    chosenButton.classList.remove('big');
    chosenButton = button.firstElementChild;

    date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), +chosenButton.innerText, 12);
    chosenButton.classList.add('big');

    if (!renderChosenRecords()) recordLink.click();
});

let calendarPages = {};

const getRecord = (date) => {
    const src = records.filter(({pooped, bristol}) => bristol && getDate(pooped) === date)
    if (!src.length) return null;

    if (src.length === 1) {
        const {color, volume, bristol} = src[0];
        return {color, volume, bristol, count: 1};
    }

    const colors = {};
    const bristols = {};

    const dst = {volume: 0, count: src.length};
    src.forEach(({color, volume, bristol}) => {
        colors[color] = (colors[color] || 0) + volume * SCALES[color];
        bristols[bristol] = (bristols[bristol] || 0) + volume * SCALES[color];
        dst.volume += volume;
    });

    let s = 0;
    for (const [color, scale] of Object.entries(colors)) {
        if (scale > s) {
            dst.color = color;
            s = scale;
        }
    }
    s = 0;
    for (const [bristol, scale] of Object.entries(bristols)) {
        if (scale > s) {
            dst.bristol = bristol;
            s = scale;
        }
    }
    return dst;
}

const getRecordStyle = (color, volume) => {
    const size = Math.min(64, 16 + 16 * volume / 50);
    return `width:${size}px;height:${size}px;background:var(--inner-${color})`;
}

const getRecordHtml = (
    {color, volume, count}
) => `<i style="${getRecordStyle(color, volume)}"></i><small>${count > 1 ? count : ''}</small>`;


const getCalendarPage = (delta = 0) => {
    const month = calendarDate.getMonth() + delta;
    const year = calendarDate.getFullYear();

    const m = (month + 12) % 12;
    const y = year + delta * (month !== m);

    const k = 100 * y + m;

    if (k in calendarPages) return calendarPages[k];

    const first = (new Date(y, m, 1).getDay() + 6) % 7;
    const last = new Date(y, m + 1, 0).getDate();

    const t = getDate(today);
    const c = getDate(date);

    const getClass = (d) => {
        if (d === c) return 'big';
        if (d > t) return 'gray';
        return '';
    }

    const dayHtml = (n) => {
        const d = getDate(new Date(y, m, n));
        const r = getRecord(d);
        return `<button><span class="${getClass(d)}">${n}</span>${r ? getRecordHtml(r) : ''}</button>`
    }

    let days = S.wds.map(d => `<span>${d}</span>`).join('') + '<button class="empty"></button>'.repeat(first);
    for (let i = 1; i <= last; i++) days += dayHtml(i);

    calendarPages[k] = document.createElement('DIV');
    calendarPages[k].className = 'calendar';
    calendarPages[k].innerHTML = `<h2 class="row">
        <button id="prev"><svg><use href="sprite.svg#prev"></use></svg></button>
        <span class="big">${S.months[m]} ${y}</span>
        <button id="next"><svg><use href="sprite.svg#next"></use></svg></button>
    </h2>
    <div class="days">${days}</div>`;

    return calendarPages[k];
}

const renderPageCalendar = () => {
    console.log('renderPageCalendar');
    calendar.replaceChildren(getCalendarPage());
    chosenButton = calendar.getElementsByClassName('big')[1];
}


// 1.1 Записи дня

const recordHtml = ({created, pooped, bristol, color, volume, tags}) => {
    volume = bristol ? S.volumes[Math.floor(volume / 20)] : '';
    color = bristol ? getColorStyle(color) : '--inner: var(--blue)';
    tags = tags.map(q => `<span class="small gray">${q}</span>`).join('');
    return `<button class="col" data-created="${created}">
        <div class="tags">${tags}</div>
        <div class="record">
            <div class="color" style="${color}"></div>
            <div>${S.brs[bristol]}</div>
            <span class="small gray right">${volume}</span>
            <span class="mono gray small">${getTimeText(pooped)}</span>
        </div>
    </button>`;
}

const chosenRecords = document.getElementById('chosen-records');
const chosenDay = document.getElementById('chosen-day');

const renderChosenRecords = () => {
    const d = getDate(date);
    chosenDay.innerText = date.getDate() + ' ' + S.mons[date.getMonth()];
    const src = records.filter(({pooped}) => getDate(pooped) === d).sort((a, b) => a.pooped - b.pooped);
    chosenRecords.innerHTML = src.length ? src.map(recordHtml).join('') : `<div class="small gray center">нет записей</div>`;
    return src.length > 0;
}

chosenRecords.onclick = e => {
    const button = e.target.closest('button');
    if (!button) return
    const created = +button.dataset.created;
    record = records.find(r => r.created === created);
    renderRecord();
    toggle();
    page = pages.record;
    link = recordLink;
    toggle();
}

// 1.1 Листание календаря

let startX = null;
let dragging = false;

let width = 0;
let delta = 0;
let shift = 0;
let minShift = 10;
let maxShift = 40;

const calendars = document.getElementById('calendars');

const renderCalendars = () => {
    width = calendar.clientWidth + 30;
    calendars.style.setProperty('--width', `${calendar.clientWidth}px`);

    calendars.replaceChildren(
        getCalendarPage(-1),
        getCalendarPage(),
        getCalendarPage(1)
    );
    calendar.replaceChildren(calendars);

    calendars.style.transition = 'none';
    calendars.style.transform = `translateX(-${width}px)`;
};

calendars.addEventListener('transitionend', () => {
    addPageMonth(delta);
    calendar.replaceChildren(getCalendarPage());
});

calendar.addEventListener('pointerdown', e => {
    startX = e.clientX;
    delta = 0;
    dragging = false;
});

calendar.addEventListener('pointermove', e => {
    if (startX === null) return;

    shift = e.clientX - startX;

    if (!dragging) {
        if (Math.abs(shift) < minShift) return;
        dragging = true;

        delta = shift > 0 ? -1 : 1;
        startX -= delta * minShift;
        shift += delta * minShift;

        renderCalendars();
        calendar.setPointerCapture(e.pointerId);
    }
    calendars.style.transform = `translateX(${shift - width}px)`;
});

const stopDragging = () => {
    if (startX === null) return;
    startX = null;

    if (!dragging) return;
    dragging = false;

    startX = null;

    delta = 0;
    if (Math.abs(shift) > maxShift) delta = shift > 0 ? -1 : 1;

    calendars.style.transition = `transform 0.2s ease`;
    calendars.style.transform = `translateX(-${width + delta * width}px)`;
};

calendar.addEventListener('pointerup', stopDragging);
calendar.addEventListener('pointercancel', stopDragging);


// 2. Форма добавления

const poopedDate = document.getElementById('pooped-date');
const poopedTime = document.getElementById('pooped-time');
const colorLabel = document.getElementById('color-label');

const bristolIcons = document.getElementById('bristol-icons');
const bristolLabel = document.getElementById('bristol-label');

const volumeLabel = document.getElementById('volume-label');
const volumeRange = document.getElementById('volume-range');
const volumeValue = document.getElementById('volume-value');

const tagButtons = document.getElementById('tag-buttons');
const tagActions = document.getElementById('tag-actions');
const tagsEditor = document.getElementById('tags-editor');
const editTagsButton = document.getElementById('edit-tags');
const createTagButton = document.getElementById('create-tag');
const tagInput = document.getElementById('tag');

const closeTags = document.getElementById('close-tags');
const applyTags = document.getElementById('apply-tags');

const overlay = document.getElementById('overlay');


approveAction.onclick = (e) => {
    console.log('approveAction');
    e.preventDefault();
    record.tags = [...tagButtons.querySelectorAll('.selected')].map(q => q.innerText);

    if (record.created) {
        const i = records.indexOf(({created}) => created === record.created);
        records[i] = record;
    } else {
        record.created = new Date().getTime();
        records.push(record);
    }
    saveRecord();
    renderChosenRecords();
    calendarPages = {};
    renderPageCalendar();
    toCalendarPage();
}

let changed;

const handleChange = () => {
    if (!changed) {
        console.log('handleChange');
        changed = true;
        approveAction.classList.remove('hidden');
    }
}


// 1. Бристоль

const volumeSection = document.getElementById('volume');
const colorSection = document.getElementById('color');
let bristolIcon;

bristolIcons.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7].map(bristol => `<button class="icon" role="radio" aria-label="${bristol}"><svg  class="img"><use href="sprite.svg#bristol-${bristol}"></use></svg></button>`).join('');

const setBristol = (icon) => {
    if (icon === bristolIcon) return;

    if (bristolIcon) {
        bristolIcon.style.setProperty('--inner', 'none');
        bristolIcon.style.setProperty('--outer', 'gray');
        bristolIcon.classList.remove('selected');
    }
    bristolIcon = icon;

    record.bristol = +bristolIcon.ariaLabel;
    bristolLabel.innerText = S.bristols[record.bristol];

    bristolIcon.classList.add('selected');

    if (record.bristol) {
        bristolIcon.style.setProperty('--inner', `var(--inner-${record.color})`);
        bristolIcon.style.setProperty('--outer', `var(--outer-${record.color})`);

        volumeSection.classList.remove('hidden');
        colorSection.classList.remove('hidden');
    } else {
        bristolIcon.style.setProperty('--outer', `var(--blue)`);

        volumeSection.classList.add('hidden');
        colorSection.classList.add('hidden');
    }
}

bristolIcons.addEventListener('click', ({target}) => {
    const icon = target.closest('.icon');
    icon && setBristol(icon);
    handleChange();
});

// 2. Цвет

let colorIcon;

const setColor = (icon) => {
    if (icon === colorIcon) return;
    if (colorIcon) {
        colorIcon.classList.remove('selected');
    }
    colorIcon = icon;
    colorIcon.classList.add('selected');

    record.color = colorIcon.ariaLabel;
    colorLabel.innerText = S.colors[record.color];

    bristolIcon.style.setProperty('--inner', `var(--inner-${record.color})`);
    bristolIcon.style.setProperty('--outer', `var(--outer-${record.color})`);
}


colorIcons.addEventListener('click', ({target}) => {
    const icon = target.closest('.color');
    icon && setColor(icon);
    handleChange();
});

// 3. Объем

volumeRange.oninput = () => {
    record.volume = +volumeRange.value;
    handleChange();
    setVolume();
}

const setVolume = () => {
    volumeValue.innerText = getVolume(volumeRange.value) + ' ' + S.g;
    volumeValue.style.left = `calc(${volumeRange.value}% - ${0.45 * volumeRange.value}px)`;
    volumeLabel.innerText = S.volumes[Math.floor(volumeRange.value / 20)];
    volumeRange.style.setProperty('--value', `${volumeRange.value}%`);
}

// 4. Теги

const getTagButtonsHtml = () => tags.map(tag => `<button class="tap ${record.tags.includes(tag) ? 'selected' : ''}">${tag}</button>`).join('');
const getTagActionsHtml = () => tags.map(tag => `<button class="tap">${tag}</button>`).join('');

tagButtons.onclick = e => {
    const button = e.target.closest('button');
    if (!button) return;
    handleChange();
    button.classList.toggle('selected');
}


// Запись

function renderRecord() {
    console.log('renderRecord');
    const pooped = new Date(record.pooped);

    changed = !record.created;

    removeAction.classList.toggle('hidden', changed);
    approveAction.classList.toggle('hidden', !changed);

    poopedDate.innerText = getDateText(pooped);
    poopedTime.innerText = getTimeText(pooped);

    for (const icon of bristolIcons.children) {
        if (record.bristol === +icon.ariaLabel) {
            setBristol(icon)
            break;
        }
    }
    for (const icon of colorIcons.children) {
        if (record.color === icon.ariaLabel) {
            setColor(icon)
            break;
        }
    }
    volumeRange.value = record.volume.toString();
    setVolume();
    tagButtons.innerHTML = getTagButtonsHtml();
}

// Добавление тегов

// const viewport = window.visualViewport;

const openTagsEditor = () => {
    editTagsButton.classList.add('hidden');
    tagActions.innerHTML = getTagActionsHtml();
    overlay.onclick = closeTagEditor;
    overlay.classList.add('open');
    tagsEditor.classList.add('open');
    // tagInput.focus({preventScroll: true});
};

editTagsButton.onclick = openTagsEditor;

const closeTagEditor = () => {
    editTagsButton.classList.remove('hidden');
    overlay.classList.remove('open');
    tagsEditor.classList.remove('open');
};

const applyTagEditor = () => {
    tags = [...tagActions.children].map(q => q.innerText);
    saveTags();
    tagButtons.innerHTML = getTagButtonsHtml();
    closeTagEditor();
};

closeTags.onclick = closeTagEditor;
applyTags.onclick = applyTagEditor;

createTagButton.onclick = (e) => {
    e.preventDefault();
    if (!tagInput.value) return;

    const q = document.createElement('BUTTON');
    q.className = 'tap red';
    q.innerText = tagInput.value;

    tagInput.value = '';
    tagInput.focus();

    tagActions.appendChild(q);
}

tagActions.onclick = e => {
    const button = e.target.closest('button');
    if (!button) return;
    tagInput.value = button.innerText;
    button.remove();
}

// Выбор времени

let add, update, hour, minute;

const handRadius = 16;
const clock = document.getElementById('clock');
const hand = document.getElementById('hand');
const dayButton = document.getElementById('day');
const hourButton = document.getElementById('hour');
const minuteButton = document.getElementById('minute');
const line = document.getElementById('line');
const white = document.getElementById('white');
const black = document.getElementById('black');
const whenPicker = document.getElementById('when-picker');
const whenDays = document.getElementById('when-days');
// const whenMonth = document.getElementById('when-month');

const closeWhen = document.getElementById('close-when');
const applyWhen = document.getElementById('apply-when');

const cx = 125, cy = 125, R = 100, r = 70;
const minuteLabels = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const hourLabelsAM = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const hourLabelsPM = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

const setDay = () => dayButton.innerText = date.getDate() + ' ' + S.mons[date.getMonth()];
const setHour = () => hourButton.innerText = String(hour).padStart(2, '0');
const setMinute = () => minuteButton.innerText = String(minute).padStart(2, '0');

const updateHand = (angle, radius) => {
    const x = cx + radius * Math.cos(angle), y = cy + radius * Math.sin(angle);
    hand.style.left = `${x - handRadius}px`;
    hand.style.top = `${y - handRadius}px`;
    line.style.width = `${radius}px`;
    line.style.transform = `rotate(${angle}rad)`;
    white.style.clipPath = `circle(${handRadius}px at ${x}px ${y}px)`;
};

const getPointStyle = (x, y) => `left:${x}%;top:${y}%`

const createTicks = (labels, radius) => labels.map((label, i) => {
    const angle = (i / 6 - .5) * Math.PI;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return `<div class="tick" style="${getPointStyle(x, y)}">${label}</div>`;
}).join('');

const toMinute = () => {
    whenCalendar.style.display = 'none';
    clock.style.display = 'block';
    white.innerHTML = black.innerHTML = createTicks(minuteLabels, 40);
    updateHand((minute / 30 - .5) * Math.PI, R);
    update = updateMinute;
    add = addMinute;
    minuteButton.classList.add('selected');
    hourButton.classList.remove('selected');
    dayButton.classList.remove('selected');
};

const toHour = () => {
    whenCalendar.style.display = 'none';
    clock.style.display = 'block';
    white.innerHTML = black.innerHTML = createTicks(hourLabelsAM, 40) + createTicks(hourLabelsPM, 28);
    updateHand((hour / 6 - .5) * Math.PI, hour >= 12 ? r : R);
    update = updateHour;
    add = addHour;
    hourButton.classList.add('selected');
    minuteButton.classList.remove('selected');
    dayButton.classList.remove('selected');
};

const updateMinute = e => {
    const rect = clock.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const angle = Math.atan2(y, x);
    updateHand(angle, R);
    minute = getMinute(angle);
    setMinute();
};

const updateHour = e => {
    const rect = clock.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const angle = Math.atan2(y, x);
    const pm = 4 * (x * x + y * y) < (r + R) ** 2;
    updateHand(angle, pm ? r : R);
    hour = getHour(angle) + 12 * pm;
    setHour();
};

const getMinute = angle => (Math.round(30 * angle / Math.PI) + 75) % 60;
const getHour = angle => (Math.round(6 * angle / Math.PI) + 15) % 12;

const renderCalendar = () => {
    const y = calendarDate.getFullYear();
    const m = calendarDate.getMonth();

    const first = (new Date(y, m, 1).getDay() + 6) % 7;
    const last = new Date(y, m + 1, 0).getDate();

    const today = getDate(new Date());
    const selected = getDate(date);

    const getDayType = (n) => {
        const d = getDate(new Date(y, m, n));

        if (d === selected) return 'selected';
        if (d === today) return 'today';
        if (d > today) return 'future';
        return '';
    }
    const dayHtml = (n) => `<button class="${getDayType(n)}">${n}</button>`;

    let days = '<button class="empty"></button>'.repeat(first);
    for (let i = 1; i <= last; i++) days += dayHtml(i);

    whenDays.innerHTML = days;
};

const toDay = () => {
    clock.style.display = 'none';
    whenCalendar.style.display = 'block';
    dayButton.classList.add('selected');
    hourButton.classList.remove('selected');
    minuteButton.classList.remove('selected');
    add = addMonth;
    update = null;
    calendarDate = new Date(date);
    calendarDate.setDate(1);
    renderCalendar();
};

const openWhenPicker = (to) => {
    console.log('openWhenPicker')
    date = new Date(record.pooped);
    hour = record.pooped.getHours();
    minute = record.pooped.getMinutes();

    setDay();
    setHour();
    setMinute();

    to();
    overlay.onclick = closeWhenPicker;

    overlay.classList.add('open');
    whenPicker.classList.add('open');
};

const closeWhenPicker = () => {
    overlay.classList.remove('open');
    whenPicker.classList.remove('open');
};

const applyWhenPicker = () => {
    record.pooped = new Date(date);
    record.pooped.setHours(hour, minute);
    render();
    closeWhenPicker();
};

const render = () => {
    poopedDate.innerText = getDateText(record.pooped);
    poopedTime.innerText = getTimeText(record.pooped)
};

dayButton.onclick = toDay;
hourButton.onclick = toHour;
minuteButton.onclick = toMinute;
poopedTime.onclick = () => openWhenPicker(toHour);
poopedDate.onclick = () => openWhenPicker(toDay);

const addMinute = (d) => {
    minute = (minute + 60 + d) % 60;
    updateHand((minute / 30 - .5) * Math.PI, R);
    setMinute();
}

const addHour = (d) => {
    hour = (hour + 24 + d) % 24;
    updateHand((hour / 6 - .5) * Math.PI, hour >= 12 ? r : R);
    setHour();
}

const addMonth = (d) => {
    const m = calendarDate.getMonth();
    calendarDate.setFullYear(calendarDate.getFullYear() + Math.floor((m + d) / 12));
    calendarDate.setMonth((m + d + 12) % 12);
    renderCalendar();
}

document.getElementById('when-prev').onclick = () => add(-1);
document.getElementById('when-next').onclick = () => add(1);

whenDays.onclick = e => {
    const button = e.target.closest('button');
    if (!button) return;
    date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), +button.innerText);
    setDay();
    toHour();
};

clock.addEventListener('pointerdown', e => {
    hand.setPointerCapture(e.pointerId);
    update(e);
});

clock.addEventListener('pointermove', e => {
    if (hand.hasPointerCapture(e.pointerId)) update(e);
});

clock.addEventListener('pointerup', e => {
    if (!hand.hasPointerCapture(e.pointerId)) return;
    update(e);
    hand.releasePointerCapture(e.pointerId);
    if (update === updateHour) toMinute();
});

clock.addEventListener('pointercancel', e => {
    if (hand.hasPointerCapture(e.pointerId)) hand.releasePointerCapture(e.pointerId);
});

closeWhen.onclick = closeWhenPicker;
applyWhen.onclick = applyWhenPicker;


// Личные данные

let sex;

const personPicker = document.getElementById('person-picker');
const personButton = document.getElementById('person');

const closePerson = document.getElementById('close-person');
const applyPerson = document.getElementById('apply-person');

const closePersonPicker = () => {
    renderPerson();
    overlay.classList.remove('open');
    personPicker.classList.remove('open');
};

const digits = value => value.replace(/\D/g, '').slice(0, 8);

const applyPersonPicker = () => {
    if (validDate(birthdateInput.value)) {
        person.birthdate = +digits(birthdateInput.value);
        person.age = getAge(person.birthdate);
    } else {
        person.age = defaultPerson.age;
        person.birthdate = null;
    }
    person.sex = sex;
    person.weight = +weightInput.value.replace(',', '.') || getWeight();
    savePerson();
    closePersonPicker();
};

const setSex = () => {
    sex = person.sex;

    sexInput.classList.toggle('male', sex);
    document.getElementById(sex ? 'male' : 'female').checked = true;
}

const openPersonPicker = () => {
    console.log('openPersonPicker')

    if (person.birthdate) {
        birthdate.digits = person.birthdate.toString();
        birthdate.cursor = birthdate.digits.length;
        birthdateInput.value = formatDate();
    } else {
        birthdate.digits = '';
        birthdate.cursor = 0;
        birthdateInput.value = '';
    }
    if (person.weight) {
        weightInput.value = person.weight.toString().replace('.', ',');
    } else {
        weightInput.value = '';
    }

    overlay.onclick = closePersonPicker;
    overlay.classList.add('open');
    personPicker.classList.add('open');

    birthdateInput.focus();
};

closePerson.onclick = closePersonPicker;
applyPerson.onclick = applyPersonPicker;

personButton.onclick = () => openPersonPicker();

// Загрузка

const loadTags = () => {
    console.log('loadTags')
    const t = localStorage.getItem('tags');
    tags = t ? JSON.parse(t).filter(Boolean) : S.defaultTags;
    if (tags.length === 0) tags = S.defaultTags;
};

const loadPerson = () => {
    console.log('loadPerson')
    const t = localStorage.getItem('person');
    person = t ? JSON.parse(t) : {...defaultPerson};
    setPersonVolume();
};


const loadRecords = () => {
    console.log('loadRecords')
    const t = localStorage.getItem('records');
    records = t ? JSON.parse(t).filter(Boolean) : [];
    records.forEach(q => q.pooped = new Date(q.pooped));
};

const loadRecord = (created) => {
    console.log('loadRecord');
    record = structuredClone(records.find(r => r.created === created));
}

const saveRecord = () => {
    console.log('saveRecord');
    localStorage.setItem('records', JSON.stringify(records));
}

const saveTags = () => {
    console.log('saveTags');
    localStorage.setItem('tags', JSON.stringify(tags));
}

const savePerson = () => {
    console.log('savePerson');
    setPersonVolume();
    localStorage.setItem('person', JSON.stringify(person));
}

// Модальное окно

const question = document.getElementById('question');
const modal = document.getElementById('modal');

const confirmAction = document.getElementById('confirm');
const cancelAction = document.getElementById('cancel');

cancelAction.onclick = () => {
    modal.hidden = true;
}

modal.onclick = e => {
    if (e.target === modal) modal.hidden = true;
};

const resetButton = document.getElementById('reset');

resetButton.onclick = () => {
    question.innerText = S.resetQuestion;
    modal.hidden = false;
}

removeAction.onclick = e => {
    console.log('removeAction');
    e.preventDefault();
    records = records.filter(({created}) => created !== record.created);
    saveRecord();
    calendarPages = {};
    renderChosenRecords();
    toCalendarPage();
    calendarDate = new Date(date);
    calendarDate.setDate(1);
    renderPageCalendar();
}

rejectAction.onclick = e => {
    console.log('rejectAction');
    e.preventDefault();
    toCalendarPage();
    calendarDate = new Date(date);
    calendarDate.setDate(1);
    renderPageCalendar();
}

confirmAction.onclick = (e) => {
    modal.hidden = true;
    e.preventDefault();
    console.assert(page === pages.person);

    records.length = 0;
    saveRecord();
    calendarPages = {};
    renderChosenRecords();
    renderPageCalendar();
    toCalendarPage();
};

// 3. Статистика

const periodArea = document.getElementById('period');
const indicator = periodArea.children[0];
let active = periodArea.children[1];

const rangeArea = document.getElementById('range');
const rangeLabel = document.getElementById('range-label');

const W = 0;
const M = 1;
// const Y = 2;


let period = W;
let currentDate = new Date();

const startOfDay = date => {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    return date;
};

const endOfDay = date => {
    date = new Date(date);
    date.setHours(23, 59, 59, 999);
    return date;
};

const getMonday = (date) => {
    date = new Date(date);
    const day = date.getDay();
    const d = day === 0 ? 6 : day - 1;
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);
    return date;
}

const getRange = (date) => {
    date = startOfDay(date);

    if (period === W) {
        const start = getMonday(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return [start, end];
    }

    if (period === M) {
        const start = getMonday(new Date(date.getFullYear(), date.getMonth(), 1));
        const end = getMonday(new Date(date.getFullYear(), date.getMonth() + 1, 0));
        end.setDate(end.getDate() + 7);
        return [start, end];
    }

    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear() + 1, 0, 1);
    return [start, end];
}

function renderRange() {
    if (period === W) {
        const [start, end] = getRange(currentDate);
        rangeLabel.innerHTML =
            `<span>${getDateText(start)}</span><span>—</span><span>${getDateText(end)}</span>`;
    } else if (period === M) rangeLabel.innerHTML = S.months[currentDate.getMonth()];
    else rangeLabel.innerHTML = currentDate.getFullYear().toString();
}

function shiftRange(direction) {
    if (period === W) {
        currentDate.setDate(currentDate.getDate() + direction * 7);
    } else if (period === M) {
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + direction);
    } else {
        currentDate.setDate(1);
        currentDate.setMonth(0);
        currentDate.setFullYear(currentDate.getFullYear() + direction);
    }
    renderRange();
}

function getBuckets(start, end) {
    const buckets = [];

    if (period === W) {
        for (let i = 0; i < 7; i++) {
            buckets.push({label: S.wds[i], start: new Date(start), end: endOfDay(start)});
            start.setDate(start.getDate() + 1);
        }
    } else if (period === M) {
        const s = new Date(start);
        while (s < end) {
            const e = new Date(s);
            e.setDate(e.getDate() + 7);
            buckets.push({
                label: s.getDate(),
                start: new Date(s),
                end: e
            });
            s.setDate(s.getDate() + 7);
        }
    } else {
        for (let m = 0; m < 12; m++) {
            const s = new Date(start.getFullYear(), m, 1);
            const e = new Date(start.getFullYear(), m + 1, 0);
            buckets.push({label: S.ms[m], start: s, end: endOfDay(e)});
        }
    }
    console.log(buckets)

    return buckets;
}

function bucketize(records, buckets) {
    return buckets.map(b => records.filter(({pooped}) => {
        const d = new Date(pooped);
        return d >= b.start && d <= b.end;
    }));
}


function renderHList(container, entries) {
    if (!entries.length) {
        container.innerHTML = `<div class="empty">${S.noRecords}</div>`;
        container.style.removeProperty('--total');
        return;
    }

    const total = Math.max(...entries.map(e => e.count));
    container.style.setProperty('--total', total.toString());

    container.innerHTML = entries.map(({label, color, count, fails}) => {
        fails = fails || 0;
        if (!withFails) {
            count -= fails;
            if (!count) return '';
            fails = 0;
        }
        return `<div class="h-col" style="--color: var(${color})">
                    <div class="h-label">${label}</div>
                    <div class="h-value" style="--count: ${count}">
                        <div class="h-bar ${fails ? 'split' : ''}" style="--fails: ${fails}"></div>
                        <span class="h-number">${count}</span>
                    </div>
                </div>`;
    }).join('');
}

function renderVChart(id, buckets, values, decimals, normal, color = 'blue', value = 0) {
    console.assert(normal > 0);

    const container = document.getElementById(id);
    container.parentElement.firstElementChild.lastElementChild.innerText = Math.round(value * decimals) / decimals;

    if (!values.some(v => v > 0)) {
        container.innerHTML = `<div class="empty">${S.noRecords}</div>`;
        return;
    }

    const total = Math.max(...values.filter(v => v > 0), normal) * 1.08;

    const barsHtml = buckets.map(({label}, i) => {
        const count = values[i];
        if (count > 0) {
            const number = Math.round(count * decimals) / decimals;
            return `<div class="v-col" style="--count: ${count}">
                        <span class="v-number">${number}</span>
                        <div class="v-bar"></div>
                        <span class="v-label">${label}</span>
                    </div>`;
        }
        return `<div class="v-col"><span class="v-label">${label}</span></div>`;
    }).join('');

    container.innerHTML = `<section style="--total: ${total}; --color: var(--${color})">
        <span class="v-normal" style="--count: ${normal}">
            <span>${Math.round(normal * decimals) / decimals}</span>
        </span>
        <div class="v-row">${barsHtml}</div>
    </section>`;
}

const tagList = document.getElementById('tags-list');
const colorList = document.getElementById('color-list');
const shapeList = document.getElementById('shape-list');


let withFails;
let tagEntries = [];

const withFailsButton = document.getElementById('with-fails');
const renderTagList = () => {
    withFailsButton.style.setProperty('--color', withFails ? 'var(--accent)' : 'none');
    renderHList(tagList, tagEntries);
}

withFailsButton.onclick = () => {
    withFails = !withFails;
    renderTagList();
};

const setTagEntries = (records) => {
    const counts = new Map();
    const fails = new Map();
    records.forEach(r => {
        (r.tags || []).forEach(tag => {
            counts.set(tag, (counts.get(tag) || 0) + 1);
            if (!r.bristol) fails.set(tag, (fails.get(tag) || 0) + 1);
        });
    });

    tagEntries = [...counts.entries()]
        .map(([label, count]) => ({
            label,
            count,
            fails: fails.get(label),
            color: '--yellow'
        }))
        .sort((a, b) => b.count - a.count);

    withFails = tagEntries.some(q => q.fails > 0);
    withFailsButton.classList.toggle('hidden', !withFails);
}

function renderTags(records) {
    setTagEntries(records);
    renderTagList();
}

function renderColor(records) {
    const map = new Map();
    records.forEach(r => map.set(r.color, (map.get(r.color) || 0) + 1));

    const entries = [...map.entries()]
        .map(([color, count]) => ({
            label: S.colors[color],
            count,
            color: `--inner-${color}`
        }))
        .sort((a, b) => b.count - a.count);

    renderHList(colorList, entries);
}

function renderShape(records) {
    const map = new Map();
    records.forEach(r => map.set(r.bristol, (map.get(r.bristol) || 0) + 1));

    const entries = [...map.entries()]
        .map(([bristol, count]) => ({
            label: S.brs[bristol],
            count,
            color: '--blue'
        }))
        .sort((a, b) => b.count - a.count);

    renderHList(shapeList, entries);
}

function renderBristol(records, buckets) {
    const groups = bucketize(records, buckets);
    const values = groups.map(g => {
        if (!g.length) return null;
        return g.reduce((s, r) => s + r.bristol, 0) / g.length;
    });

    const value = records.length ? records.reduce((s, r) => s + r.bristol, 0) / records.length : 0;
    renderVChart('bristol-chart', buckets, values, 2, 4, 'yellow', value);
}

const getNormal = (value) => {
    if (period === W) return value;
    if (period === M) return value * 7;
    return value * 30;
}

function renderCount(records, buckets) {
    const groups = bucketize(records, buckets);
    const values = groups.map(g => g.length);
    const value = records.length;
    const normal = getNormal(getFrequency());
    renderVChart('count-chart', buckets, values, 10, normal, 'blue', value);
}

function renderVolume(records, buckets) {
    const groups = bucketize(records, buckets);
    const values = groups.map(g => g.length ? g.reduce((s, r) => s + getVolume(r.volume), 0) : null);
    const value = records.length ? records.reduce((s, r) => s + getVolume(r.volume), 0) : null;
    const normal = getNormal(getFrequency() * getVolume(50));
    renderVChart('volume-chart', buckets, values, 1, normal, 'yellow', value);
}

function renderStats() {
    const [start, end] = getRange(currentDate);

    const dst = records.filter(r => {
        const d = new Date(r.pooped);
        return d >= start && d < end;
    });
    const success = dst.filter(r => r.bristol);
    const buckets = getBuckets(start, end);

    renderTags(dst);
    renderColor(success);
    renderShape(dst);
    renderBristol(success, buckets);
    renderCount(success, buckets);
    renderVolume(success, buckets);
}

rangeArea.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    shiftRange(+button.dataset.add);
    renderStats();
});

periodArea.onclick = e => {
    const button = e.target.closest('button');
    if (!button || button === active) return;

    active.classList.remove('active');
    active = button;
    active.classList.add('active');
    indicator.style.transform = `translateX(${active.dataset.i * 100}%)`;

    period = +button.dataset.i;
    currentDate = new Date();
    renderRange();
    renderStats();
};

// Настройки

function getAge(birthdate) {
    const D = Math.floor(birthdate / 1000000);
    const M = Math.floor(birthdate / 10000) % 100;
    const Y = birthdate % 10000;

    const now = new Date();
    let age = now.getFullYear() - Y;
    const m = now.getMonth() - M;
    const d = now.getDate() - D;
    return age - (m < 0 || (m === 0 && d <= 0));
}

function renderPerson() {
    console.log('renderPerson')
    personButton.lastElementChild.innerHTML = `<span>${person.sex ? S.male : S.female}</span> 
        <span class="help">${person.age}</span><span class="help">${S.y}</span> • 
        <span class="help">${person.weight.toString().replace('.', ',')}</span><span class="help">${S.kg}</span>`
    setSex();
}

// Ввод персональных данных

const birthdateInput = document.getElementById('birthdate');
const weightInput = document.getElementById('weight');
const sexInput = document.getElementById('sex');

/* ---------- Дата рождения ---------- */

const birthdate = {
    input: birthdateInput,
    digits: '',
    cursor: 0
};


const formatDate = () => {
    if (!birthdate.digits) return '';

    const d = birthdate.digits.slice(0, 2) + (birthdate.digits.length >= 2 ? '.' : '');
    const m = birthdate.digits.slice(2, 4) + (birthdate.digits.length >= 4 ? '.' : '');
    const y = birthdate.digits.slice(4);

    return d + m + y;
};

const Y = new Date().getFullYear() % 100;

const normalize = () => {
    if (birthdate.cursor < birthdate.digits.length) birthdate.digits = birthdate.digits.slice(0, birthdate.cursor);

    if (+birthdate.digits[0] > 3) birthdate.digits = '0' + birthdate.digits;

    if (birthdate.digits.length >= 2) {
        const d = +birthdate.digits.slice(0, 2);

        if (d > 31) birthdate.digits = '0' + birthdate.digits;
        else if (d === 0) birthdate.digits = '01' + birthdate.digits.slice(2);
    }

    if (birthdate.digits.length >= 3 && +birthdate.digits[2] > 1) {
        birthdate.digits = birthdate.digits.slice(0, 2) + '0' + birthdate.digits.slice(2);
    }

    if (birthdate.digits.length >= 4) {
        const d = birthdate.digits.slice(0, 2);
        const m = +birthdate.digits.slice(2, 4);

        if (m > 12) birthdate.digits = d + '0' + birthdate.digits.slice(2);
        else if (m === 0) birthdate.digits = d + '01' + birthdate.digits.slice(4);
    }

    if (birthdate.digits.length >= 6) {
        const y = birthdate.digits.slice(4, 6);

        if (y !== '19' && y !== '20') birthdate.digits = birthdate.digits.slice(0, 4) + (+y <= Y ? '20' : '19') + y;
    }

    birthdate.cursor = birthdate.digits.length;
}

const setValue = () => {
    birthdate.input.value = formatDate();

    let p = birthdate.cursor;
    if (birthdate.cursor >= 2) p++;
    if (birthdate.cursor >= 4) p++;

    p = Math.min(p, birthdate.input.value.length);
    birthdate.input.setSelectionRange(p, p);
};

const rawPosition = p => birthdate.input.value.slice(0, p).replace(/\D/g, '').length;

birthdate.input.addEventListener('beforeinput', e => {
    if (e.inputType === 'insertText' && e.data === '.') {
        e.preventDefault();

        // 1. -> 01.
        if (birthdate.cursor === 1) {
            birthdate.digits = '0' + birthdate.digits;
            birthdate.cursor = 2;
            setValue();
            return;
        }

        // 01.1. -> 01.01.
        if (birthdate.cursor === 3) {
            birthdate.digits = birthdate.digits.slice(0, 2) + '0' + birthdate.digits.slice(2);
            birthdate.cursor = 4;
            setValue();
        }

        return;
    }
    if (e.inputType === 'insertText' || e.inputType === 'insertFromPaste') {
        e.preventDefault();


        const p = (e.data || '').replace(/\D/g, '');
        if (!p) return;

        if (birthdate.cursor >= 8) return;

        birthdate.digits = birthdate.digits.slice(0, birthdate.cursor) + p + birthdate.digits.slice(birthdate.cursor);
        birthdate.cursor += p.length;

        normalize();
        setValue();
    }

    if (e.inputType === 'deleteContentBackward') {
        e.preventDefault();

        if (!birthdate.cursor) return;

        if (birthdate.cursor === 8 && birthdate.digits.length === 8) {
            const y = birthdate.digits.slice(4);

            if (y.slice(0, 2) !== '19' && y.slice(0, 2) !== '20') {
                birthdate.digits = birthdate.digits.slice(0, 4) + y.slice(2);
                birthdate.cursor = 6;
                setValue();
                return;
            }
        }

        birthdate.digits = birthdate.digits.slice(0, birthdate.cursor - 1) + birthdate.digits.slice(birthdate.cursor);
        birthdate.cursor--;

        normalize();
        setValue();
    }
});

birthdate.input.addEventListener('click', () => {
    birthdate.cursor = rawPosition(birthdate.input.selectionStart);
});

birthdate.input.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        birthdate.cursor = Math.max(0, birthdate.cursor - 1);
        setValue();
    }

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        birthdate.cursor = Math.min(8, birthdate.cursor + 1);
        setValue();
    }
});

birthdate.input.addEventListener('paste', e => {
    e.preventDefault();

    const value = e.clipboardData.getData('text').trim();
    const parts = value.split(/[.\-/\s]+/);

    if (parts.length >= 3) {
        let [d, m, y] = parts;

        d = d.replace(/\D/g, '');
        m = m.replace(/\D/g, '');
        y = y.replace(/\D/g, '');

        if (d.length === 1) d = '0' + d;
        if (m.length === 1) m = '0' + m;

        if (y.length === 1)
            y = '200' + y;
        else if (y.length === 2)
            y = (+y <= Y ? '20' : '19') + y;
        else
            y = y.slice(0, 4);

        birthdate.digits = (d + m + y).slice(0, 8);
    } else {
        birthdate.digits = value.replace(/\D/g, '').slice(0, 8);
        normalize();
    }

    birthdate.cursor = birthdate.digits.length;
    setValue();
});

const validDate = () => {
    if (birthdate.digits.length !== 8) return false;

    const d = +birthdate.digits.slice(0, 2);
    const m = +birthdate.digits.slice(2, 4);
    const y = +birthdate.digits.slice(4, 8);

    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

/* ---------- Пол ---------- */

sexInput.onclick = (e) => {
    weightInput.focus();
}

sexInput.addEventListener('change', e => {
    sex = e.target.value === 'male';
    sexInput.classList.toggle('male', sex);
});

/* ---------- Вес ---------- */

const normalizeWeight = value => {
    value = value.replace(',', '.').replace(/[^\d.]/g, '');

    const i = value.indexOf('.');
    if (i >= 0)
        value = value.slice(0, i + 1) + value.slice(i + 1).replace(/\./g, '').slice(0, 1);

    value = value.replace(/^0+(?=\d)/, '');

    return +value > 999.9 ? '' : value.replace('.', ',');
};

weightInput.addEventListener('input', () => {
    weightInput.value = normalizeWeight(weightInput.value);
});

weightInput.addEventListener('paste', e => {
    e.preventDefault();
    weightInput.value = normalizeWeight(e.clipboardData.getData('text'));
});


// Не показывать подсказки

document.querySelectorAll('input').forEach(input => {
    input.setAttribute('readonly', 'true');
    input.addEventListener('focus', () => {
        input.removeAttribute('readonly');
    });
});


(function () {
    // loadTheme();
    setLanguage();
    loadTags();
    loadPerson();
    loadRecords();
    renderPageCalendar();
    renderChosenRecords();
    // setRecords();
})();