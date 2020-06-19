import * as functions from 'firebase-functions';
const admin = require('firebase-admin')

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.myFunction = functions.firestore
    .document('{colId}/{docId}')
    .onCreate(async (change, context) => {

        // the collections you want to trigger
        const setCols = ['product', 'identity'];

        // if not one of the set columns
        if (setCols.indexOf(context.params.colId) === -1) {
            return null;
        }

        
        return change.ref
        .set({
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        .catch((e: any) => {
            console.log(e);
            return false;
        });
        
        return null;
    });