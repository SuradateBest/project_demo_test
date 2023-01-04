import { app } from "../firebase";

export async function doesUsernameExist(Name) {
    const result = await app
        .firestore()
        .collection("Users")
        .where("Name", "==", Name)
        .get();

    return result.docs.map((user) => user.data().lenght > 0);
}