import DB from '../../firebase/functions'

//helper function to fetch products from database
export const handleFetchUser = (userId) => {
    return new Promise((resolve, reject) => {
        if (!userId) return;
        DB.collection("users").doc(userId).get().then(snapshot => {
            if (snapshot.exists) {
                resolve(snapshot.data());
            }
        }).catch(err => reject(err));

    })
}