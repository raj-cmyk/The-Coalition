# import necessary modules
import requests
from bs4 import BeautifulSoup
import os
import zipfile
import time
from collections import defaultdict
import numpy as np
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

"""
example URLs
https://www.kaggle.com/saurabhshahane/us-electric-power-generators
https://www.kaggle.com/saurabhshahane/us-electric-power-generators?select=y2001.csv
https://www.kaggle.com/saurabhshahane/us-electric-power-generators/download
"""

def getSoup(url):
    """Returns a BeautifulSoup object for the provided url"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup

# baseUrl = "https://www.kaggle.com/saurabhshahane/us-electric-power-generators?select=y20"
baseUrl = "https://www.eia.gov/electricity/data/eia860/"
parentDir = "C:/Users/LuciusFish/Desktop/elecFiles/"

yrs = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003",
       "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017",
       "2018", "2019", "2020", "2021", "2022"]

zipLinks = []

soup = getSoup(baseUrl)
soupLinks = soup.find_all(href = True)
for i in soupLinks:
    for y in yrs:
        if y in str(i):
            yearFile = y + "files"
            zipName = "/" + y + ".zip"

    link = i["href"]

    if ".zip" in link:
        if "b" in link: pass
        else:
            wholeLink = "https://www.eia.gov/electricity/data/" + link
            zipLinks.append(wholeLink)

            path = os.path.join(parentDir, yearFile)
            os.mkdir(path)

            zipPath = path + zipName
            print(zipPath)
            zipFile = requests.get(wholeLink, stream = True)
            with open(zipPath, "wb") as f:
                for chunk in zipFile.iter_content(chunk_size = 128):
                    f.write(chunk)

            print(path)

            with zipfile.ZipFile(path, 'r') as zippedFile:
                zippedFile.extractall(path)



#
# csvUrls = []
#
# for yr in yrs:
#     urlYr = baseUrl + yr + ".csv"
#     yrSoup = getSoup(urlYr)
#     y = []
#
# print("\ncsvUrls:")
# for i in csvUrls:
#     print("   " + i)
# print("\nend csvUrls\n\n")
#
# csvFile = requests.get()
