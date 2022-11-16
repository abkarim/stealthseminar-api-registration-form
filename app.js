// Webinar id
const webinarShortId = ''; // Replace with you webinar short id
// Get timezone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// initial country
const initialCountry = 'us'; // For phone number
// Get elements
const element = {
    nameField: document.getElementById('name'),
    emailField: document.getElementById('email'),
    timeField: document.getElementById('time'),
    smsCheckbox: document.getElementById('sms-alert'),
    smsCheckboxLabel: document.querySelector('.sms-alert-checkbox-label'),
    numberInputContainer: document.getElementById('number-input-container'),
    numberField: document.querySelector('input[type=tel]'),
    form: document.querySelector('form'),
    submitButton: document.querySelector('.submit-button'),
}

const urlParameter = new URL(window.location.href);

// Tracking value
const linkParams = {
    v1: urlParameter.searchParams.get('v1'),
    v2: urlParameter.searchParams.get('v2'),
    v3: urlParameter.searchParams.get('v3'),
    v4: urlParameter.searchParams.get('v4'),
    v5: urlParameter.searchParams.get('v5'),
    utm_source: urlParameter.searchParams.get('utm_source'),
    utm_content: urlParameter.searchParams.get('utm_content'),
    utm_term: urlParameter.searchParams.get('utm_term'),
    utm_campaign: urlParameter.searchParams.get('utm_campaign'),
    utm_medium: urlParameter.searchParams.get('utm_medium'),
}

//* Configure number input
var iti = intlTelInput(element.numberField, {
    initialCountry,
    preferredCountries: [], // Preferred countries
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
})

// Handle sms alert
element.smsCheckbox.addEventListener('click', () => {
    // Is checked
    if (element.smsCheckbox.checked) {
        element.numberInputContainer.hidden = false;
        element.numberField.required = true;
    } else {
        element.numberInputContainer.hidden = true;
        element.numberField.required = false;
    }
})

// Get webinar registration data
axios
    .get(`https://api.joinnow.live/webinars/${webinarShortId}/registration-information?timezone=${timeZone}`)
    .then(response => {
        // Destruct data
        const { data } = response;
        // Update document title
        document.title = data.viewing_strings.pageTitle;
        // Remove checkbox for number and show number field when number is required
        if (data.registration_schema.fields[4].required) {
            element.numberField.required = true;
            element.smsCheckboxLabel.hidden = true;
            element.smsCheckbox.hidden = true;
            element.numberInputContainer.hidden = false;
        }
        // Append upcoming time
        moment.locale(data.date_locale)
        data.upcoming_times.forEach(time => {
            // Prepare date
            let dateTime = '';
            if (data.datetime_format.type === 'separate') {
                // Separate time
                const date = moment(time).format(data.datetime_format.date_format); // Date
                const tm = moment(time).format(data.datetime_format.time_format); // Time
                // Update date time
                dateTime = `${date}${data.datetime_format.separator}${tm}`;
            } else {
                // Combined date time
                dateTime = moment(time).format(data.datetime_format.combined_format);
            }
            // Create element
            const ele = document.createElement('option');
            ele.value = time;
            ele.textContent = dateTime;
            element.timeField.appendChild(ele)
        })

    })
    .catch((e) => {
        // console.log(e); //Debug
        showMessage('Something went wrong, please try again later');
    })

/**
 * Show message to user
 * @param {String} text 
 * @param {Boolean} success 
 */
function showMessage(text, success = false) {
    const prevElement = document.querySelector('.message');
    if (prevElement) prevElement.remove();
    const element = document.createElement('div');
    element.setAttribute('class', `message ${success === false ? 'error' : ''}`);
    element.textContent = text;
    document.body.appendChild(element)
    // Clear message event
    element.addEventListener('click', (e) => {
        e.target.remove(); // Remove 
    })
}

/**
 * Submit form
 */
function submit(e) {
    e.preventDefault();

    // Validate webinar time
    if (!moment().isBefore(moment(element.timeField.value))) return showMessage("Please select a future time");

    // Validate number
    if (element.smsCheckbox.checked && !iti.isValidNumber()) return showMessage("Please input a valid number with correct format");

    // Prepare data
    const data = {
        start_time: element.timeField.value,
        name: element.nameField.value,
        email: element.emailField.value,
        sms_number: iti.getNumber(),
        timezone: timeZone,
        linkParams
    }

    // DIsable submit button
    element.submitButton.classList.add('disabled');

    axios
        .post(`https://api.joinnow.live/webinars/${webinarShortId}/registration`, data, {
            contentType: 'application/json'
        })
        .then(response => {
            const { data } = response; // Destruct data
            // Show message
            showMessage('Redirecting...', true)
            // Redirect user to webinar page
            window.location = `https://joinnow.live/t/${data.webinar_short_id}?id=${data.attendee.short_id}`;
        })
        .catch((e) => {
            // console.log(e); //Debug
            showMessage("Something went wrong, please try again later");
            // Enable submit button
            element.submitButton.classList.remove('disabled')
        })
}

element.form.addEventListener('submit', submit);
