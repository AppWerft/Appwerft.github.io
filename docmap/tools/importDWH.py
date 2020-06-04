import pyodbc
import json
import geocoder
import pandas.io.sql
import pandas as pd
import dwhlink
from fpdf import FPDF
from arztlist import Arztlist


def saveToDB(locs):
    for loc in locs:
        point = f"POINT({loc['latlng'][1]} {loc['latlng'][0]})"
        address = loc['address'].replace("'", "\\")
        table = "[RS_DWH_DEV_CORE].[dbo].[DIM_BS_LATLNG]"
        sql = f"\
				DECLARE @G GEOGRAPHY;     SET @G=GEOGRAPHY::STGeomFromText('{point}', 4326);\n\
				DECLARE @A NVARCHAR(256); SET @A='{address}';\n\
					IF EXISTS (SELECT * FROM {table} WHERE ADDRESS_STRING=@A)  \n\
						UPDATE {table} SET LATLNG=@G WHERE ADDRESS_STRING=@A;  \n\
					ELSE \n\
						INSERT INTO {table} (ADDRESS_STRING, LATLNG) VALUES (@A, @G);\n\
			"
        print(sql)
        link.execute(sql)
    link.commit()


def requestOpeningHours(lanr, bsnr):

    sql = """
	SELECT
       [MO_VORMITTAG_VON]  mo1
      ,[MO_VORMITTAG_BIS]  mo2
      ,[MO_NACHMITTAG_VON] mo3
      ,[MO_NACHMITTAG_BIS] mo4
      ,[DI_VORMITTAG_VON] di1
      ,[DI_VORMITTAG_BIS] di2
      ,[DI_NACHMITTAG_VON] di3
      ,[DI_NACHMITTAG_BIS] di4
      ,[MI_VORMITTAG_VON] mi1
      ,[MI_VORMITTAG_BIS] mi2
      ,[MI_NACHMITTAG_VON] mi3
      ,[MI_NACHMITTAG_BIS] mi4
      ,[DO_VORMITTAG_VON] do1
      ,[DO_VORMITTAG_BIS] do2
      ,[DO_NACHMITTAG_VON] do3
      ,[DO_NACHMITTAG_BIS] do4
      ,[FR_VORMITTAG_VON] fr1
      ,[FR_VORMITTAG_BIS] fr2
      ,[FR_NACHMITTAG_VON] fr3
      ,[FR_NACHMITTAG_BIS] fr4
      ,[SA_VORMITTAG_VON]  sa1
      ,[SA_VORMITTAG_BIS] sa2
      ,[SA_NACHMITTAG_VON] sa3
      ,[SA_NACHMITTAG_BIS] sa4
      ,[SO_VORMITTAG_VON] so1
      ,[SO_VORMITTAG_BIS] so2
      ,[SO_NACHMITTAG_VON] so3
      ,[SO_NACHMITTAG_BIS] so4
     FROM [pxs].[FACT_SPRECHSTUNDEN_UND_TELEFON_ERREICHBARKEIT]
	  """
    sql += f" WHERE lanr={lanr} AND bsnr={bsnr}"

    return pandas.io.sql.read_sql(sql, link)


def requestBetriebsstaetten():
    sql = """
	DECLARE @targetDate AS NVARCHAR(10);SET @targetDate = (select '2020-05-06');
	SELECT bs.[BSNR] ,bs.[STRASSE] ,bs.[PLZ] ,bs.[ORT] , latlng.[LATLNG].Lat LAT, latlng.[LATLNG].Long LNG
	FROM [ars].[DIM_BS_INFO] bs
	INNER JOIN [dbo].[DIM_BS_LATLNG] latlng ON latlng.ADDRESS_STRING = CONCAT(bs.[STRASSE], ', ', bs.[PLZ], ' ', bs.[ORT] ) AND STRASSE <> ''
	INNER JOIN [ars].[DIM_BS] bs_core ON bs_core.BS_ID = bs.[BS_ID]
	WHERE @targetDate BETWEEN bs.[VALID_FROM] AND bs.[VALID_TO] AND @targetDate BETWEEN bs_core.[VON] AND bs_core.[BIS]
	"""
    return pandas.io.sql.read_sql(sql, link)


def requestAerzte():
    sql = """
	DECLARE @targetDate AS NVARCHAR(10);SET @targetDate = (select '2020-05-06');
	SELECT DISTINCT
      bsle.[BSNR],
	  bsle.[HENR],
	  bsle.[LANR],
	  leinfo.[TITEL],
	  leinfo.[RUFNAME],
	  leinfo.[NACHNAME],


	  CASE WHEN leinfo.[GESCHLECHT] = 'weiblich' THEN N'F' ELSE N'M'  END AS [GENDER],
	  Convert(varchar(4),leinfo.GEBURTSDATUM),
	  CASE WHEN ag.[ARZTGRUPPE_BEDARFSPLANUNG] = '' THEN N'Mund-Kiefer-Gesichts-Chirurgie' ELSE ag.[ARZTGRUPPE_BEDARFSPLANUNG] END AS [ARZTGRUPPE],
	  leinfo.[FACHARZTBEZEICHNUNG],
	  leinfo.[TELEFON],
	  leinfo.[MOBIL_TELEFON],
	  leinfo.[EMAIL],
	  leinfo.[GRUPPE_KURZBEZEICHNUNG]

	FROM [ars].[DIM_LE_ERLAUBNIS_ARZTGRUPPE] ag
	INNER JOIN [ars].[DIM_BSLE] bsle
		ON bsle.[LE_ID] = ag.[LE_ID]
		AND bsle.IS_CURRENT = 1
	INNER JOIN [ars].[DIM_BS_INFO] bs
		ON bs.BS_ID = bsle.[BS_ID]
	INNER JOIN [ars].[DIM_BS] bs_core
		ON bs_core.BS_ID = bs.[BS_ID]
	INNER JOIN [ars].[DIM_LE_ERLAUBNIS_HE] erhe
		ON erhe.LE_ERLAUBNIS_ID = ag.LE_ERLAUBNIS_ID
		AND erhe.HENR = bsle.HENR
		AND erhe.IS_CURRENT = 1
	INNER JOIN [ars].[DIM_LE_INFO] leinfo
		ON leinfo.LE_ID = bsle.LE_ID
		AND leinfo.IS_CURRENT = 1
	WHERE @targetDate BETWEEN bs.[VALID_FROM] AND bs.[VALID_TO]
		AND @targetDate BETWEEN bs_core.[VON] AND bs_core.[BIS]
		AND @targetDate BETWEEN bsle.[VALID_FROM] AND bsle.[VALID_TO]
		AND @targetDate BETWEEN bsle.[VON] AND bsle.[BIS]
	ORDER BY 6
	"""
    return pandas.io.sql.read_sql(sql, link)


def testSchema(foo, wd, arzt, bsnr):
    MAX = 10
    if len(foo) == 2:
        m = foo[1]-foo[0]
        if foo[1]-foo[0] > MAX*60:
            print(f"{arzt['nachname']} \t{wd}@{bsnr}\t\tStunden: {m/60}")
    elif len(foo) == 4:
        m = foo[1]-foo[0] + foo[3]-foo[2]
        if m/60 > MAX:
            print(f"{arzt['nachname']} \t{wd}@{bsnr}\t\tStunden: {m/60}")


def cleanOpeningHours(foo):
    if not foo[0][0] and not foo[0][1] and not foo[1][0] and not foo[1][1]:
	    return None
    if foo[0][0] and not foo[0][1] and not foo[1][0] and foo[1][1]:
        return [[foo[0][0], foo[1][1]]]
    if foo[0][0] and foo[0][1] and not foo[1][0] and not foo[1][1]:
        return [[foo[0][0], foo[0][1]]]
    if not foo[0][0] and not foo[0][1] and foo[1][0] and foo[1][1]:
        return [[foo[1][0], foo[1][1]]]
    return foo

def getAerzteAndGroups():


    aerzteDict = {}
    groupsDict = {}
    for arzt in requestAerzte().values.tolist():
       # print(arzt)
        bsnr = int(arzt[0])
        lanr = int(arzt[2])
        titel = arzt[3]
        vorname = arzt[4]
        nachname = arzt[5]
        gender = arzt[6]
        ctime = int(arzt[7])
        arztgruppe = arzt[8]
        bezeichnung = arzt[9]
        telefon = arzt[10]
        mobile = arzt[11]
        mail = arzt[12]
        if lanr not in aerzteDict:
            aerzteDict[lanr] = {
                'lanr': lanr,
                'vorname': vorname,
                'nachname': nachname,
                'titel': titel,
                'gender': gender,
                'ctime': ctime,
                # 'henrs' :list(),
                '_bsnrs': list(),
                'bsnrs': {},
                'arztgroups': list(),
                'bezeichnung': bezeichnung,
                'telefon': telefon,
                'mobile': mobile,
                'mail': mail
            }
        if (bsnr not in aerzteDict[lanr]['_bsnrs']):
            aerzteDict[lanr]['_bsnrs'].append(bsnr)
        if (arztgruppe not in aerzteDict[lanr]['arztgroups']):
            aerzteDict[lanr]['arztgroups'].append(arztgruppe)
        if arztgruppe not in groupsDict:
            groupsDict[arztgruppe] = 1
        else:
            groupsDict[arztgruppe] += 1

    # Adding Opening Hours:
    for lanr in aerzteDict:
        arzt = aerzteDict[lanr]
        bsnrs = arzt['_bsnrs']
        arzt['bsnrs'] = {}
        for bsnr in bsnrs:
            arzt['bsnrs'][bsnr] = [[], [], [], [], [], [], []]
            schema = requestOpeningHours(lanr, bsnr)
            if (len(schema)):
                timestamps = schema.values.tolist()[0]

                for ndx, timestamp in enumerate(timestamps):
                    wd = ndx//4
                    # awd = arzt['bsnrs'][bsnr][wd]
                    mm = int(timestamp.split(':')[
                             0])*60 + int(timestamp.split(':')[1]) if timestamp != '' else None
                    # vormittag auf
                    if ndx % 4 == 0:
                        arzt['bsnrs'][bsnr][wd] = [[mm, None], [None, None]]
                    # vormittag zu
                    elif ndx % 4 == 1:
                        arzt['bsnrs'][bsnr][wd][0][1] = mm
                    # nachmittag auf
                    elif ndx % 4 == 2:
                        arzt['bsnrs'][bsnr][wd][1][0] = mm
                    # nachmittag zu
                    elif ndx % 4 == 3:
                        arzt['bsnrs'][bsnr][wd][1][1] = mm
                        # cleaning of empty entries
                        cleanedOpeningHours = cleanOpeningHours(arzt['bsnrs'][bsnr][wd])
                        arzt['bsnrs'][bsnr][wd]= cleanedOpeningHours
            else:
                arzt['bsnrs'][bsnr] = None
            if arzt['bsnrs'][bsnr] == [None,None,None,None,None,None,None] :
                arzt['bsnrs'][bsnr] = None
        del arzt['_bsnrs']

    # Converting to List:
    arztList = list()
    for a in aerzteDict:
        arztList.append(aerzteDict[a])
    sortedGroupsList = {k: v for k, v in sorted(
        groupsDict.items(), key=lambda item: item[1], reverse=True)}

    return (arztList, sortedGroupsList)


def resolveLocationsByMapquest(locations):
    CHUNKSIZE=100
    BBOX=[53.75, 9.67, 53.38, 10.33]
    KEY="3VNeiLAsT6GQ55PNgGozR9xGzcNNqd2J"

    def getChunks(locs, size):
        for i in range(0, len(locs), size):
            yield locs[i:i + size]

    for chunkIndex, chunkList in enumerate(getChunks(locations, CHUNKSIZE)):
        address=list(map(lambda location: location['address'], chunkList))
        for resultIndex, result in enumerate(geocoder.mapquest(address, key=KEY, bbox=BBOX, method='batch')):
            ndx=chunkIndex*CHUNKSIZE+resultIndex
            # print(result.__dict__['raw']['linkId'])


def resolveLocations(locations):
    with open('data/betriebsstaetten_1.0.0.json', encoding="utf-8") as json_file:
        geolocations={}
        for bs in json.load(json_file):
            geolocations[int(bs['bsnr'])]=bs['latlng']
    resolvedlocations=[]
    for loc in locations:
        bsnr=loc['bsnrs'][0]
        if bsnr in geolocations:
            resolvedlocations.append({
                'address': loc['address'],
                'latlng': geolocations[bsnr]
            })
            loc['latlng']=geolocations[bsnr]
    return (locations, resolvedlocations)


def getLocations():
    locationDict={}
    for bs in requestBetriebsstaetten().values.tolist():
        bsnr=int(bs[0])
        street=bs[1]
        plz=bs[2]
        city=bs[3]
        latlng=[bs[4], bs[5]]
        address=bs[1]+', ' + bs[2]+' '+bs[3]
        if address not in locationDict:
            locationDict[address]={
                'bsnrs': list(),
                'address': address,
                'zip': plz,
                'city': city,
                'street': street,
                'latlng': latlng,
                'arztgroups': list()
            }
        if bsnr not in locationDict[address]['bsnrs']:
            locationDict[address]['bsnrs'].append(bsnr)
    locationList=list()
    for loc in locationDict:
        locationList.append(locationDict[loc])
    # locationList.to_json(r'data/locationList.json',orient='records', indent=4, double_precision=0)
    return locationList


link=dwhlink.connectDWH()
(aerzte, groups)=getAerzteAndGroups()
locations=getLocations()
dwhlink.disconnectDWH(link)

for group in groups:
    pdf=Arztlist(orientation='P', unit='mm', format='A4')
    pdf.set_group(group)
    pdf.set_author("Kassenärztliche Vereinigung Hamburg")
    pdf.set_title("Übersicht " + group + " (KW 16/20202)")
    pdf.set_creator("Rainer Schleevoigt")
    pdf.add_page()
    pdf.output("pdf/" + group.replace(' ', '_') + ".pdf")

for location in locations:
    arztgroups=list()
    for bsnr in location['bsnrs']:
        for arzt in aerzte:
            if bsnr in arzt['bsnrs']:
                for g in arzt['arztgroups']:
                    if g not in arztgroups:
                        arztgroups.append(g)
    location['arztgroups']=arztgroups


# for arzt in aerzte :
    # del arzt['arztgroups']

with open('app/data/model_aerzte.json', 'w', encoding='utf-8') as f:
    json.dump(aerzte, f, ensure_ascii=False, indent=2)
with open('app/data/model_groups.json', 'w', encoding='utf-8') as f:
    json.dump(groups, f, ensure_ascii=False, indent=2)
with open('app/data/model_locations.json', 'w', encoding='utf-8') as f:
    json.dump(locations, f, ensure_ascii=False, indent=2)
