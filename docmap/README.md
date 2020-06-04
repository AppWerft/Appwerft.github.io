# DocMap

## Zweck

Die Anwendung ermöglicht die Anzeige und die Suche im Bestand der Leistungserbringer. 

## Konzept

### Grundsätzliches
Die App ist eine Einseitenwebanwendung und benötigt keine Middleware. Sie dadurch sehr performant und sicher. 

### Datengewinnung
Ein über einen cronjob getriggertes Python Schript exportiert Daten aus dem DWH und erzeugt drei JSON Dateinen, die in app/data liegen.

#### model_locations

Ausriss:

```javascript
[
  {
    "bsnrs": [
      22536898
    ],
    "address": " Häcklinger Weg 66, 21335 Lüneburg",
    "zip": "21335",
    "city": "Lüneburg",
    "street": " Häcklinger Weg 66",
    "latlng": [
      53.22202,
      10.38519
    ],
    "arztgroups": [
      "Anästhesisten"
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
    "bezeichnung": "Facharzt für Kinder- und Jugendmedizin",
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
    "bezeichnung": "Fachärztin für Innere Medizin",
    "telefon": "0173/ 717 92 18"
  }
]
```
### Geoauflösung
Die Wandlung der Adressen der Betriebsstätten zu Geolocations erfolgt mit einem externen Webdienst zur Laufzeit des Pythonscripts. Dieser Dienst (mapquest.com) bekommt diese Daten:

* die IP-Nummer unseres Netzes
* eine Liste von Hamburger Adressen ohne Bezug

Das sind also alle öffentliche Informationen, die ohnehin dann auf der App verfügbar sind. Näheres muß der Sicherheitsverantwortliche im Hause klären. 

### Kartenmaterial

Als Kartenmaterial wird die HH_WMS_Geobasiskarten_GB der LGV verwendet. 
![](https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&BBOX=564042,5932074,567903,5935935&WIDTH=800&HEIGHT=800&STYLES=&CRS=EPSG:25832&LAYERS=10,14,18,2,22,26,30,6)
Nähere Details sind [hier zu finden](https://geodienste.hamburg.de/HH_WMS_Geobasiskarten?REQUEST=GetCapabilities&SERVICE=WMS)
Der Zoomlevel ist auf 10-15 begrenzt, da die Kacheln diesen Umfang aufweisen. Es gelten keine Zugriffsbeschränkungen, Hamburgisches Geodateninfrastrukturgesetz (HmbGDIG).

#### Hinweis
Ein eingesetzer [Reverse Proxy](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html) hätte diese Vorteile:

* höhere Verfügbarkeit (Entkopplung vom Geoserver der Stadt)
* totale Konformität, da wir dann nur noch einen Quellhost (den der KVHH) hätten.

### DSVGO
Die App benutzt keine Cookies und nimmt nur Verbindung zum eigenen Host und zum Geoserver der FFH auf. 

### Eingesetzte Drittsoftware

#### leafletjs
API für Karte

#### jquery
Werkzeug zur DOM-Manipulation

#### d3
Werkzeug zur SVG-Manipulation

### jquery.autocomplete
Realisiert Suchschlund

### jquery.scombobox
Realisiert Umschaltung Arzt/Straßen-Suche

### drawer
Realisiert die Schublade, die die Filter enthält

## Funktionen

### Karte mit Markern

Die Karte zeigt entweder alle oder die gefilterten Betriebsstätten. Die Größe der Kreise hängt von der Anzahl der Betriebsstätten an dem Ort ab. 

#### Marker:Mouseover
Das Hovern über die Marker zeigt Adresse, Anzahl der Betriebsstätten und die kumulative Anzahl der LEs an.

#### Marker:Click
Klick auf den Marker zeigt alle praktizierenden Ärzte in einer Liste an, die an dieser Adresse eine Betriebsstätte haben. Die Farbe repräsentiert dabei die monentane Verfügbarkeit. GRÜN symbolisiert der Arzt hat Sprechstunde, ROT symbolisiert das Schließen und SCWARZ soll anziegen, dass der Arzt keine Informationen dazu hinterlegt hat.
Klick auf den Arzt öffnet eine weitere Sicht, die verfügbare Einzelheiten wie den Wochenplan der Öffnungszeiten anzeigt.

##### Öffnungszeitenplan
Der Plan ist mit SVG realisiert und soll graphisch und somit leicht erfassbar die Arbeitszeiten anzeigen. Der heutige Tag ist stärker hervorgehoben. Hat der Arzt geöffnet, dann ist der Zeitbereich dunkler dargestellt. Geht der Nutzer mit der Maus über den Block, dann wird die Öffnungszeit textlich als Tooltip dargestellt.