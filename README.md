
# Stealth Seminar API Registration form
Simple Registration form using [StealthSeminar](https://stealthseminar.com/) API

## Features
- Dynamic time format (**with locale**)
- URL tracking value (v1, v2 etc)

## Usage
Edit app.js file to configure form

#### Replace short id
```javascript
// Webinar id
const webinarShortId = '';
```
#### Change initial country
```javascript
// initial country
const initialCountry = 'us'; // Phone number default country
```
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
})
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
})
```

## FAQ

#### How do I find short id?

https://help.stealthseminarapp.com/en/articles/3362881-how-do-i-find-the-shortid-for-my-event
