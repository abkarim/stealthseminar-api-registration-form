// Webinar id
const webinarShortId = ''; // Replace with you webinar short id
// Get timezone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// initial country
const initialCountry = 'us'; // For phone number
// Get elements
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const timeField = document.getElementById('time')
const smsCheckbox = document.getElementById('sms-alert');
const numberInputContainer = document.getElementById('number-input-container')
const numberField = document.querySelector('input[type=tel]');
const form = document.querySelector('form');
const submitButton = document.querySelector('.submit-button');

const urlParameter = new URL(window.location.href);

// Tracking value
const v1 = urlParameter.searchParams.get('v1');
const v2 = urlParameter.searchParams.get('v2');
const v3 = urlParameter.searchParams.get('v3');
const v4 = urlParameter.searchParams.get('v4');
const v5 = urlParameter.searchParams.get('v5');
const utm_source = urlParameter.searchParams.get('utm_source');
const utm_content = urlParameter.searchParams.get('utm_content');
const utm_term = urlParameter.searchParams.get('utm_term');
const utm_campaign = urlParameter.searchParams.get('utm_campaign');
const utm_medium = urlParameter.searchParams.get('utm_medium');

//* Configure number input
var iti = intlTelInput(numberField, {
    initialCountry,
    preferredCountries: [],
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
})

// Handle sms alert
smsCheckbox.addEventListener('click', () => {
    // Is checked
    if (smsCheckbox.checked) {
        numberInputContainer.hidden = false;
        numberField.required = true;
    } else {
        numberInputContainer.hidden = true;
        numberField.required = false;
    }
})

// Get webinar registration data
axios
    .get(`https://api.joinnow.live/webinars/${webinarShortId}/registration-information?timezone=${timeZone}`)
    .then(response => {
        // Destruct data
        const { data } = response;
        // Update document title
        document.title = data.title;
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
            const element = document.createElement('option');
            element.value = time;
            element.textContent = dateTime;
            timeField.appendChild(element)
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
    if (!moment().isBefore(moment(timeField.value))) return showMessage("Please select a future time");

    // Validate number
    if (smsCheckbox.checked && !iti.isValidNumber()) return showMessage("Please input a valid number with correct format");

    // Prepare data
    const data = {
        start_time: timeField.value,
        name: nameField.value,
        email: emailField.value,
        sms_number: iti.getNumber(),
        timezone: timeZone,
        linkParams: {
            v1,
            v2,
            v3,
            v4,
            v5,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content
        }
    }

    // DIsable submit button
    submitButton.classList.add('disabled');

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
            submitButton.classList.remove('disabled')
        })
}

form.addEventListener('submit', submit);
