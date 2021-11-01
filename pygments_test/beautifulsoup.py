from bs4 import BeautifulSoup

with open("cpp.html", "r") as file:
    content = file.read()

    soup = BeautifulSoup(content, "lxml")
    # labels = ['p', 'c', 'err', 'k', 'o', 'ch', 'cm', 'cp', 'cpf', 'c1', 'cs', 'gd', 'ge', 'gr', 'gh', 'gi', 'go', 'gp', 'gs', 'gu', 'gt', 'kc', 'kd', 'kn', 'kp', 'kr', 'kt', 'm', 's', 'na', 'nb', 'nc', 'no', 'nd', 'ni', 'ne', 'nf', 'nl', 'nn', 'nt', 'nv', 'ow', 'w', 'mb', 'mf', 'mh', 'mi', 'mo', 'sa', 'sb', 'sc', 'dl', 'sd', 's2', 'se', 'sh', 'si', 'sx', 'sr', 's1', 'ss', 'bp', 'fm', 'vc', 'vg', 'vi', 'vm', 'il']

    labels = {}
    for span in soup.find_all("span"):
        if span.has_attr("class"):
            if span["class"][0] not in labels:
                labels[span["class"][0]] = []
    # print(labels)
    for key in labels.keys():
        for element in soup.find_all("span", class_=key):
            code = element.text
            labels[key].append(code)

    for k, v in labels.items():
        print(k, ":", v)
