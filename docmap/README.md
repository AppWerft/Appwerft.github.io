# DocMap

## Zweck

Die Anwendung erm�glicht die Anzeige und die Suche im Bestand der Leistungserbringer. 

## Konzept

### Grunds�tzliches
Die App ist eine Einseitenwebanwendung und ben�tigt keine Middleware. Sie dadurch sehr performant und sicher. 

### Datengewinnung
Ein �ber einen cronjob getriggertes Python Schript exportiert Daten aus dem DWH und erzeugt drei JSON Dateinen, die in app/data liegen.

#### model_locations

Ausriss:

```javascript
[
  {
    "bsnrs": [
      22536898
    ],
    "address": " H�cklinger Weg 66, 21335 L�neburg",
    "zip": "21335",
    "city": "L�neburg",
    "street": " H�cklinger Weg 66",
    "latlng": [
      53.22202,
      10.38519
    ],
    "arztgroups": [
      "An�sthesisten"
    ]
  }
]
```

#### model_aerzte.json

```javascript
[
  {
    "lanr": 1160205,
    "vorname": "Sufyan",
    "nachname": "Abdulhadi",
    "titel": "",
    "gender": "M",
    "ctime": 1981,
    "bsnrs": {
      "23198398": {},
      "23435598": {}
    },
    "bezeichnung": "Facharzt f�r Kinder- und Jugendmedizin",
    "telefon": ""
  },
  {
    "lanr": 8111422,
    "vorname": "Nazila",
    "nachname": "Abdul-Schahidi",
    "titel": "",
    "gender": "F",
    "ctime": 1978,
    "bsnrs": {
      "23433798": {
        "mo": [
          510,
          780,
          960,
          1080
        ],
        "fr": [
          510,
          720
        ]
      }
    },
    "bezeichnung": "Fach�rztin f�r Innere Medizin",
    "telefon": "0173/ 717 92 18"
  }
]
```
### Geoaufl�sung
Die Wandlung der Adressen der Betriebsst�tten zu Geolocations erfolgt mit einem externen Webdienst zur Laufzeit des Pythonscripts. Dieser Dienst (mapquest.com) bekommt diese Daten:

* die IP-Nummer unseres Netzes
* eine Liste von Hamburger Adressen ohne Bezug

Das sind also alle �ffentliche Informationen, die ohnehin dann auf der App verf�gbar sind. N�heres mu� der Sicherheitsverantwortliche im Hause kl�ren. 

### Kartenmaterial

Als Kartenmaterial wird die HH_WMS_Geobasiskarten_GB der LGV verwendet. 
![](https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&BBOX=564042,5932074,567903,5935935&WIDTH=800&HEIGHT=800&STYLES=&CRS=EPSG:25832&LAYERS=10,14,18,2,22,26,30,6)
N�here Details sind [hier zu finden](https://geodienste.hamburg.de/HH_WMS_Geobasiskarten?REQUEST=GetCapabilities&SERVICE=WMS)
Der Zoomlevel ist auf 10-15 begrenzt, da die Kacheln diesen Umfang aufweisen. Es gelten keine Zugriffsbeschr�nkungen, Hamburgisches Geodateninfrastrukturgesetz (HmbGDIG).

#### Hinweis
Ein eingesetzer [Reverse Proxy](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html) h�tte diese Vorteile:

* h�here Verf�gbarkeit (Entkopplung vom Geoserver der Stadt)
* totale Konformit�t, da wir dann nur noch einen Quellhost (den der KVHH) h�tten.

### DSVGO
Die App benutzt keine Cookies und nimmt nur Verbindung zum eigenen Host und zum Geoserver der FFH auf. 

### Eingesetzte Drittsoftware

#### leafletjs
API f�r Karte

#### jquery
Werkzeug zur DOM-Manipulation

#### d3
Werkzeug zur SVG-Manipulation

### jquery.autocomplete
Realisiert Suchschlund

### jquery.scombobox
Realisiert Umschaltung Arzt/Stra�en-Suche

### drawer
Realisiert die Schublade, die die Filter enth�lt

## Funktionen

### Karte mit Markern

Die Karte zeigt entweder alle oder die gefilterten Betriebsst�tten. Die Gr��e der Kreise h�ngt von der Anzahl der Betriebsst�tten an dem Ort ab. 

#### Marker:Mouseover
Das Hovern �ber die Marker zeigt Adresse, Anzahl der Betriebsst�tten und die kumulative Anzahl der LEs an.

#### Marker:Click
Klick auf den Marker zeigt alle praktizierenden �rzte in einer Liste an, die an dieser Adresse eine Betriebsst�tte haben. Die Farbe repr�sentiert dabei die monentane Verf�gbarkeit. GR�N symbolisiert der Arzt hat Sprechstunde, ROT symbolisiert das Schlie�en und SCWARZ soll anziegen, dass der Arzt keine Informationen dazu hinterlegt hat.
Klick auf den Arzt �ffnet eine weitere Sicht, die verf�gbare Einzelheiten wie den Wochenplan der �ffnungszeiten anzeigt.

##### �ffnungszeitenplan
Der Plan ist mit SVG realisiert und soll graphisch und somit leicht erfassbar die Arbeitszeiten anzeigen. Der heutige Tag ist st�rker hervorgehoben. Hat der Arzt ge�ffnet, dann ist der Zeitbereich dunkler dargestellt. Geht der Nutzer mit der Maus �ber den Block, dann wird die �ffnungszeit textlich als Tooltip dargestellt.