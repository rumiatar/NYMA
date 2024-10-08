// Initialize PrayTimes with desired calculation method (e.g., 'ISNA')
var prayTimes = new PrayTimes('ISNA');

// Set your location coordinates and timezone
var latitude = 43.76;      // Replace with your latitude
var longitude = -79.41;    // Replace with your longitude
var timezone = -4;      // Replace with your timezone offset from GMT

// Debugging: Confirm script is running
console.log('script.js is running.');

// Function to fetch Iqama Times from JSON file
async function fetchIqamaTimes() {
  try {
    const response = await fetch('/data/iqamaTimes.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const iqamaTimes = await response.json();
    console.log('Fetched Iqama Times:', iqamaTimes);
    return iqamaTimes;
  } catch (error) {
    console.error('Error fetching Iqama Times:', error);
    return null;
  }
}

// Function to update prayer times
async function updatePrayerTimes() {
  var today = new Date();
  console.log('Today\'s Date:', today);
  
  // Calculate prayer times
  var adhanTimes = prayTimes.getTimes(today, [latitude, longitude], timezone);
  console.log('Adhan Times:', adhanTimes);
  
  // **Set Offsets**
  // Adjust prayer times by setting offsets in minutes
  prayTimes.tune({
    fajr: 5,        // Fajr time will be 5 minutes later
    dhuhr: 0,       // No adjustment for Dhuhr
    asr: 0,         // No adjustment for Asr
    maghrib: 3,     // Maghrib time will be 3 minutes later
    isha: -2        // Isha time will be 2 minutes earlier
  });
  console.log('Prayer Times Tuned with Offsets.');
  
  // Recalculate prayer times after tuning
  var tunedTimes = prayTimes.getTimes(today, [latitude, longitude], timezone);
  console.log('Tuned Adhan Times:', tunedTimes);
  
  // Fetch Iqama Times from JSON
  const iqamaTimes = await fetchIqamaTimes();
  
  if (iqamaTimes) {
    // Display the tuned Adhan times in HTML
    document.getElementById('fajr-adhan').innerHTML = tunedTimes.fajr;
    console.log('Fajr Adhan Time set to:', tunedTimes.fajr);
    
    document.getElementById('dhuhr-adhan').innerHTML = tunedTimes.dhuhr;
    console.log('Dhuhr Adhan Time set to:', tunedTimes.dhuhr);
    
    document.getElementById('asr-adhan').innerHTML = tunedTimes.asr;
    console.log('Asr Adhan Time set to:', tunedTimes.asr);
    
    document.getElementById('maghrib-adhan').innerHTML = tunedTimes.maghrib;
    console.log('Maghrib Adhan Time set to:', tunedTimes.maghrib);
    
    document.getElementById('isha-adhan').innerHTML = tunedTimes.isha;
    console.log('Isha Adhan Time set to:', tunedTimes.isha);
    
    // Display the Iqama times from the iqamaTimes object
    document.getElementById('fajr-iqama').innerHTML = iqamaTimes.fajr || '-';
    console.log('Fajr Iqama Time set to:', iqamaTimes.fajr || '-');
    
    document.getElementById('dhuhr-iqama').innerHTML = iqamaTimes.dhuhr || '-';
    console.log('Dhuhr Iqama Time set to:', iqamaTimes.dhuhr || '-');
    
    document.getElementById('asr-iqama').innerHTML = iqamaTimes.asr || '-';
    console.log('Asr Iqama Time set to:', iqamaTimes.asr || '-');
    
    document.getElementById('maghrib-iqama').innerHTML = iqamaTimes.maghrib || '-';
    console.log('Maghrib Iqama Time set to:', iqamaTimes.maghrib || '-');
    
    document.getElementById('isha-iqama').innerHTML = iqamaTimes.isha || '-';
    console.log('Isha Iqama Time set to:', iqamaTimes.isha || '-');
    
    // **Always Display Jummah Iqama Times**
    document.getElementById('jummah-iqama-1').innerHTML = iqamaTimes.jummah || '-';
    console.log('Jummah Iqama Time 1 set to:', iqamaTimes.jummah || '-');
    
    document.getElementById('jummah-iqama-2').innerHTML = iqamaTimes.secondJummah || '-';
    console.log('Jummah Iqama Time 2 set to:', iqamaTimes.secondJummah || '-');
    
    console.log('Prayer Times Updated on Website.');
  } else {
    console.error('Iqama Times could not be loaded.');
  }
}

// Initial call to display prayer times
updatePrayerTimes();

// **Automatic Daily Updates**
// Calculate the time until midnight
var now = new Date();
var millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0,0,0,0) - now;

// Set a timeout to update at midnight
setTimeout(function(){
  updatePrayerTimes();
  // Then set an interval to update every 24 hours
  setInterval(updatePrayerTimes, 24*60*60*1000);
}, millisTillMidnight);
);

