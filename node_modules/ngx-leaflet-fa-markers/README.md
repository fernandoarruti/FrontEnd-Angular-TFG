# leaflet-fa-markers [npm-url]

Very simple markers with FontAwesome icons, compatible with Leaflet v1.

![Screenshot](/screenshots/markers.png?raw=true)

## Use:
import the css file for exemple in .angular-cli.json
```json
      "styles": [
        "../node_modules/ngx-leaflet-fa-markers/fontAwesomeIcon.css"
      ],
```
```typescript
import { FontAwesomeOptions, FontAwesomeIcon } from 'leaflet-fa-markers/index';
// ...
const lat = map.getBounds().getCenter().lat;
const lng = map.getBounds().getCenter().lng;
const iconOption: FontAwesomeOptions = {
  iconClasses: 'fa fa-info-circle', // you _could_ add other icon classes, not tested.
  // iconColor: '#F00',
  iconUrl: '../assets/marker-icon.png',
  shadowUrl: '../assets/marker-shadow.png'
};

const icon = new FontAwesomeIcon(iconOption);
const marker = new L.Marker([ lat, lng], {
  icon: icon,
  draggable: true});
marker.addTo(map);
```
```typescript
import { FontAwesomeOptions, FontAwesomeIcon } from 'leaflet-fa-markers/index';
// ...
const lat = map.getBounds().getCenter().lat;
const lng = map.getBounds().getCenter().lng;
const iconOption: FontAwesomeOptions = {
  iconClasses: 'fa fa-circle-o-notch fa-spin', // you _could_ add other icon classes, not tested.
  // iconColor: '#F00',
  iconUrl: '../assets/marker-icon.png',
  shadowUrl: '../assets/marker-shadow.png'
};

const icon = new FontAwesomeIcon(iconOption);
const marker = new L.Marker([ lat, lng], {
  icon: icon,
  draggable: true});
marker.addTo(map);
```
[npm-url]: https://www.npmjs.com/package/ngx-leaflet-fa-markers
