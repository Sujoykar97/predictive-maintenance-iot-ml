import pandas as pd
from sklearn.svm import LinearSVC

import firebase_admin
from firebase_admin import credentials,firestore

cred = credentials.Certificate("./serviceAccountKey.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()
doc_ref = db.collection(u'dataset').document(u'test')
doc = doc_ref.get()
if doc.exists:
    test_data = doc.to_dict()
    test_data['voltage'] = [240]*29
else:
    print(u'No such document!')
 
data=pd.read_csv('./../SVM/dataset.csv')
df=pd.DataFrame(data)

df2 = pd.DataFrame(test_data)
x_train=df.loc[:,['Power','Current','Voltage']]
y_train=df.loc[:,['Result']]

x_test = df2.loc[:,['power','current','voltage']]

#Linear SVC
svm=LinearSVC()
svm.fit(x_train,y_train)
y_pred=svm.predict(x_test)
prob=svm._predict_proba_lr(x_test)

if y_pred[0]==1:
    print("It is working fine!")
    print("Chances of failure: ",round(((prob[0][0])*100),2),"%")
else:
    print("It is not working fine!")
    print("High chances of failure: ",round(((prob[0][0])*100),2),"%")

