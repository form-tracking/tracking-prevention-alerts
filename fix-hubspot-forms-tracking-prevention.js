// Detect HubSpot forms blocked by browser tracking prevention (Edge, Firefox, Safari)
// Built by Insiteful.co
// MIT License

(function() {
  // Check if browser is Edge, Firefox, or Safari
  function getBrowser() {
    const isEdge = /Edg/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return { isEdge, isFirefox, isSafari, any: isEdge || isFirefox || isSafari };
  }

  // Check if tracking prevention is likely enabled
  function isTrackingPreventionEnabled() {
    if (!navigator.cookieEnabled) {
      return true;
    }
    
    // Check for Do Not Track
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
      return true;
    }
    
    // Check storage access (strict mode blocks this)
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      return true;
    }
    
    return false;
  }

  // Check if HubSpot is blocked
  function isHubSpotBlocked() {
    if (typeof window.HubSpotConversations === 'undefined' && 
        typeof window.hbspt === 'undefined') {
      return true;
    }
    return false;
  }

  // Run checks
  function checkAndAlert() {
    const browser = getBrowser();
    const trackingPrevention = isTrackingPreventionEnabled();
    const hubspotBlocked = isHubSpotBlocked();

    if (browser.any && (trackingPrevention || hubspotBlocked)) {
      let browserName = '';
      let instructions = '';
      
      if (browser.isEdge) {
        browserName = 'Microsoft Edge';
        instructions = '1. Click the lock icon in the address bar\n' +
                      '2. Turn off "Tracking prevention" for this site\n' +
                      '3. Refresh the page';
      } else if (browser.isFirefox) {
        browserName = 'Firefox';
        instructions = '1. Click the shield icon in the address bar\n' +
                      '2. Turn off "Enhanced Tracking Protection" for this site\n' +
                      '3. Refresh the page';
      } else if (browser.isSafari) {
        browserName = 'Safari';
        instructions = '1. Go to Safari > Settings (or Preferences)\n' +
                      '2. Click on Privacy\n' +
                      '3. Uncheck "Prevent cross-site tracking"\n' +
                      '4. Refresh the page';
      }
      
      alert(
        '⚠️ Tracking Prevention Detected\n\n' +
        `It appears you are using ${browserName} with strict tracking prevention enabled, ` +
        'which may be blocking HubSpot forms and other features.\n\n' +
        'To ensure full functionality, please:\n' +
        instructions
      );
    }
  }

  // Wait for HubSpot to load (or fail to load)
  setTimeout(checkAndAlert, 2000);
})();