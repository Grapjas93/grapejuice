import glob
import fileinput
import xml.etree.ElementTree
from pathlib import Path


xmlfiles = []
xmlfilesname = []
for file in glob.glob("*.xml"):
    if not file.endswith(("_a.xml", "_e.xml")):
        with open(file,'r') as txt:
            text=txt.readlines()
            if text[2].startswith('">'):
                del text[2]
            with open(file,'w') as txt:
                txt.writelines(text)