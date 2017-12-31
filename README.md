# openhab.fitbit
OpenHAB fitbit ionic app

Simple ionic app released with the MIT license which was written to display the status of lights and allow to switch them between on and off.

App shows a list of buttons with the names of the buttons being the item names from openHAB.  If the button is red then the light is off, if clicked the light will turn on.  If the button is green then the light is on (for a dimmer it means it has a % greater than zero).  Clicking the button will turn off the light.

Limitations:  the FitBit iconic API doesn't allow for unlimited items.  The app is currently limited to 30 lights.

Requires:
-Lights/Switches have HomeKit tags "Lighting" or "Switchable" assigned to them
-openHAB Cloud configured with a SSL certificate issued by a reputable certificate authority
-OAuth Client-ID and Client-Secret configured with openHAB Cloud
