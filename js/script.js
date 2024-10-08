// Initialize PrayTimes with desired calculation method (e.g., 'ISNA')
var prayTimes = new PrayTimes('ISNA');

// Set your location coordinates and timezone
var latitude = 43;      // Replace with your latitude
var longitude = -80;    // Replace with your longitude
var timezone = -5;      // Replace with your timezone offset from GMT

// Function to fetch Iqama Times from JSON file
async function fetchIqamaTimes() {
  try {
    const response = await fetch('/data/iqamaTimes.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const iqamaTimes = await response.json();
    return iqamaTimes;
  } catch (error) {
    console.error('Error fetching Iqama Times:', error);
    return null;
  }
}

// Function to update prayer times
async function updatePrayerTimes() {
  var today = new Date();
  
  // Calculate prayer times
  var adhanTimes = prayTimes.getTimes(today, [latitude, longitude], timezone);
  
  // **Set Offsets**
  // Adjust prayer times by setting offsets in minutes
  prayTimes.tune({
    fajr: 5,        // Fajr time will be 5 minutes later
    dhuhr: 0,       // No adjustment for Dhuhr
    asr: 0,         // No adjustment for Asr
    maghrib: 3,     // Maghrib time will be 3 minutes later
    isha: -2        // Isha time will be 2 minutes earlier
  });
  
  // Recalculate prayer times after tuning
  var tunedTimes = prayTimes.getTimes(today, [latitude, longitude], timezone);
  
  // Fetch Iqama Times from JSON
  const iqamaTimes = await fetchIqamaTimes();
  
  if (iqamaTimes) {
    // Display the tuned Adhan times in HTML
    document.getElementById('fajr-adhan').innerHTML = tunedTimes.fajr;
    document.getElementById('dhuhr-adhan').innerHTML = tunedTimes.dhuhr;
    document.getElementById('asr-adhan').innerHTML = tunedTimes.asr;
    document.getElementById('maghrib-adhan').innerHTML = tunedTimes.maghrib;
    document.getElementById('isha-adhan').innerHTML = tunedTimes.isha;
    
    // Display the Iqama times from the iqamaTimes object
    document.getElementById('fajr-iqama').innerHTML = iqamaTimes.fajr || '-';
    document.getElementById('dhuhr-iqama').innerHTML = iqamaTimes.dhuhr || '-';
    document.getElementById('asr-iqama').innerHTML = iqamaTimes.asr || '-';
    document.getElementById('maghrib-iqama').innerHTML = iqamaTimes.maghrib || '-';
    document.getElementById('isha-iqama').innerHTML = iqamaTimes.isha || '-';
    
    // **Always Display Jummah Iqama Times**
    document.getElementById('jummah-iqama').innerHTML = iqamaTimes.jummah || '-';
    document.getElementById('second-jummah-iqama').innerHTML = iqamaTimes.secondJummah || '-';
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

