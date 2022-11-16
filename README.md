# Stealth Seminar API Registration form

Simple Registration page using [StealthSeminar](https://stealthseminar.com/) API.

## Features

- Dynamic time format (**with locale**)
- URL tracking value (v1, v2 ...)
- Phone number with validation

## Usage

Edit app.js file and add webinar short id. 

#### Replace short id

```javascript
// Webinar id
const webinarShortId = "";
```

## Change initial country

```javascript
// initial country
const initialCountry = "us"; // Phone number default country
```

## Add preferred countries in phone number field

Edit app.js file and add countries in the array shown below.

```javascript
	// ...
    preferredCountries: [], // Preferred countries eg: us, ...
	// ...
```

## Change input text

Edit **form.html** file to change input text all input text can be modified by the file except time options. **Time formatting and locale** options can be modified inside get request in app.js file. But that's not recommended, because you can change the format and language using event settings, so why do extra work?. But if you want to change this form only without affecting other forms then edit it.

## Debug

#### Form loading problem

Find this code and **uncomment** error marked line

```javascript
axios
	.get(//...)
	//...
	.catch((e) => {
	// console.log(e); // Error
	// ...
```

#### Form submitting problem

Find submit function and **uncomment** error marked line

```javascript
function submit(e) {
	//...
	axios
		.post(//..)
		//...
		.catch((e) => {
		// console.log(e); // Error
		// ...
```

## FAQ

#### How do I find short id?

https://help.stealthseminarapp.com/en/articles/362881-how-do-i-find-the-shortid-for-my-event
