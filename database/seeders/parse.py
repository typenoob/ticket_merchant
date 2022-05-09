import copy
from numpy import identity
import openpyxl
workbook = openpyxl.load_workbook("./database/seeders/data.xlsx")
worksheet = workbook['时刻表']
results = []
result = {'train_number': None,
          'station_name': None,
          'next_station': None,
          'arrive_time': None,
          'depart_time': None, }
flag = False
for row in worksheet.rows:
    if row[-2].value is not None and flag:
        result['next_station'] = result['station_name']
        result['depart_time'] = None
        results.append(copy.deepcopy(result))
    if row[-2].value == 'ALL':
        flag = True
        result['train_number'] = row[0].value
        result['station_name'] = row[8].value
        result['arrive_time'] = None
        result['depart_time'] = row[10].value.strftime('%H:%M:%S')
    elif row[-2].value is None:
        result['next_station'] = row[8].value
        if flag:
            results.append(copy.deepcopy(result))
        result['station_name'] = row[8].value
        result['arrive_time'] = row[9].value.strftime('%H:%M:%S')
        result['depart_time'] = row[10].value.strftime('%H:%M:%S')
    else:
        flag = False
with open("./database/data.json", "w", encoding='utf-8') as f:
    f.write(str(results).replace("None", 'null').replace("'", '"'))
