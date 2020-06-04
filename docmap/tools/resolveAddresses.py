
def resolveAddresses() :
for chunkIndex,chunk in enumerate(getChunks(requests,CHUNKSIZE)):
            addressStrings = list(map(lambda request: request['addressString'],chunk))
            for resultIndex,result in enumerate(geocoder.mapquest(addressStrings, key=KEY, bbox=BBOX, method='batch')):
                ndx = chunkIndex*CHUNKSIZE+resultIndex
                print(result.__dict__['raw']['linkId'])
                betriebsstätte = {
                    'bsnr' : requests[ndx]['bsnr'],
                    'arztgruppen' : requests[ndx]['arztgruppen'],
                    'latlng' : result.latlng,
                    'strasse' : requests[ndx]['strasse'],
                    'plzort' : requests[ndx]['plzort'],
                    'linkId' : result.__dict__['raw']['linkId']
                    
                }
               # print(betriebsstätte)
                betriebsstätten.append(betriebsstätte);