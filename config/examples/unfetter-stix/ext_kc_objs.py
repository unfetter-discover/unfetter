 import random

eaFile = open('../mitre-stix/enterprise-attack.json')
ntctfAPFile = open('ntctf-attack-patterns.stix.json.csv')
 = open('ntctf-ap.csv', 'w')
descToken = '"description": "'
descTokenLen = len(descToken)
nameToken = '"name": "'
nameTokenLen = len(nameToken)
foundAP = False
apSecLine = ''

lines=eaFile.readlines()
for line in lines:
    # For ATT&CK:
    if foundAP:
        foundAP = False
        index = line.find(descToken)
        quoteIndex = line.find('"', index+descTokenLen)
        #f2.write('\t' + line[index+descTokenLen:quoteIndex] + '\n')
        continue
    index = line.find(nameToken)
    if index != -1:
        foundAP = True
        quoteIndex = line.find('"', index+nameTokenLen)
        f2.write(line[index+nameTokenLen:quoteIndex] + '\n')
    # for NTCTF:
    # if foundAP:
    #     foundAP = False
    #     index = line.find(nameToken)
    #     quoteIndex = line.find('"', index+nameTokenLen)
    #     f2.write(line[index+nameTokenLen:quoteIndex] + '\n')
    #     #f2.write(apDesc)
    #     continue
    # index = line.find(descToken)
    # if index != -1:
    #     foundAP = True
    #     quoteIndex = line.find('"', index+descTokenLen)
    #     apDesc = '\t' + line[index+descTokenLen:quoteIndex] + '\n'
f1.close()
f2.close()