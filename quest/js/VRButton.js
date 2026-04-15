// Three.js r128 VRButton — served locally so the Quest browser doesn't need
// to reach an external CDN. Identical to the upstream r128 source.
var VRButton = {
  createButton: function ( renderer ) {
    var button = document.createElement( 'button' );

    function showEnterVR() {
      var currentSession = null;

      function onSessionStarted( session ) {
        session.addEventListener( 'end', onSessionEnded );
        renderer.xr.setSession( session );
        button.textContent = 'EXIT VR';
        currentSession = session;
      }

      function onSessionEnded() {
        currentSession.removeEventListener( 'end', onSessionEnded );
        button.textContent = 'ENTER VR';
        currentSession = null;
      }

      button.style.display = '';
      button.style.cursor = 'pointer';
      button.style.left = 'calc(50% - 50px)';
      button.style.width = '100px';
      button.textContent = 'ENTER VR';

      button.onmouseenter = function () { button.style.opacity = '1.0'; };
      button.onmouseleave = function () { button.style.opacity = '0.5'; };

      button.onclick = function () {
        if ( currentSession === null ) {
          var sessionInit = {
            optionalFeatures: [
              'local-floor',
              'bounded-floor',
              'hand-tracking',
              'layers'
            ]
          };
          navigator.xr.requestSession( 'immersive-vr', sessionInit )
            .then( onSessionStarted );
        } else {
          currentSession.end();
        }
      };
    }

    function disableButton() {
      button.style.display = '';
      button.style.cursor = 'auto';
      button.style.left = 'calc(50% - 75px)';
      button.style.width = '150px';
      button.onmouseenter = null;
      button.onmouseleave = null;
      button.onclick = null;
    }

    function showWebXRNotFound() {
      disableButton();
      button.textContent = 'VR NOT SUPPORTED';
    }

    function showVRNotAllowed( exception ) {
      disableButton();
      console.warn( 'Exception when trying to call xr.isSessionSupported', exception );
      button.textContent = 'VR NOT ALLOWED';
    }

    button.id = 'VRButton';
    button.style.cssText = [
      'display: none',
      'cursor: pointer',
      'position: fixed',
      'bottom: 20px',
      'left: calc(50% - 50px)',
      'padding: 12px 6px',
      'border: 1px solid #fff',
      'border-radius: 4px',
      'background: rgba(0,0,0,0.1)',
      'color: #fff',
      'font: normal 13px sans-serif',
      'text-align: center',
      'opacity: 0.5',
      'outline: none',
      'z-index: 999'
    ].join( ';' );

    if ( 'xr' in navigator ) {
      navigator.xr.isSessionSupported( 'immersive-vr' )
        .then( function ( supported ) {
          if ( supported ) {
            showEnterVR();
          } else {
            showWebXRNotFound();
          }
        } )
        .catch( showVRNotAllowed );
    } else {
      if ( window.isSecureContext === false ) {
        button.style.display = '';
        button.textContent = 'WEBXR NEEDS HTTPS';
      } else {
        showWebXRNotFound();
      }
      console.warn( 'navigator.xr not found — WebXR unavailable' );
    }

    return button;
  }
};
