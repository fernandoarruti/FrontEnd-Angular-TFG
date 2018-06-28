import { Icon, IconOptions } from 'leaflet';
import * as L from 'leaflet';

export interface FontAwesomeOptions extends IconOptions {
  iconClasses?;
  iconColor?;
  iconXOffset?;
  iconYOffset?;
}

export class FontAwesomeIcon extends Icon {
  options: FontAwesomeOptions;

  constructor(options: IconOptions) {
    super(options);
  }

  createIcon() {

    const div = document.createElement('div');
    const options = this.options;

    if (options.iconClasses) {
      div.appendChild(this._createIcon());
    }

    return div;
  }

  _createIcon() {

    const options = this.options;

    // container div
    const iconDiv = L.DomUtil.create('div', 'leaflet-fa-markers');

    // feature icon
    const iconSpan = L.DomUtil.create('span', options.iconClasses + ' feature-icon');
    iconSpan.style.color = options.iconColor;
    iconSpan.style.textAlign = 'center';

    // XY position adjustments
    if(options.iconYOffset && options.iconYOffset !== 0) {
      iconSpan.style.marginTop = options.iconYOffset + 'px';
    }

    if(options.iconXOffset && options.iconXOffset !== 0) {
      iconSpan.style.marginLeft = options.iconXOffset + 'px';
    }

    const iconImg = document.createElement('div');
    iconImg.className = 'marker-icon';
    iconImg.innerHTML = '<img ' + 'src="' + options.iconUrl + '" ' + '</img>';
    iconImg.style.marginTop = '-41px';

    const shadowImg = document.createElement('div');
    shadowImg.className = 'marker-icon-shadow';
    shadowImg.innerHTML = '<img ' + 'src="' + options.shadowUrl + '" ' + '</img>';

    iconDiv.appendChild(shadowImg);
    iconDiv.appendChild(iconImg);
    iconDiv.appendChild(iconSpan);
    return iconDiv;
  }
}

