import urllib
from urllib.request import urlopen
import firebase_admin
from firebase_admin import credentials,firestore

def isinternet():
    try:
        urlopen('https://www.google.co.in',timeout=1)
        return True
    except urllib.error.URLError:
        return False
if (isinternet()):
    print("Internet is connected")
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db=firestore.client()

    doc_ref=db.collection(u'data').document(u'consumption')

    try:
        doc=doc_ref.get()
        print(doc.to_dict())
    except google.cloud.exceptions.NotFound:
        print(u'No such document')
else:
    print("Internet is not connected")