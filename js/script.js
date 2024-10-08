// Initialize PrayTimes with desired calculation method (e.g., 'ISNA')
var prayTimes = new PrayTimes('ISNA');

// Set your location coordinates and timezone
var latitude = 43;      // Replace with your latitude
var longitude = -80;    // Replace with your longitude
var timezone = -5;      // Replace with your timezone offset from GMT

// Function to fetch Iqama Times from JSON file with cache busting
async function fetchIqamaTimes() {
  try {
    const response = await fetch(`/data/iqamaTimes.json?t=${new Date().getTime()}`); // Cache busting
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
  prayTimes.tune({
    fajr: 5,
    dhuhr: 0,
    asr: 0,
    maghrib: 3,
    isha: -2
  });
  
  var times = prayTimes.getTimes(today, [latitude, longitude], timezone);
  
  // Fetch Iqama Times from JSON
  const iqamaTimes = await fetchIqamaTimes();
  
  if (iqamaTimes) {
    // Update Adhan times
    document.getElementById('fajr-adhan').textContent = times.fajr;
    document.getElementById('dhuhr-adhan').textContent = times.dhuhr;
    document.getElementById('asr-adhan').textContent = times.asr;
    document.getElementById('maghrib-adhan').textContent = times.maghrib;
    document.getElementById('isha-adhan').textContent = times.isha;
    
    // Update Iqama times
    document.getElementById('fajr-iqama').textContent = iqamaTimes.fajr || '-';
    document.getElementById('dhuhr-iqama').textContent = iqamaTimes.dhuhr || '-';
    document.getElementById('asr-iqama').textContent = iqamaTimes.asr || '-';
    document.getElementById('maghrib-iqama').textContent = iqamaTimes.maghrib || '-';
    document.getElementById('isha-iqama').textContent = iqamaTimes.isha || '-';
    
    // Update Jummah times
    document.getElementById('jummah-iqama-1').textContent = iqamaTimes.jummah || '-';
    document.getElementById('jummah-iqama-2').textContent = iqamaTimes.secondJummah || '-';
  } else {
    console.error('Iqama Times could not be loaded.');
  }
}

// Initial call to display prayer times
updatePrayerTimes();

// Automatic Daily Updates at Midnight
var now = new Date();
var millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0,0,0,0) - now;

setTimeout(function(){
  updatePrayerTimes();
  setInterval(updatePrayerTimes, 24*60*60*1000);
}, millisTillMidnight);



